import './style.css'
import confetti from 'canvas-confetti'

export default defineContentScript({
  main() {
    let mouseX = 0
    let mouseY = 0

    document.addEventListener('mousemove', (event) => {
      mouseX = event.clientX
      mouseY = event.clientY
    })

    browser.runtime.onMessage.addListener((message: unknown) => {
      const { type } = message as { type: string }

      switch (type) {
        case 'CHANGE_CURSOR':
          handleCursorChange(message as { state: string })
          break
        case 'NOREPLACE_TEXT':
          handleNoReplaceText(message as { enableConfetti: boolean, keywordArrayString: string })
          break
        case 'REPLACE_TEXT':
          handleReplaceText(message as { enableConfetti: boolean, newText: string })
          break
        default:
          console.warn(`Unhandled message type: ${type}`)
      }

      return undefined
    })

    function handleCursorChange({ state }: { state: string }) {
      document.body.style.cursor = state === 'waiting' ? 'wait' : 'default'
    }

    function handleReplaceText({ enableConfetti, newText }: { enableConfetti: boolean, newText: string }) {
      const selection = window.getSelection()
      if (!selection?.rangeCount) {
        return
      }

      const range = selection.getRangeAt(0)
      range.deleteContents()
      const span = document.createElement('span')
      span.textContent = newText
      span.classList.add('zoom-in')
      range.insertNode(span)

      if (enableConfetti) {
        triggerConfetti()
      }
    }

    const getTypeColors = (type: string): string => {
      const opacity = 0.5
      const typeColors: { [key: string]: string } = {
        adjective: `rgba(81, 240, 160, ${opacity})`,
        default: `rgba(255, 217, 0, ${opacity})`,
        error: `rgba(254, 115, 115, ${opacity})`,
        idiom: `rgba(185, 115, 254, ${opacity})`,
        noun: `rgba(0, 200, 255, ${opacity})`,
        slang: `rgba(255, 195, 0, ${opacity})`,
        verb: `rgba(255, 112, 174, ${opacity})`,
      }

      const normalizedType = Object.keys(typeColors).find(key => type.toLowerCase().includes(key))
      return typeColors[normalizedType || 'default']
    }

    function handleNoReplaceText({ enableConfetti, keywordArrayString }: { enableConfetti: boolean, keywordArrayString: string }) {
      const selection = window.getSelection()
      if (!selection?.rangeCount) {
        return
      }

      const range = selection.getRangeAt(0)

      const container = document.createElement('div')
      container.appendChild(range.cloneContents())
      Array.from(container.querySelectorAll('span#jargone-noreplace-tooltip')).forEach((tooltipSpan) => {
        tooltipSpan.remove()
      })

      const selectedText = container.textContent || ''
      const keywords: Keyword[] = JSON.parse(keywordArrayString)

      let modifiedText = selectedText
      keywords.forEach(({ keyword, meaning, type }) => {
        const regex = new RegExp(`\\b${keyword}\\b`, 'gi')
        modifiedText = modifiedText.replace(regex, (match) => {
          const backgroundColor = getTypeColors(type)
          return `<span class="zoom-in" style="position:relative;display:inline-block;background-color:${backgroundColor};">${match}<span id="jargone-noreplace-tooltip" style="visibility:hidden;background-color:black;color:white;text-align:center;border-radius:4px;padding:4px;position:absolute;bottom:100%;left:50%;transform:translateX(-50%);white-space:nowrap;z-index:1000;opacity:0;transition:opacity0.2s;">${meaning}</span></span>`
        })
      })

      const tempContainer = document.createElement('div')
      tempContainer.innerHTML = modifiedText

      Array.from(tempContainer.querySelectorAll('span')).forEach((span) => {
        const tooltip = span.querySelector('span:last-child') as HTMLSpanElement | null
        if (!tooltip) {
          return
        }

        span.addEventListener('mouseenter', () => {
          tooltip.style.visibility = 'visible'
          tooltip.style.opacity = '1'
        })

        span.addEventListener('mouseleave', () => {
          tooltip.style.visibility = 'hidden'
          tooltip.style.opacity = '0'
        })
      })

      range.deleteContents()
      const fragment = document.createDocumentFragment()
      Array.from(tempContainer.childNodes).forEach(node => fragment.appendChild(node))
      range.insertNode(fragment)

      if (enableConfetti) {
        triggerConfetti()
      }
    }

    function triggerConfetti() {
      const canvas = document.createElement('canvas')
      canvas.style.position = 'fixed'
      canvas.style.top = '0'
      canvas.style.left = '0'
      canvas.style.width = '100vw'
      canvas.style.height = '100vh'
      canvas.style.pointerEvents = 'none'
      canvas.style.zIndex = '1000'
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      document.body.appendChild(canvas)

      const confettiAnimation = confetti.create(canvas, {
        disableForReducedMotion: true,
        resize: true,
        useWorker: true,
      })

      confettiAnimation({
        gravity: 1.5,
        origin: { x: mouseX / window.innerWidth, y: mouseY / window.innerHeight },
        particleCount: 100,
        spread: 100,
        ticks: 75,
      })

      setTimeout(() => {
        confettiAnimation.reset()
        canvas.remove()
      }, 2000)
    }
  },

  matches: [],
  registration: 'runtime',
})
