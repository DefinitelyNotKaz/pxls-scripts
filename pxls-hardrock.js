// ==UserScript==
// @name         Hardrock
// @namespace    https://notkaz.com
// @version      2024-08-29
// @description  A break in the muscle memory.
// @author       kaz
// @match        http://hammer.local:3000/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hammer.local
// @grant        GM_addStyle
// @grant        GM_listValues
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==

let state;

function injectCSS() {
  const fog = `
  #board {
    scale: 1 -1
  }
  `;
  GM_addStyle(fog);
}

(function () {
  'use strict';
  injectCSS();
})();
