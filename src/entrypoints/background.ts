export default defineBackground(() => {
  const settingsStoreKey = 'settings';
  const keywordStoreKey = 'keywordHistory';

  // Initialize extension
  browser.runtime.onInstalled.addListener(function () {
    browser.runtime.openOptionsPage();
    browser.contextMenus.create({
      id: 'sendToAI',
      title: 'JarGone!',
      contexts: ['selection'],
    });
  });

  browser.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });

  browser.contextMenus.onClicked.addListener(async (info: any, tab: any) => {
    if (info.menuItemId === 'sendToAI' && info.selectionText && tab?.id) {
      browser.sidePanel.open({ windowId: tab.windowId });

      const selectedText = info.selectionText;
      const settings = await loadSettings();
      const apiKey = settings.apiKey || '';
      const locale = settings.locale || 'english';
      const enableReplaceText = settings.replaceText !== false;

      browser.tabs.sendMessage(tab.id, { type: 'CHANGE_CURSOR', state: 'waiting' });

      try {
        const result = await fetchLLMResponse(selectedText, apiKey, locale, enableReplaceText);
        const { rewrittenText, keywordArray } = processLLMResponse(result, selectedText, enableReplaceText);
        await storeKeywords(keywordArray);

        const message = enableReplaceText
          ? { type: 'REPLACE_TEXT', newText: rewrittenText, enableConfetti: settings.confettiAnimation }
          : { type: 'NOREPLACE_TEXT', keywordArrayString: JSON.stringify(keywordArray), enableConfetti: settings.confettiAnimation };

        browser.tabs.sendMessage(tab.id, message);
      } catch (error) {
        console.error('Error:', error);
        handleLLMError(tab.id, selectedText, enableReplaceText, error);
      } finally {
        browser.tabs.sendMessage(tab.id, { type: 'CHANGE_CURSOR', state: 'default' });
      }
    }
  });

  // Helper functions

  async function loadSettings() {
    const savedSettings = await storage.getItem(`local:${settingsStoreKey}`);
    return savedSettings ? JSON.parse(savedSettings as string) : {};
  }

  async function fetchLLMResponse(selectedText: string, apiKey: string, locale: string, replaceText: boolean) {
    const systemContent = replaceText
      ? "You are an expert in text simplification that rewrites text for simplicity and extracts complex keywords with explanations."
      : "You are an expert in text simplification that extracts complex keywords with explanations.";

    const userContent = replaceText
      ? `Please rewrite the following text that is currently too tough to understand. Ensure that the meaning of the rewritten text does not alter the original meaning. Also extract 3-5 most difficult words/phrases from the text, categorize them grammatically, and provide their contextualized meaning in a structured JSON format.\n\nHere is the text:\n\`\`\`\n${selectedText}\n\`\`\`\n\nThe following is the expected output JSON structure:\n\`\`\`json\n{\n   "rewrittenText":"simplified version of the text in ${locale.toUpperCase()} language",\n   "keywords":[\n      {\n         "keyword":"keyword or phrase",\n         "type":"grammatical type",\n         "meaning":"simplified meaning using simple words in ${locale.toUpperCase()} language"\n      }\n   ]\n}\n\`\`\`\nOnly output JSON. Do NOT output any other format.`
      : `Provide a JSON output containing all the obscure and difficult words or phrases from the following text, with their simplified meaning and grammatical type. Please limit the simplified meaning to 5-7 most difficult words/phrases only, and ensure that the meaning is contextualized and easy to understand.\n\nHere is the text:\n\`\`\`\n${selectedText}\n\`\`\`\n\nThe following is the expected output JSON structure:\n\`\`\`json\n{\n   "keywords":[\n      {\n         "keyword":"keyword or phrase",\n         "type":"grammatical type",\n         "meaning":"simplified meaning using simple words in ${locale.toUpperCase()} language"\n}\n   ]\n}\n\`\`\`\nOnly output JSON. Do NOT output any other format.`;

    const messages = [
      { role: 'system', content: systemContent },
      { role: 'user', content: userContent },
    ];

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ model: 'gpt-4o-mini', messages }),
    });

    if (!response.ok) {
      const errorMessage = response.status === 401
        ? 'Invalid API key. Please check and try again.'
        : `Failed to fetch. Status: ${response.status}`;
      throw new Error(errorMessage);
    }

    return response.json();
  }

  function processLLMResponse(data: any, fallbackText: string, replaceText: boolean) {
    try {
      const result = data.choices[0]?.message?.content.replace(/```json|```/g, '').trim();
      const resultJson = JSON.parse(result);
      return {
        rewrittenText: resultJson.rewrittenText?.trim() || fallbackText,
        keywordArray: resultJson.keywords || [],
      };
    } catch (error: any) {
      console.error('Error parsing LLM response:', error);
      return {
        rewrittenText: fallbackText,
        keywordArray: [
          {
            keyword: 'error occurred',
            type: 'error',
            meaning: `oh no! the empire struck back... Details: ${error.message}`,
          },
        ],
      };
    }
  }

  async function storeKeywords(keywordArray: Keyword[]) {
    const existingKeywords = await storage.getItem(`local:${keywordStoreKey}`);
    const keywordHistory = existingKeywords ? JSON.parse(existingKeywords as string) : [];
    await storage.setItem(`local:${keywordStoreKey}`, JSON.stringify([...keywordHistory, ...keywordArray]));
  }

  async function handleLLMError(tabId: number, fallbackText: string, enableReplaceText: boolean, error: any) {
    const keywordArray = [
      {
        "keyword": "error occurred",
        "type": "error",
        "meaning": `oh no! the empire struck back... Details: ${error}.`
      }
    ];

    await storeKeywords(keywordArray);
  }
});
