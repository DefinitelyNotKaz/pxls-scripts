// ==UserScript==
// @name         Color Randomizer
// @namespace    https://notkaz.com
// @version      2024-08-29
// @description  Picking colors it's too easy.
// @author       kaz
// @match        http://hammer.local:3000/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hammer.local
// ==/UserScript==

function removePalette() {
  const palette = document.getElementById("palette");
  palette.style.display = "none"
}

function switchColor() {
  const palette = document.querySelectorAll(".palette-color");

  // Check if there are any elements in the palette
  if (palette.length === 0) {
    console.warn("No elements with class '.palette-color' found.");
    return;
  }

  // Generate a random index
  const rand = Math.floor(Math.random() * palette.length);

  const count = document.getElementById("placeable-count");

  // Check if the count element exists and its text starts with "0"
  if (count && count.innerText.startsWith("0")) {
    return;
  }

  // Ensure the selected palette element has a parent element before calling click()
  if (palette[rand].parentElement) {
    palette[rand].parentElement.click();
  } else {
    console.warn("Selected element does not have a parent.");
  }
}

(function () {
  removePalette()
  switchColor()
  document.getElementById("board").addEventListener("click", switchColor);
})();
