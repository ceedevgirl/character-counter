import { domElements } from './domElements.js';
import {
  getCharCount,
  getWordCount,
  getSentenceCount,
  getLetterFrequencies,
  estimateReadingTime,
  updateLetterDensity,
  handleLetterDensityDisplay
} from './functions.js';

// UI state variables
let showAllLetters = false;
let isLightTheme = false;
let typingTimer;
const debounceDelay = 400;

// Update all UI stats
function updateStats() {
  const text = domElements.textInput.value;
  const charCount = getCharCount(text, domElements.excludeSpaces.checked);
  const wordCount = getWordCount(text);
  const sentenceCount = getSentenceCount(text);
  const readingTime = estimateReadingTime(text);
  const charLimit = parseInt(domElements.charLimitInput.value);

  domElements.charCountEl.textContent = charCount;
  domElements.wordCountEl.textContent = wordCount;
  domElements.sentenceCountEl.textContent = sentenceCount;
  domElements.readingTimeDisplay.textContent = readingTime;

  if (domElements.setLimit.checked && charLimit && charCount >= charLimit) {
    domElements.warning.classList.remove("hidden");
    domElements.warning.querySelector(".warning-message").textContent =
      `Limit reached! Your text exceeds ${charCount} characters.`;
    domElements.textInput.classList.add("warning-border");
    domElements.charCountEl.style.color = "#12131A";
  } else {
    domElements.warning.classList.add("hidden");
    domElements.warning.querySelector(".warning-message").textContent = "";
    domElements.charCountEl.style.color = "";
    domElements.textInput.classList.remove("warning-border");
  }

  domElements.spaceIndicator.textContent = domElements.excludeSpaces.checked ? "(no spaces)" : "";

  handleLetterDensityDisplay(
    text,
    showAllLetters,
    isLightTheme,
    domElements.letterDensityContainer,
    domElements.densityMessage,
    domElements.toggleBtn,
    debounceDelay
  );
}

// Event listeners
domElements.textInput.addEventListener("beforeinput", (e) => {
  const exclude = domElements.excludeSpaces.checked;
  const charLimit = parseInt(domElements.charLimitInput.value);
  const nextText = domElements.textInput.value + (e.data || "");
  if (domElements.setLimit.checked && charLimit && getCharCount(nextText, exclude) > charLimit) {
    e.preventDefault();
  }
});

domElements.setLimit.addEventListener("change", () => {
  const isChecked = domElements.setLimit.checked;
  domElements.limitInputGroup.classList.toggle("hidden", !isChecked);
  domElements.limitInputGroup.classList.toggle("active", isChecked);
  if (isChecked) domElements.charLimitInput.focus();
  updateStats();
});

domElements.toggleBtn.addEventListener("click", () => {
  showAllLetters = !showAllLetters;
  domElements.toggleArrow.classList.toggle("rotate-up");
  domElements.toggleBtn.childNodes[0].nodeValue = showAllLetters ? "See less " : "See more ";
  updateStats();
});

document.querySelector(".toggle-theme").addEventListener("click", () => {
  isLightTheme = !isLightTheme;
  domElements.body.classList.toggle("light", isLightTheme);
  domElements.themeIcon.src = isLightTheme ? "./assets/images/icon-moon.svg" : "./assets/images/icon-sun.svg";
  domElements.logoImg.src = isLightTheme ? "./assets/images/logo-light-theme.svg" : "./assets/images/logo-dark-theme.svg";
  updateLetterDensity(
    domElements.textInput.value,
    showAllLetters,
    isLightTheme,
    domElements.letterDensityContainer,
    domElements.toggleBtn
  );
});

domElements.textInput.addEventListener("input", updateStats);
domElements.excludeSpaces.addEventListener("change", updateStats);
domElements.charLimitInput.addEventListener("input", updateStats);

// Initial render
updateStats();