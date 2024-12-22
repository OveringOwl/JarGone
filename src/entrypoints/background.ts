export default defineBackground(() => {
  const settingsStoreKey = 'settings'
  const keywordStoreKey = 'keywordHistory'

  // Initialize extension
  browser.runtime.onInstalled.addListener(() => {
    browser.runtime.openOptionsPage()
    browser.contextMenus.create({
      contexts: ['selection'],
      id: 'sendToAI',
      title: 'JarGone!',
    })
  })

  browser.sidePanel.setPanelBehavior({ openPanelOnActionClick: true })

  browser.contextMenus.onClicked.addListener(async (info: any, tab: any) => {
    if (info.menuItemId === 'sendToAI' && info.selectionText && tab?.id) {
      browser.sidePanel.open({ windowId: tab.windowId })

      const selectedText = info.selectionText
      const settings = await loadSettings()
      const apiKey = settings.apiKey || ''
      const locale = settings.locale || 'english'
      const enableConfetti = settings.confettiAnimation !== false
      const enableReplaceText = settings.replaceText !== false

      try {
        if (tab.id) {
          await browser.scripting.executeScript({
            files: ['/content-scripts/content.js'],
            target: { tabId: tab.id },
          })
        }

        browser.tabs.sendMessage(tab.id, { state: 'waiting', type: 'CHANGE_CURSOR' })

        const result = await fetchLLMResponse(selectedText, apiKey, locale, enableReplaceText)
        const { keywordArray, rewrittenText } = processLLMResponse(result, selectedText)
        await storeKeywords(keywordArray)

        const message = enableReplaceText
          ? { enableConfetti, newText: rewrittenText, type: 'REPLACE_TEXT' }
          : { enableConfetti, keywordArrayString: JSON.stringify(keywordArray), type: 'NOREPLACE_TEXT' }

        browser.tabs.sendMessage(tab.id, message)
      }
      catch (error) {
        console.error('Error:', error)
        handleLLMError(tab.id, selectedText, enableReplaceText, error)
      }
      finally {
        browser.tabs.sendMessage(tab.id, { state: 'default', type: 'CHANGE_CURSOR' })
      }
    }
  })

  // Helper functions

  async function loadSettings() {
    const savedSettings = await storage.getItem(`local:${settingsStoreKey}`)
    return savedSettings ? JSON.parse(savedSettings as string) : {}
  }

  async function fetchLLMResponse(selectedText: string, apiKey: string, locale: string, replaceText: boolean) {
    const keywordsLimit = Math.floor(selectedText.trim().split(/\s+/).length * 0.15)
    const systemContent = replaceText
      ? 'You are an expert in text simplification that rewrites text for simplicity and extracts complex keywords with explanations.'
      : 'You are an expert in text simplification that extracts complex keywords with explanations.'

    const userContent = replaceText
      ? `Please rewrite the following text that is currently too tough to understand. Ensure that the meaning of the rewritten text does not alter the original meaning. Also extract 1-${keywordsLimit} most difficult words/phrases from the text, categorize them grammatically, and provide their contextualized meaning in a structured JSON format.\n\nHere is the text:\n\`\`\`\n${selectedText}\n\`\`\`\n\nThe following is the expected output JSON structure:\n\`\`\`json\n{\n   "rewrittenText":"simplified version of the text in ${locale.toUpperCase()} language",\n   "keywords":[\n      {\n         "keyword":"keyword or phrase",\n         "type":"grammatical type",\n         "meaning":"simplified meaning using simple words in ${locale.toUpperCase()} language"\n      }\n   ]\n}\n\`\`\`\nOnly output JSON. Do NOT output any other format.`
      : `Provide a JSON output containing all the obscure and difficult words or phrases from the following text, with their simplified meaning and grammatical type. Please limit the simplified meaning to 1-${keywordsLimit} most difficult words/phrases only, and ensure that the meaning is contextualized and easy to understand.\n\nHere is the text:\n\`\`\`\n${selectedText}\n\`\`\`\n\nThe following is the expected output JSON structure:\n\`\`\`json\n{\n   "keywords":[\n      {\n         "keyword":"keyword or phrase",\n         "type":"grammatical type",\n         "meaning":"simplified meaning using simple words in ${locale.toUpperCase()} language"\n}\n   ]\n}\n\`\`\`\nOnly output JSON. Do NOT output any other format.`

    const messages = [
      { content: systemContent, role: 'system' },
      { content: userContent, role: 'user' },
    ]

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      body: JSON.stringify({ messages, model: 'gpt-4o-mini' }),
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })

    if (!response.ok) {
      const errorMessage = response.status === 401
        ? 'Invalid API key. Please check and try again.'
        : `Failed to fetch. Status: ${response.status}`
      throw new Error(errorMessage)
    }

    return response.json()
  }

  function processLLMResponse(data: any, fallbackText: string) {
    try {
      const result = data.choices[0]?.message?.content.replace(/```json|```/g, '').trim()
      const resultJson = JSON.parse(result)
      return {
        keywordArray: resultJson.keywords || [],
        rewrittenText: resultJson.rewrittenText?.trim() || fallbackText,
      }
    }
    catch (error: any) {
      console.error('Error parsing LLM response:', error)
      return {
        keywordArray: [
          {
            keyword: 'error occurred',
            meaning: `oh no! the empire struck back... Details: ${error.message}`,
            type: 'error',
          },
        ],
        rewrittenText: fallbackText,
      }
    }
  }

  async function storeKeywords(keywordArray: Keyword[]) {
    const existingKeywords = await storage.getItem(`local:${keywordStoreKey}`)
    const keywordHistory = existingKeywords ? JSON.parse(existingKeywords as string) : []
    await storage.setItem(`local:${keywordStoreKey}`, JSON.stringify([...keywordHistory, ...keywordArray]))
  }

  async function handleLLMError(tabId: number, fallbackText: string, enableReplaceText: boolean, error: any) {
    const keywordArray = [
      {
        keyword: 'error occurred',
        meaning: `oh no! the empire struck back... Details: ${error}.`,
        type: 'error',
      },
    ]

    await storeKeywords(keywordArray)
  }
})
