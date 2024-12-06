export default defineBackground(() => {
  browser.runtime.onInstalled.addListener(function () {
    // Open the options page
    browser.runtime.openOptionsPage();
  });

  // Create context menu on text selection
  browser.contextMenus.create({
    id: 'sendToAI',
    title: 'JarGone!',
    contexts: ['selection'],
  });

  browser.contextMenus.onClicked.addListener(async (info, tab) => {
    if (info.menuItemId === 'sendToAI' && info.selectionText && tab?.id) {
      let errorState: boolean = false;
      const settingsStoreKey = 'settings';
      const keywordStoreKey = 'keywordHistory';

      // Load settings from local storage
      const savedSettings: string | null = await storage.getItem(`local:${settingsStoreKey}`);
      const parsedSettings = savedSettings ? JSON.parse(savedSettings) : {};
      const apiKey = parsedSettings.apiKey || '';
      const confettiAnimation = parsedSettings.confettiAnimation !== undefined ? parsedSettings.confettiAnimation : true;
      const replaceText = parsedSettings.replaceText !== undefined ? parsedSettings.replaceText : true;
      const locale = parsedSettings.locale || 'english';

      const selectedText = info.selectionText;

      if (replaceText) {
        const promptText = [
          {
            role: "system",
            content: "You are a helpful assistant that reformats text for simplicity and extracts complex keywords with explanations."
          },
          {
            role: "user",
            content: `Please rewrite the following text that is currently too tough to understand. Ensure that the meaning of the rewritten text does not alter the original meaning. Also scrape 3 most obscure/complex keywords/phrases from the text, categorize them grammatically, and provide their meaning in a structured JSON format.\n\nHere is the text:\n\`\`\`\n${selectedText}\n\`\`\`\nThe following is the expected output JSON structure:\n\`\`\`\n{\n   "rewrittenText": "simplified version of the text in ${locale.toUpperCase()} language",\n   "keywords": [\n      {\n         "keyword": "keyword or phrase",\n         "type": "grammatical type",\n         "meaning": "explanation in ${locale.toUpperCase()} language"\n      }\n   ]\n}\n\`\`\`\nOnly output JSON. Do NOT output any other format.`
          }
        ];

        let rewrittenText: string = '';
        let keywordArray: Keyword[] = []

        // Change cursor to waiting state
        browser.tabs.sendMessage(tab.id, { type: 'CHANGE_CURSOR', state: 'waiting' });

        try {
          // Send request to LLM
          const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
              "model": 'gpt-4o-mini',
              "messages": promptText,
            }),
          });

          const data = await response.json();
          const result = data.choices[0]?.message?.content;
          const cleanedResult = result.replace(/```json|```/g, '').trim();
          const resultJson = JSON.parse(cleanedResult);
          rewrittenText = resultJson.rewrittenText.trim();
          keywordArray = resultJson.keywords;

        } catch (error) {
          console.error('Error: ', error);
          keywordArray = [
            {
              "keyword": "error occurred",
              "type": "error",
              "meaning": `oh no! the empire struck back (x_x;) - Error: ${error}. please report it using the button on the top right.`
            }
          ];
          rewrittenText = `${selectedText} [!!! ERROR - OPEN EXTENSION POPUP !!!]`;
          errorState = true;
        }

        try {
          // Store result in local storage
          let keywordHistory: string | null = await storage.getItem(`local:${keywordStoreKey}`);
          let keywordHistoryArray: Keyword[] | null = JSON.parse(keywordHistory || '[]');
          if (!keywordHistoryArray) {
            keywordHistoryArray = [];
          }
          await storage.setItem(`local:${keywordStoreKey}`, JSON.stringify([...keywordHistoryArray, ...keywordArray]));

          // Send result to content script
          browser.tabs.sendMessage(tab.id, {
            type: 'REPLACE_TEXT',
            newText: rewrittenText,
            enableConfetti: errorState ? false : confettiAnimation,
          });
        } catch (error) {
          console.error('Error: ', error);
          alert('Error: ' + error);
        }

        // Change cursor back to default state
        browser.tabs.sendMessage(tab.id, { type: 'CHANGE_CURSOR', state: 'default' });

      } else {

        const promptText = [
          {
            role: "system",
            content: "You are a helpful assistant that reformats text for simplicity by extracting complex keywords with explanations."
          },
          {
            role: "user",
            content: `Provide a JSON output containing all the obscure and difficult words or phrases from the following text, with their simplified meaning and grammatical type. Please limit the simplified meaning to 5 - 7 words only, and ensure that the meaning is easy to understand and in line with the context of the sentence.\n\nHere is the text:\n\`${selectedText}\`\nThe following is the expected output JSON structure:\n\`\`\`\n{\n   "keywords":[\n      {\n         "keyword":"keyword or phrase",\n         "type":"grammatical type",\n         "meaning":"simplified meaning using simple words in ${locale.toUpperCase()} language"\n}\n   ]\n}\n\`\`\`\nOnly output JSON. Do NOT output any other format.`
          }
        ];

        let keywordArray: Keyword[] = []

        // Change cursor to waiting state
        browser.tabs.sendMessage(tab.id, { type: 'CHANGE_CURSOR', state: 'waiting' });

        try {
          // Send request to LLM
          const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
              "model": 'gpt-4o-mini',
              "messages": promptText,
            }),
          });

          const data = await response.json();
          const result = data.choices[0]?.message?.content;
          const cleanedResult = result.replace(/```json|```/g, '').trim();
          const resultJson = JSON.parse(cleanedResult);
          keywordArray = resultJson.keywords;

        } catch (error) {
          console.error('Error: ', error);
          const cleanedText = selectedText.replace(/^[.,\s]+|[.,\s]+$/g, '');
          keywordArray = [
            {
              "keyword": "ERROR",
              "type": "error",
              "meaning": `Error: ${error}`
            }
          ];
          errorState = true;
        }

        // Change cursor back to default state
        browser.tabs.sendMessage(tab.id, { type: 'CHANGE_CURSOR', state: 'default' });

        // Send result to content script
        browser.tabs.sendMessage(tab.id, {
          type: 'NOREPLACE_TEXT',
          keywordArrayString: JSON.stringify(keywordArray),
          enableConfetti: errorState ? false : confettiAnimation,
        });
      }

      // Reset error state
      errorState = false;
    }
  });
})
