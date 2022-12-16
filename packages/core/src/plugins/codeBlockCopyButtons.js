const cheerio = module.parent.require('cheerio');
const {
  CONTAINER_HTML,
  doesFunctionBtnContainerExistInNode,
  isFunctionBtnContainer,
} = require('./codeBlockButtonsAssets/codeBlockButtonsContainer');

const COPY_ICON = `
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
  width="18" height="18" viewBox="0 0 18 18" version="1.1">
    <g id="surface1">
      <path d="M 11.273438 0 L 2.546875 0 C 1.746094 0 1.089844 0.613281 1.089844
      1.363281 L 1.089844 10.910156 L 2.546875 10.910156 L 2.546875 1.363281 L 11.273438
      1.363281 Z M 13.453125 2.726562 L 5.453125 2.726562 C 4.65625 2.726562 4 3.339844 4
      4.089844 L 4 13.636719 C 4 14.386719 4.65625 15 5.453125 15 L 13.453125 15 C 14.253906
      15 14.910156 14.386719 14.910156 13.636719 L 14.910156 4.089844 C 14.910156 3.339844
      14.253906 2.726562 13.453125 2.726562 Z M 13.453125 13.636719 L 5.453125 13.636719 L
      5.453125 4.089844 L 13.453125 4.089844 Z M 13.453125 13.636719 "/>
    </g>
</svg>
`;

const COPIED_ICON = `
<svg fill="#000000" xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 30 30" width="18" height="18">
    <path d="M 26.980469 5.9902344 A 1.0001 1.0001 0 0 0 26.292969 6.2929688 L 11
    21.585938 L 4.7070312 15.292969 A 1.0001 1.0001 0 1 0 3.2929688 16.707031 L 10.292969
    23.707031 A 1.0001 1.0001 0 0 0 11.707031 23.707031 L 27.707031 7.7070312 A 1.0001
    1.0001 0 0 0 26.980469 5.9902344 z"/>
</svg>
`;

function getButtonHTML() {
  const html = `<button onclick="copyCodeBlock(this)" class="function-btn">
    <div class="function-btn-body">
    ${COPY_ICON}
    </div>
    </button>`;
  return html;
}

const copyCodeBlockScript = `<script>

    function getCopiedIcon() {
      const html = \`<div class="function-btn-body">
        ${COPIED_ICON} Copied!
        </div>\`;
      return html;
    }
     
    function copyCodeBlock(element) {
        const pre = element.parentElement.parentElement;
        const codeElement = pre.querySelector('code');

        // create dummy text element to select() the text field
        const textElement = document.createElement('textarea');
        textElement.value = codeElement.textContent;
        document.body.appendChild(textElement);
        textElement.select();
        document.execCommand('copy');
        document.body.removeChild(textElement);       
        
        // change icon for 2 seconds
        const last = element.innerHTML;
        element.childNodes[1].innerHTML = getCopiedIcon();
        element.disabled = true;
        setTimeout(function () {
            element.innerHTML = last;
            element.disabled = false;
        }.bind(element), 2000);
    }
    </script>`;

module.exports = {
  getScripts: () => [copyCodeBlockScript],
  processNode: (pluginContext, node) => {
    if (node.name === 'pre' && !doesFunctionBtnContainerExistInNode(node)) {
      cheerio(node).append(CONTAINER_HTML);
    } else if (isFunctionBtnContainer(node)) {
      cheerio(node).append(getButtonHTML());
    }
  },
};
