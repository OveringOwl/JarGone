import confetti from 'canvas-confetti';

export default defineContentScript({
  matches: ['<all_urls>'],

  main() {
    let mouseX = 0;
    let mouseY = 0;

    // Capture the pointer location on right-click
    document.addEventListener('contextmenu', (event) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
    });

    browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.type === 'CHANGE_CURSOR') {
        document.body.style.cursor = message.state === 'waiting' ? 'wait' : 'default';
      }

      if (message.type === 'REPLACE_TEXT') {
        const { newText, enableConfetti } = message;

        // Get the current selection and range
        const selection = window.getSelection();
        if (!selection?.rangeCount) return;

        const range = selection.getRangeAt(0);

        // Insert the new text directly in place of the selected text
        range.deleteContents();
        const newTextNode = document.createTextNode(newText);
        range.insertNode(newTextNode);

        if (enableConfetti) {
          // Create and style the canvas element for confetti effect
          const canvas = document.createElement('canvas');
          canvas.style.position = 'fixed';
          canvas.style.top = '0';
          canvas.style.left = '0';
          canvas.style.width = '100vw';
          canvas.style.height = '100vh';
          canvas.style.pointerEvents = 'none';
          canvas.style.zIndex = '1000'; // Ensure it appears above other elements
          canvas.width = window.innerWidth;
          canvas.height = window.innerHeight;
          document.body.appendChild(canvas);

          // Initialize confetti animation on the canvas
          const confettiAnimation = confetti.create(canvas, {
            resize: true,
            useWorker: true,
            disableForReducedMotion: true,
          });

          // Fire confetti with the origin set to the click location
          confettiAnimation({
            particleCount: 100,
            spread: 100,
            origin: { x: mouseX / window.innerWidth, y: mouseY / window.innerHeight },
            gravity: 1.5,
            ticks: 75,
          });

          // Clean up the canvas after the animation
          setTimeout(() => {
            confettiAnimation.reset();
            canvas.remove();
          }, 2000);
        }
      }

      if (message.type === 'NOREPLACE_TEXT') {
        const opacity = 0.5;
        const typeColors: { [key: string]: string } = {
          'adjective': `rgba(81, 240, 160, ${opacity})`,
          'verb': `rgba(255, 112, 174, ${opacity})`,
          'noun': `rgba(0, 200, 255, ${opacity})`,
          'idiom': `rgba(185, 115, 254, ${opacity})`,
          'slang': `rgba(255, 195, 0, ${opacity})`,
          'error': `rgba(254, 115, 115, ${opacity})`,
          default: `rgba(255, 217, 0, ${opacity})`
        };
        // Function to get background color based on grammatical type
        const getTypeColors = (type: string): string => {
          // Check if the type includes one of the defined types
          const normalizedType = Object.keys(typeColors).find((key) => type.toLowerCase().includes(key));
          return typeColors[normalizedType || 'default'];
        };

        const { keywordArrayString, enableConfetti } = message;
        // Parse the JSON array from the message
        const keywords: Keyword[] = JSON.parse(keywordArrayString);

        const selection = window.getSelection();
        if (!selection?.rangeCount) return;
        const range = selection.getRangeAt(0);
        const selectedText = range.toString();

        // Create a container to hold the transformed content
        const tempContainer = document.createElement('div');

        if (enableConfetti) {
          // Create and style the canvas element for confetti effect
          const canvas = document.createElement('canvas');
          canvas.style.position = 'fixed';
          canvas.style.top = '0';
          canvas.style.left = '0';
          canvas.style.width = '100vw';
          canvas.style.height = '100vh';
          canvas.style.pointerEvents = 'none';
          canvas.style.zIndex = '1000'; // Ensure it appears above other elements
          canvas.width = window.innerWidth;
          canvas.height = window.innerHeight;
          document.body.appendChild(canvas);

          // Initialize confetti animation on the canvas
          const confettiAnimation = confetti.create(canvas, {
            resize: true,
            useWorker: true,
            disableForReducedMotion: true,
          });

          // Fire confetti with the origin set to the click location
          confettiAnimation({
            particleCount: 100,
            spread: 100,
            origin: { x: mouseX / window.innerWidth, y: mouseY / window.innerHeight },
            gravity: 1.5,
            ticks: 75,
          });

          // Clean up the canvas after the animation
          setTimeout(() => {
            confettiAnimation.reset();
            canvas.remove();
          }, 2000);
        }

        // Replace each keyword in the selected text
        let modifiedText = selectedText;
        keywords.forEach(({ keyword, type, meaning }) => {
          const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
          if (type === 'error') {
            modifiedText = `ERROR ${selectedText}`;
          }
          modifiedText = modifiedText.replace(regex, (match) => {
            const backgroundColor = getTypeColors(type);
            return `<span style="position: relative; display: inline-block; background-color: ${backgroundColor};">${match}<span style="visibility: hidden;background-color: black;color: white;text-align: center;border-radius: 4px;padding: 4px;position: absolute;bottom: 100%;left: 50%;transform: translateX(-50%);white-space: nowrap;z-index: 1000;opacity: 0;transition: opacity 0.2s;">${meaning}</span></span>`;
          });
        });

        // Insert the transformed content back into the DOM
        tempContainer.innerHTML = modifiedText;

        Array.from(tempContainer.querySelectorAll('span')).forEach((span) => {
          // Get the tooltip span directly under the current span
          const tooltip = span.querySelector('span:last-child') as HTMLSpanElement | null;

          if (!tooltip) return; // Safeguard: Skip if tooltip is not found

          span.addEventListener('mouseenter', () => {
            if (tooltip) {
              tooltip.style.visibility = 'visible';
              tooltip.style.opacity = '1';
            }
          });

          span.addEventListener('mouseleave', () => {
            if (tooltip) {
              tooltip.style.visibility = 'hidden';
              tooltip.style.opacity = '0';
            }
          });
        });

        // Replace the original selection with modified content
        range.deleteContents();
        const fragment = document.createDocumentFragment();
        Array.from(tempContainer.childNodes).forEach((node) => fragment.appendChild(node));
        range.insertNode(fragment);
      }
    });
  },
});
