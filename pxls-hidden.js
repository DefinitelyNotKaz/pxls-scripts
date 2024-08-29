// ==UserScript==
// @name         Hidden
// @namespace    https://notkaz.com
// @version      2024-08-29
// @description  A real pro doesn't need to look at what he's already done.
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
  #hidden {
    position: absolute;
    image-rendering: crisp-edges;
    pointer-events: none;
  }
  `;
  GM_addStyle(fog);
}

function createHidder() {
  const parent = document.getElementById("board-mover");
  const fog = document.createElement("canvas");
  fog.id = "hidden";
  fog.classList.add("noselect");
  fog.width = 1000;
  fog.height = 1000;

  parent.prepend(fog);
}

function saveState() {
  const board = document.getElementById("board");
  state = board.toDataURL("image/png");
}

function handleClick(event) {
  const board = document.getElementById("board");
  const hidden = document.getElementById("hidden");

  const rect = board.getBoundingClientRect();

  const scaleX = board.width / rect.width;
  const scaleY = board.height / rect.height;
  const x = Math.floor((event.clientX - rect.left) * scaleX);
  const y = Math.floor((event.clientY - rect.top) * scaleY);

  const temp = document.createElement("canvas");
  const tempctx = temp.getContext("2d");

  temp.width = board.width;
  temp.height = board.height;

  setTimeout(() => {
    const img = new Image();
    img.src = state;

    img.onload = () => {
      tempctx.drawImage(img, 0, 0);

      const pixel = tempctx.getImageData(x, y, 1, 1).data;

      const ctx = hidden.getContext("2d");
      ctx.fillStyle = `rgba(${pixel[0]}, ${pixel[1]}, ${pixel[2]}, ${pixel[3] / 255})`;
      ctx.fillRect(x, y, 1, 1);

      temp.remove();
    };

    img.onerror = (err) => {
      console.error('Failed to load image from state:', err);
    };

    saveState();
  }, 1000);
}

(function () {
  'use strict';
  injectCSS();
  createHidder();
  saveState();

  document.getElementById("board").addEventListener("click", handleClick);
})();
