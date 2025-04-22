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
  
