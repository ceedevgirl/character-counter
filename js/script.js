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

/**
 * Returns the number of characters in the text.
 * If `exclude` is true, spaces are not counted.
 */
function getCharCount(text, exclude) {
  return exclude ? text.replace(/\s/g, "").length : text.length;
}

//Returns the number of words in the text.
function getWordCount(text) {
  const words = text.trim().match(/\b\w+\b/g);
  return words ? words.length : 0;
}

//Returns the number of sentences in the text.
function getSentenceCount(text) {
  const sentences = text.match(/[^.!?]+[.!?]+/g);
  return sentences ? sentences.length : 0;
}

/**
 * Calculates frequency of each letter (A-Z) in the text.
 * Non-alphabetic characters are ignored.
 */
function getLetterFrequencies(text) {
  const freq = {};
  const cleaned = text.toUpperCase().replace(/[^A-Z]/g, "");
  for (let char of cleaned) {
    freq[char] = (freq[char] || 0) + 1;
  }
  return { freq, total: cleaned.length };
}


/**
 * Updates the letter frequency bars in the UI.
 * Shows top 5 by default, or all if toggled.
 */
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

  // Show or hide the toggle button depending on number of unique letters
  toggleBtn.parentElement.style.display = sorted.length > 5 ? "block" : "none";

  // Set toggle button color based on theme
  toggleBtn.style.color = isLightTheme ? "black" : "white";
}


/**
 * Updates all stats on the UI:
 * - Character, word, sentence count
 * - Reading time
 * - Letter frequency
 * - Character limit warning
 */
function updateStats() {
  const text = textInput.value;
  const charCount = getCharCount(text, excludeSpaces.checked);
  const wordCount = getWordCount(text);
  const sentenceCount = getSentenceCount(text);
  const readingTime = Math.ceil(wordCount / 200);
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

  // Show (no spaces) label if checkbox is checked
if (excludeSpaces.checked) {
  spaceIndicator.textContent = "(no spaces)";
} else {
  spaceIndicator.textContent = "";
}


  updateLetterDensity(text);
}


/**
 * Prevent user from exceeding character limit while typing.
 */
textInput.addEventListener("beforeinput", (e) => {
  const exclude = excludeSpaces.checked;
  const charLimit = parseInt(charLimitInput.value);
  const nextText = textInput.value + (e.data || "");
  if (setLimit.checked && charLimit && getCharCount(nextText, exclude) > charLimit) {
    e.preventDefault();
  }
});


/**
 * Show/hide the character limit input field when checkbox is toggled.
 */
setLimit.addEventListener("change", () => {
  const isChecked = setLimit.checked;
  limitInputGroup.classList.toggle("hidden", !isChecked);
  limitInputGroup.classList.toggle("active", isChecked);
  if (isChecked) {
    charLimitInput.focus();
  }
  updateStats();
});

// Listen for input and trigger updates
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


/**
 * Theme toggle (light/dark) logic.
 * Switches logo and icon based on theme.
 */
document.querySelector(".toggle-theme").addEventListener("click", () => {
  isLightTheme = !isLightTheme;
  body.classList.toggle("light", isLightTheme);
  themeIcon.src = isLightTheme ? "./assets/images/icon-moon.svg" : "./assets/images/icon-sun.svg";
  logoImg.src = isLightTheme ? "./assets/images/logo-light-theme.svg" : "./assets/images/logo-dark-theme.svg";
  updateLetterDensity(textInput.value);
});

// Initial render
updateStats();