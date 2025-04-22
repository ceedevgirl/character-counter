// js/script.js

import {
  getCharCount,
  getWordCount,
  getSentenceCount,
  getLetterFrequencies,
  estimateReadingTime
} from "./utils.js";

// DOM Element References
const textInput = document.getElementById("text-input");
const excludeSpaces = document.getElementById("exclude-spaces");
const setLimit = document.getElementById("set-limit");
const warning = document.getElementById("limit-warning");
const limitInputGroup = document.getElementById("limit-input-group");
const charLimitInput = document.getElementById("char-limit-value");
const readingTimeDisplay = document.getElementById("reading-time");
const charCountEl = document.querySelector(".purple .count");
const wordCountEl = document.querySelector(".yellow .count");
const sentenceCountEl = document.querySelector(".orange .count");
const letterDensityContainer = document.getElementById("letter-density");
const toggleBtn = document.getElementById("toggle-density");
const body = document.body;
const themeIcon = document.getElementById("theme-icon");
const logoImg = document.getElementById("logo-img");
const spaceIndicator = document.getElementById("space-indicator");

// UI state variables
let showAllLetters = false;
let isLightTheme = false;

// Updates the letter frequency bars in the UI
function updateLetterDensity(text) {
  const { freq, total } = getLetterFrequencies(text);
  letterDensityContainer.innerHTML = "";
  const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]);
  const lettersToShow = showAllLetters ? sorted : sorted.slice(0, 5);

  lettersToShow.forEach(([letter, count]) => {
    const percentage = total > 0 ? ((count / total) * 100).toFixed(2) : 0;
    const letterBlock = document.createElement("div");
    letterBlock.classList.add("letters");
    letterBlock.innerHTML = `
      <p>${letter}</p>
      <div class="progress-container">
        <div class="progress-bar">
          <div class="progress-width" style="width: ${percentage}%; background-color: #D3A0FA;"></div>
        </div>
      </div>
      <div class="percentage">
        <p>${count}<span> (${percentage}%)</span></p>
      </div>
    `;
    letterDensityContainer.appendChild(letterBlock);
  });

  toggleBtn.parentElement.style.display = sorted.length > 5 ? "block" : "none";
  toggleBtn.style.color = isLightTheme ? "black" : "white";
}

// Updates all stats on the UI
function updateStats() {
  const text = textInput.value;
  const charCount = getCharCount(text, excludeSpaces.checked);
  const wordCount = getWordCount(text);
  const sentenceCount = getSentenceCount(text);
  const readingTime = estimateReadingTime(text);
  const charLimit = parseInt(charLimitInput.value);

  // Update stats in UI
  charCountEl.textContent = charCount;
  wordCountEl.textContent = wordCount;
  sentenceCountEl.textContent = sentenceCount;
  readingTimeDisplay.textContent = readingTime;

  // Show warning if limit is reached
  if (setLimit.checked && charLimit && charCount >= charLimit) {
    warning.classList.remove("hidden");
    warning.textContent = `Limit reached! You've typed ${charCount} characters out of ${charLimit}.`;
    charCountEl.style.color = "red";
  } else {
    warning.classList.add("hidden");
    warning.textContent = "";
    charCountEl.style.color = "";
  }

  spaceIndicator.textContent = excludeSpaces.checked ? "(no spaces)" : "";

  updateLetterDensity(text);
}

// Event listeners
textInput.addEventListener("beforeinput", (e) => {
  const exclude = excludeSpaces.checked;
  const charLimit = parseInt(charLimitInput.value);
  const nextText = textInput.value + (e.data || "");
  if (setLimit.checked && charLimit && getCharCount(nextText, exclude) > charLimit) {
    e.preventDefault();
  }
});

setLimit.addEventListener("change", () => {
  const isChecked = setLimit.checked;
  limitInputGroup.classList.toggle("hidden", !isChecked);
  limitInputGroup.classList.toggle("active", isChecked);
  if (isChecked) {
    charLimitInput.focus();
  }
  updateStats();
});

textInput.addEventListener("input", updateStats);
excludeSpaces.addEventListener("change", updateStats);
charLimitInput.addEventListener("input", updateStats);

toggleBtn.addEventListener("click", () => {
  showAllLetters = !showAllLetters;
  toggleBtn.innerHTML = showAllLetters
    ? 'See less <span class="rotate-left rotate-up">&lt;</span>'
    : 'See more <span class="rotate-left">&lt;</span>';
  updateStats();
});

document.querySelector(".toggle-theme").addEventListener("click", () => {
  isLightTheme = !isLightTheme;
  body.classList.toggle("light", isLightTheme);
  themeIcon.src = isLightTheme ? "./assets/images/icon-moon.svg" : "./assets/images/icon-sun.svg";
  logoImg.src = isLightTheme ? "./assets/images/logo-light-theme.svg" : "./assets/images/logo-dark-theme.svg";
  updateLetterDensity(textInput.value);
});

// Initial render
updateStats();
