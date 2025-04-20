// js/utils.js

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

// export them so Jest can use them
module.exports = {
  getCharCount,
  getWordCount,
  getSentenceCount,
  getLetterFrequencies
};
