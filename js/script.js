// DOM Element References
const textInput = document.getElementById("text-input");
const excludeSpaces = document.getElementById("exclude-spaces");
const setLimit = document.getElementById("set-limit");
const warning = document.getElementById("limit-warning");
const warningIcon = document.getElementById("warning-icon");
const limitInputGroup = document.getElementById("limit-input-group");
const charLimitInput = document.getElementById("char-limit-value");
const readingTimeDisplay = document.getElementById("reading-time");
const charCountEl = document.querySelector(".purple .count");
const wordCountEl = document.querySelector(".yellow .count");
const sentenceCountEl = document.querySelector(".orange .count");
const letterDensityContainer = document.getElementById("letter-density");
const densityMessage = document.getElementById("density-message");
const toggleBtn = document.getElementById("toggle-density");
const toggleArrow = document.getElementById("toggle-arrow");
const body = document.body;
const themeIcon = document.getElementById("theme-icon");
const logoImg = document.getElementById("logo-img");
const spaceIndicator = document.getElementById("space-indicator");

// UI state variables
let showAllLetters = false;
let isLightTheme = false;

// Character count
function getCharCount(text, exclude) {
  return exclude ? text.replace(/\s/g, "").length : text.length;
}

// Word count
function getWordCount(text) {
  const words = text.trim().match(/\b\w+\b/g);
  return words ? words.length : 0;
}

// Sentence count
function getSentenceCount(text) {
  const sentences = text.match(/[^.!?]+[.!?]+/g);
  return sentences ? sentences.length : 0;
}

// Letter frequency
function getLetterFrequencies(text) {
  const freq = {};
  const cleaned = text.toUpperCase().replace(/[^A-Z]/g, "");
  for (let char of cleaned) {
    freq[char] = (freq[char] || 0) + 1;
  }
  return { freq, total: cleaned.length };
}

// Typing debounce and density update
let typingTimer;
const debounceDelay = 400;

function handleLetterDensityDisplay(text) {
  clearTimeout(typingTimer);

  letterDensityContainer.style.display = "none";
  densityMessage.style.display = "none";
  toggleBtn.parentElement.style.display = "none"; // 💡 Hide button initially

  typingTimer = setTimeout(() => {
    const trimmed = text.trim();

    if (trimmed.length === 0) {
      letterDensityContainer.style.display = "none";
      densityMessage.style.display = "block";
      toggleBtn.parentElement.style.display = "none"; // ✅ Hides "See more"
    } else {
      densityMessage.style.display = "none";
      letterDensityContainer.style.display = "block";
      updateLetterDensity(trimmed);
    }
  }, debounceDelay);
}

// Update letter frequency bars
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

// Update all UI stats
function updateStats() {
  const text = textInput.value;
  const charCount = getCharCount(text, excludeSpaces.checked);
  const wordCount = getWordCount(text);
  const sentenceCount = getSentenceCount(text);
  const readingTime = Math.ceil(wordCount / 200);
  const charLimit = parseInt(charLimitInput.value);

  charCountEl.textContent = charCount;
  wordCountEl.textContent = wordCount;
  sentenceCountEl.textContent = sentenceCount;
  readingTimeDisplay.textContent = readingTime;

  if (setLimit.checked && charLimit && charCount >= charLimit) {
    warning.classList.remove("hidden");
    warning.querySelector(".warning-message").textContent =
      `Limit reached! Your text exceeds ${charCount} characters.`;
      textInput.classList.add("warning-border"); // Add red border
    charCountEl.style.color = "#12131A";
   
  } else {
    warning.classList.add("hidden");
    warning.querySelector(".warning-message").textContent = "";
    charCountEl.style.color = "";
    textInput.classList.remove("warning-border"); // Remove red borde
  }
  

  spaceIndicator.textContent = excludeSpaces.checked ? "(no spaces)" : "";

  handleLetterDensityDisplay(text);
}

// Prevent input when over character limit
textInput.addEventListener("beforeinput", (e) => {
  const exclude = excludeSpaces.checked;
  const charLimit = parseInt(charLimitInput.value);
  const nextText = textInput.value + (e.data || "");
  if (setLimit.checked && charLimit && getCharCount(nextText, exclude) > charLimit) {
    e.preventDefault();
  }
});

// Character limit toggle
setLimit.addEventListener("change", () => {
  const isChecked = setLimit.checked;
  limitInputGroup.classList.toggle("hidden", !isChecked);
  limitInputGroup.classList.toggle("active", isChecked);
  if (isChecked) charLimitInput.focus();
  updateStats();
});

// Toggle show all / top 5 letters
toggleBtn.addEventListener("click", () => {
  showAllLetters = !showAllLetters;
  toggleArrow.classList.toggle("rotate-up");
  toggleBtn.childNodes[0].nodeValue = showAllLetters ? "See less " : "See more ";
  updateStats();
});

// Theme toggle
document.querySelector(".toggle-theme").addEventListener("click", () => {
  isLightTheme = !isLightTheme;
  body.classList.toggle("light", isLightTheme);
  themeIcon.src = isLightTheme ? "./assets/images/icon-moon.svg" : "./assets/images/icon-sun.svg";
  logoImg.src = isLightTheme ? "./assets/images/logo-light-theme.svg" : "./assets/images/logo-dark-theme.svg";
  updateLetterDensity(textInput.value);
});

// Input listeners
textInput.addEventListener("input", updateStats);
excludeSpaces.addEventListener("change", updateStats);
charLimitInput.addEventListener("input", updateStats);

// Initial render
updateStats();
