// ==UserScript==
// @name         Fog War
// @namespace    https://notkaz.com
// @version      2024-08-29
// @description  Adds a client side fog of war
// @author       kaz
// @match        http://hammer.local:3000/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hammer.local
// @grant        GM_addStyle
// @grant        GM_listValues
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==

let knownPixels = {};

function injectCSS() {
  const fog = `
  #fog {
    position: absolute;
    image-rendering: crisp-edges;
    pointer-events: none;
  }
  `;
  GM_addStyle(fog);
}

function createFogMap() {
  const parent = document.getElementById("board-mover");
  const fog = document.createElement("canvas");
  fog.id = "fog";
  fog.classList.add("noselect");
  fog.width = 1000;
  fog.height = 1000;

  const ctx = fog.getContext("2d");

  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, 1000, 1000);

  parent.prepend(fog);
}

async function loadKnownPixels() {
  const values = await GM_listValues();
  console.log(`[Fog of War]: Loaded values: ${values}`);

  for (const key of values) {
    const yArray = await GM_getValue(key);
    if (Array.isArray(yArray)) {
      knownPixels[key] = yArray;
    } else if (yArray !== undefined) {
      knownPixels[key] = [yArray]; // Convert single value to array
    } else {
      knownPixels[key] = []; // Initialize as an empty array
    }
  }
}

function renderClearedArea() {
  const fog = document.getElementById("fog");
  const ctx = fog.getContext("2d");

  ctx.fillStyle = "rgba(255, 255, 255, 0)";
  Object.keys(knownPixels).forEach(key => {
    knownPixels[key].forEach(y => {
      ctx.clearRect(parseInt(key) - 3, y - 3, 6, 6);
    });
  });
}

function handleFogClick(event) {
  const fog = document.getElementById("fog");
  const rect = fog.getBoundingClientRect();
  const ctx = fog.getContext("2d");

  const scaleX = fog.width / rect.width;
  const scaleY = fog.height / rect.height;

  const x = Math.floor((event.clientX - rect.left) * scaleX);
  const y = Math.floor((event.clientY - rect.top) * scaleY);

  console.log(`[Fog of War]: ${x}, ${y} clicked`);

  ctx.clearRect(x - 3, y - 3, 6, 6);

  if (!knownPixels[x]) {
    knownPixels[x] = [];
  }

  knownPixels[x].push(y);

  // Prevent unnecessary writes and preserve order
  GM_setValue(`${x}`, [...new Set(knownPixels[x])]);
}

(function () {
  'use strict';
  injectCSS();
  createFogMap();

  // Ensure pixels are fully loaded before rendering
  loadKnownPixels().then(() => {
    renderClearedArea();
  });

  document.getElementById("board").addEventListener("click", handleFogClick);
})();
