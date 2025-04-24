/**
 * @jest-environment jsdom
 */

const {
    getCharCount,
    getWordCount,
    getSentenceCount,
    getLetterFrequencies,
    estimateReadingTime,
    updateLetterDensity,
    handleLetterDensityDisplay
  } = require('../js/functions.js');
  
  describe('Text Analysis Functions', () => {
    // Test getCharCount
    describe('getCharCount', () => {
      test('counts all characters when exclude is false', () => {
        expect(getCharCount('hello world', false)).toBe(11);
      });
  
      test('excludes spaces when exclude is true', () => {
        expect(getCharCount('hello world', true)).toBe(10);
      });
  
      test('handles empty string', () => {
        expect(getCharCount('', false)).toBe(0);
        expect(getCharCount('', true)).toBe(0);
      });
  
      test('handles special characters', () => {
        expect(getCharCount('h@llo w0rld!', false)).toBe(12);
        expect(getCharCount('h@llo w0rld!', true)).toBe(11);
      });
    });
  
    // Test getWordCount
    describe('getWordCount', () => {
      test('counts words correctly', () => {
        expect(getWordCount('hello world')).toBe(2);
        expect(getWordCount('one two three four')).toBe(4);
      });
  
      test('handles empty string', () => {
        expect(getWordCount('')).toBe(0);
      });
  
      test('handles multiple spaces', () => {
        expect(getWordCount('  hello   world  ')).toBe(2);
      });
  
      test('handles punctuation', () => {
        expect(getWordCount('hello, world!')).toBe(2);
      });
    });
  
    // Test getSentenceCount
    describe('getSentenceCount', () => {
      test('counts sentences correctly', () => {
        expect(getSentenceCount('Hello. World!')).toBe(2);
        expect(getSentenceCount('Is this a test? Yes it is.')).toBe(2);
      });
  
      test('handles empty string', () => {
        expect(getSentenceCount('')).toBe(0);
      });
  
      test('handles no punctuation', () => {
        expect(getSentenceCount('Hello world')).toBe(0);
      });
  
    
    });
  
    // Test getLetterFrequencies
    describe('getLetterFrequencies', () => {
      test('calculates frequencies correctly', () => {
        const result = getLetterFrequencies('aAa bb c');
        expect(result.freq['A']).toBe(3);
        expect(result.freq['B']).toBe(2);
        expect(result.freq['C']).toBe(1);
        expect(result.total).toBe(6);
      });
  
      test('ignores non-letter characters', () => {
        const result = getLetterFrequencies('a1!@#b b.c');
        expect(result.freq['A']).toBe(1);
        expect(result.freq['B']).toBe(2);
        expect(result.freq['C']).toBe(1);
        expect(result.total).toBe(4);
      });
  
      test('handles empty string', () => {
        const result = getLetterFrequencies('');
        expect(Object.keys(result.freq).length).toBe(0);
        expect(result.total).toBe(0);
      });
  
      test('is case insensitive', () => {
        const result = getLetterFrequencies('aA bB cC');
        expect(result.freq['A']).toBe(2);
        expect(result.freq['B']).toBe(2);
        expect(result.freq['C']).toBe(2);
        expect(result.total).toBe(6);
      });
    });
  
    // Test estimateReadingTime
    describe('estimateReadingTime', () => {
      test('calculates reading time correctly', () => {
        expect(estimateReadingTime('word '.repeat(200))).toBe(1);
        expect(estimateReadingTime('word '.repeat(400))).toBe(2);
      });
  
      test('rounds up to nearest minute', () => {
        expect(estimateReadingTime('word '.repeat(201))).toBe(2);
      });
  
      test('handles empty string', () => {
        expect(estimateReadingTime('')).toBe(0);
      });
  
      test('handles very short text', () => {
        expect(estimateReadingTime('short')).toBe(1);
      });
    });
  
    // Test UI-related functions
    describe('UI Functions', () => {
      beforeEach(() => {
        document.body.innerHTML = `
          <div id="letter-density"></div>
          <div id="density-message"></div>
          <button id="toggle-density"><span>See more</span></button>
        `;
      });
  
      // Test updateLetterDensity
      describe('updateLetterDensity', () => {
        test('creates correct elements for top letters', () => {
          const container = document.getElementById('letter-density');
          const toggleBtn = document.getElementById('toggle-density');
          
          updateLetterDensity('aaa bb ccc d eee', false, false, container, toggleBtn);
          
          const letters = container.querySelectorAll('.letters');
          expect(letters.length).toBe(5); // Should show top 5 letters
          expect(letters[0].querySelector('p').textContent).toBe('A');
          expect(letters[1].querySelector('p').textContent).toBe('C');
          expect(letters[2].querySelector('p').textContent).toBe('E');
          expect(letters[3].querySelector('p').textContent).toBe('B');
          expect(letters[4].querySelector('p').textContent).toBe('D');
        });
  
        test('shows all letters when showAllLetters is true', () => {
          const container = document.getElementById('letter-density');
          const toggleBtn = document.getElementById('toggle-density');
          
          updateLetterDensity('a b c d e f', true, false, container, toggleBtn);
          
          const letters = container.querySelectorAll('.letters');
          expect(letters.length).toBe(6); // Should show all letters
        });
  
        test('handles empty input', () => {
          const container = document.getElementById('letter-density');
          const toggleBtn = document.getElementById('toggle-density');
          
          updateLetterDensity('', false, false, container, toggleBtn);
          
          const letters = container.querySelectorAll('.letters');
          expect(letters.length).toBe(0);
        });
      });
  
      // Test handleLetterDensityDisplay
      describe('handleLetterDensityDisplay', () => {
        test('shows message for empty text', async () => {
          const density = document.getElementById('letter-density');
          const message = document.getElementById('density-message');
          const toggle = document.getElementById('toggle-density');
          
          await handleLetterDensityDisplay('', false, false, density, message, toggle);
          
          expect(density.style.display).toBe('none');
          expect(message.style.display).toBe('block');
          expect(toggle.parentElement.style.display).toBe('none');
        });
  
        test('shows density for non-empty text', async () => {
          const density = document.getElementById('letter-density');
          const message = document.getElementById('density-message');
          const toggle = document.getElementById('toggle-density');
          
          await handleLetterDensityDisplay('aaa bb c', false, false, density, message, toggle);
          
          expect(density.style.display).toBe('block');
          expect(message.style.display).toBe('none');
        });
  
        test('handles debounce correctly', async () => {
          const density = document.getElementById('letter-density');
          const message = document.getElementById('density-message');
          const toggle = document.getElementById('toggle-density');
          
          // Test with immediate call (shouldn't update yet)
          const promise = handleLetterDensityDisplay('test', false, false, density, message, toggle, 100);
          expect(density.style.display).toBe('none');
          
          // Wait for debounce
          await promise;
          expect(density.style.display).toBe('block');
        });
      });
    });
  });