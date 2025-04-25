export function getCharCount(text, exclude) {
  return exclude ? text.replace(/\s/g, "").length : text.length;
}

export function getWordCount(text) {
  const words = text.trim().match(/\b\w+\b/g);
  return words ? words.length : 0;
}

export function getSentenceCount(text) {
  const sentences = text.match(/[^.!?]+[.!?]+/g);
  return sentences ? sentences.length : 0;
}

export function getLetterFrequencies(text) {
  const freq = {};
  const cleaned = text.toUpperCase().replace(/[^A-Z]/g, "");
  for (let char of cleaned) {
    freq[char] = (freq[char] || 0) + 1;
  }
  return { freq, total: cleaned.length };
}

export function estimateReadingTime(text) {
  const words = getWordCount(text);
  return Math.ceil(words / 200);
}

export function updateLetterDensity(text, showAllLetters, isLightTheme, letterDensityContainer, toggleBtn) {
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

export function handleLetterDensityDisplay(text, showAllLetters, isLightTheme, letterDensityContainer, densityMessage, toggleBtn, debounceDelay = 400) {
  return new Promise((resolve) => {
    letterDensityContainer.style.display = "none";
    densityMessage.style.display = "none";
    toggleBtn.parentElement.style.display = "none";

    setTimeout(() => {
      const trimmed = text.trim();

      if (trimmed.length === 0) {
        letterDensityContainer.style.display = "none";
        densityMessage.style.display = "block";
        toggleBtn.parentElement.style.display = "none";
      } else {
        densityMessage.style.display = "none";
        letterDensityContainer.style.display = "block";
        updateLetterDensity(trimmed, showAllLetters, isLightTheme, letterDensityContainer, toggleBtn);
      }
      resolve();
    }, debounceDelay);
  });
}