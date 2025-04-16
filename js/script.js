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

let showAllLetters = false;
let isLightTheme = false;

function getCharCount(text, exclude) {
  return exclude ? text.replace(/\s/g, "").length : text.length;
}

function getWordCount(text) {
  const words = text.trim().match(/\b\w+\b/g);
  return words ? words.length : 0;
}

function getSentenceCount(text) {
  const sentences = text.match(/[^.!?]+[.!?]+/g);
  return sentences ? sentences.length : 0;
}

function getLetterFrequencies(text) {
  const freq = {};
  const cleaned = text.toUpperCase().replace(/[^A-Z]/g, "");
  for (let char of cleaned) {
    freq[char] = (freq[char] || 0) + 1;
  }
  return { freq, total: cleaned.length };
}

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
    warning.textContent = `Limit reached! You've typed ${charCount} characters out of ${charLimit}.`;
    charCountEl.style.color = "red";
  } else {
    warning.classList.add("hidden");
    warning.textContent = "";
    charCountEl.style.color = "";
  }

  updateLetterDensity(text);
}

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

updateStats();

