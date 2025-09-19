/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The require scope
/******/ 	var __nccwpck_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__nccwpck_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__nccwpck_require__.o(definition, key) && !__nccwpck_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__nccwpck_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__nccwpck_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// ESM COMPAT FLAG
__nccwpck_require__.r(__webpack_exports__);

// EXPORTS
__nccwpck_require__.d(__webpack_exports__, {
  "handler": () => (/* binding */ handler)
});

;// CONCATENATED MODULE: ./actions.js
const getActions = (meta) => [
    [/\/?textToImage\("([^"]*)"(?:,\s*"([^"]*)")?\)/, async (match) => {
        const description = match[1].trim();
        const size = match[2] || "1024x1024";

        // Validate size parameter
        const validSizes = ["1024x1024", "1536x1024", "1024x1536", "auto"];
        const imageSize = validSizes.includes(size) ? size : "1024x1024";

        const image = await openkbs.generateImage(description, {
            n: 1,
            size: imageSize,
            quality: "high"
        });
        const imageSrc = `data:image/png;base64,${image[0].b64_json}`;
        return { type: 'SAVED_CHAT_IMAGE', imageSrc, ...meta };
    }],
    [/\/?webpageToText\("(.*)"\)/, async (match) => {
        try {
            let response = await openkbs.webpageToText(match[1], { parsePrice: true });
            if (response?.content?.length > 5000) response.content = response.content.substring(0, 5000);
            return { data: response, ...meta };
        } catch (e) {
            return { error: e.response.data, ...meta };
        }
    }]
];
;// CONCATENATED MODULE: ./onResponse.js


const handler = async (event) => {
    const actions = getActions({_meta_actions: ["REQUEST_CHAT_MODEL"]});

    for (let [regex, action] of actions) {
        const lastMessage = event.payload.messages[event.payload.messages.length - 1].content;        
        const match = lastMessage?.match(regex);        
        if (match) return await action(match);            
    }

    return { type: 'CONTINUE' }
};
module.exports = __webpack_exports__;
/******/ })()
;