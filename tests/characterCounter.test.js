/**
 * @jest-environment jsdom
 */


const {
    getCharCount,
    getWordCount,
    getSentenceCount,
    getLetterFrequencies,
    estimateReadingTime
  } = require("../js/utils");
  
  describe("Character Counter - Logic Tests", () => {
    test("counts characters correctly", () => {
      expect(getCharCount("Hello", false)).toBe(5);
      expect(getCharCount("Hello world", false)).toBe(11);
      expect(getCharCount("Hello world", true)).toBe(10);
      expect(getCharCount("", false)).toBe(0);
    });
  
    test("counts words correctly", () => {
      expect(getWordCount("This is a test")).toBe(4);
      expect(getWordCount("")).toBe(0);
      expect(getWordCount("   multiple   spaces  here ")).toBe(3);
    });
  
    test("counts sentences correctly", () => {
      expect(getSentenceCount("Hi. How are you? I'm good!")).toBe(3);
      expect(getSentenceCount("No punctuation here")).toBe(0);
    });
  
    test("calculates letter frequencies", () => {
      const result = getLetterFrequencies("Hello, HELLO!");
      expect(result.freq["H"]).toBe(2);
      expect(result.freq["E"]).toBe(2);
      expect(result.freq["L"]).toBe(4);
      expect(result.freq["O"]).toBe(2);
      expect(result.total).toBe(10);
    });
  
    test("estimates reading time correctly", () => {
      expect(estimateReadingTime("")).toBe(0);
      expect(estimateReadingTime("Hello world")).toBe(1);
      expect(estimateReadingTime("word ".repeat(199))).toBe(1);
      expect(estimateReadingTime("word ".repeat(201))).toBe(2);
    });
  });
  

  describe("DOM - Character Counter UI Behavior", () => {
    let textInput, charCountEl, warningEl, setLimit, charLimitInput;
  
    beforeEach(() => {
      document.body.innerHTML = `
        <textarea id="text-input"></textarea>
        <input type="checkbox" id="set-limit" />
        <input type="number" id="char-limit-value" value="10" />
        <div class="purple"><span class="count"></span></div>
        <div id="limit-warning" class="hidden"></div>
      `;
  
      textInput = document.getElementById("text-input");
      charCountEl = document.querySelector(".purple .count");
      warningEl = document.getElementById("limit-warning");
      setLimit = document.getElementById("set-limit");
      charLimitInput = document.getElementById("char-limit-value");
    });
  
    function updateCharacterCountUI(text) {
      const charCount = getCharCount(text, false);
      charCountEl.textContent = charCount;
  
      const limit = parseInt(charLimitInput.value);
      if (setLimit.checked && charCount >= limit) {
        warningEl.classList.remove("hidden");
        warningEl.textContent = `Limit reached! You've typed ${charCount} characters out of ${limit}.`;
      } else {
        warningEl.classList.add("hidden");
        warningEl.textContent = "";
      }
    }
  
    test("updates character count on input", () => {
      textInput.value = "Hello";
      updateCharacterCountUI(textInput.value);
      expect(charCountEl.textContent).toBe("5");
    });
  
    test("shows warning when character limit is reached", () => {
      setLimit.checked = true;
      textInput.value = "1234567890";
      updateCharacterCountUI(textInput.value);
  
      expect(warningEl.classList.contains("hidden")).toBe(false);
      expect(warningEl.textContent).toMatch(/Limit reached/);
    });
  
    test("hides warning when under character limit", () => {
      setLimit.checked = true;
      textInput.value = "12345";
      updateCharacterCountUI(textInput.value);
  
      expect(warningEl.classList.contains("hidden")).toBe(true);
      expect(warningEl.textContent).toBe("");
    });
  });
  