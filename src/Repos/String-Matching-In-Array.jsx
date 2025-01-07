import React, { useState, useEffect } from "react";

const SubstringVisualizer = () => {
  const [words, setWords] = useState(["mass", "as", "hero", "superhero"]);
  const [input, setInput] = useState("");
  const [searchString, setSearchString] = useState("");
  const [result, setResult] = useState([]);
  const [currentComparison, setCurrentComparison] = useState({
    word1: "",
    word2: "",
    index: -1,
  });
  const [isAnimating, setIsAnimating] = useState(false);

  const styles = {
    container: "p-8 max-w-4xl mx-auto bg-gray-100 rounded-lg shadow-lg",
    header: "text-3xl font-bold mb-6 text-center text-blue-600",
    inputContainer: "flex gap-4 mb-6",
    input:
      "flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400",
    button:
      "bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors",
    wordList: "flex flex-wrap gap-2 mb-6",
    word: "bg-white p-2 rounded shadow group relative flex items-center",
    removeButton: "ml-2 text-red-500 hover:text-red-700 font-bold",
    comparisonContainer: "mb-6 p-4 bg-white rounded shadow-md",
    resultContainer: "bg-white p-4 rounded shadow-md",
    character: "inline-block transition-all duration-300",
    match: "bg-green-200",
    noMatch: "bg-red-200",
    neutral: "bg-transparent",
    searchContainer: "mb-6",
  };

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const isSubstring = async (s1, s2) => {
    if (s1.length > s2.length) return false;

    for (let i = 0; i <= s2.length - s1.length; i++) {
      let found = true;
      setCurrentComparison({ word1: s1, word2: s2, index: i });
      await delay(500);

      for (let j = 0; j < s1.length; j++) {
        if (s1[j] !== s2[i + j]) {
          found = false;
          break;
        }
      }
      if (found) return true;
    }
    return false;
  };

  const findSubstrings = async () => {
    setIsAnimating(true);
    const resultArray = [];
    const searchTerm = searchString.trim();

    if (searchTerm) {
      for (let word of words) {
        if (await isSubstring(searchTerm, word)) {
          resultArray.push(word);
        }
      }
    } else {
      for (let i = 0; i < words.length; i++) {
        let isSubstr = false;

        for (let j = 0; j < words.length; j++) {
          if (i !== j && words[i] !== words[j]) {
            if (await isSubstring(words[i], words[j])) {
              isSubstr = true;
              break;
            }
          }
        }

        if (isSubstr) {
          resultArray.push(words[i]);
        }
      }
    }

    setResult(resultArray);
    setCurrentComparison({ word1: "", word2: "", index: -1 });
    setIsAnimating(false);
  };

  const addWord = () => {
    if (input && !words.includes(input)) {
      setWords([...words, input]);
      setInput("");
    }
  };

  const removeWord = (indexToRemove) => {
    setWords(words.filter((_, index) => index !== indexToRemove));
    setResult(result.filter((word) => word !== words[indexToRemove]));
  };

  const renderCharacter = (char, index, word, isWord1) => {
    const { word1, word2, index: compareIndex } = currentComparison;
    let className = styles.character;

    if (isWord1 && word === word1) {
      const isInRange = index >= 0 && index < word1.length;
      className += isInRange ? ` ${styles.match}` : ` ${styles.neutral}`;
    } else if (!isWord1 && word === word2) {
      const matchStart = compareIndex;
      const matchEnd = compareIndex + word1.length;
      const isInRange = index >= matchStart && index < matchEnd;
      className += isInRange ? ` ${styles.match}` : ` ${styles.neutral}`;
    }

    return (
      <span key={index} className={className}>
        {char}
      </span>
    );
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Substring Search Visualizer</h1>

      <div className={styles.inputContainer}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter a word"
          className={styles.input}
        />
        <button
          onClick={addWord}
          className={styles.button}
          disabled={isAnimating}
        >
          Add Word
        </button>
      </div>

      <div className={styles.searchContainer}>
        <div className={styles.inputContainer}>
          <input
            type="text"
            value={searchString}
            onChange={(e) => setSearchString(e.target.value)}
            placeholder="Enter string to search (optional)"
            className={styles.input}
          />
          <button
            onClick={findSubstrings}
            className={styles.button}
            disabled={isAnimating}
          >
            {searchString ? "Search String" : "Find All Substrings"}
          </button>
        </div>
      </div>

      <div className={styles.wordList}>
        {words.map((word, idx) => (
          <div key={idx} className={styles.word}>
            {word}
            <button
              onClick={() => removeWord(idx)}
              className={styles.removeButton}
              disabled={isAnimating}
            >
              ×
            </button>
          </div>
        ))}
      </div>

      {currentComparison.word1 && (
        <div className={styles.comparisonContainer}>
          <div className="mb-2">
            Checking if <strong>{currentComparison.word1}</strong> is a
            substring of <strong>{currentComparison.word2}</strong>
          </div>
          <div className="text-2xl font-mono">
            {currentComparison.word1
              .split("")
              .map((char, idx) =>
                renderCharacter(char, idx, currentComparison.word1, true)
              )}
          </div>
          <div className="text-2xl font-mono">
            {currentComparison.word2
              .split("")
              .map((char, idx) =>
                renderCharacter(char, idx, currentComparison.word2, false)
              )}
          </div>
        </div>
      )}

      {result.length > 0 && (
        <div className={styles.resultContainer}>
          <h2 className="text-xl font-bold mb-2">Result:</h2>
          <div className="flex gap-2">
            {result.map((word, idx) => (
              <div key={idx} className={`${styles.word} bg-green-100`}>
                {word}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SubstringVisualizer;
