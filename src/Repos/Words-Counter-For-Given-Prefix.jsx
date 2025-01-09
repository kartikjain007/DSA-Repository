import React, { useState, useEffect } from "react";

const PrefixCounter = () => {
  const [words, setWords] = useState(["leetcode", "win", "loops", "success"]);
  const [pref, setPref] = useState("code");
  const [counter, setCounter] = useState(0);
  const [newWord, setNewWord] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentCheckIndex, setCurrentCheckIndex] = useState(-1);
  const [explanation, setExplanation] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [editIndex, setEditIndex] = useState(-1);
  const [editValue, setEditValue] = useState("");

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const checkPrefix = async () => {
    setIsChecking(true);
    setCounter(0);
    let count = 0;

    for (let i = 0; i < words.length; i++) {
      setCurrentCheckIndex(i);
      const word = words[i];

      setExplanation(`Checking "${word}"...`);
      await sleep(800);

      setExplanation(`Comparing if "${word}" starts with "${pref}"`);
      await sleep(800);

      if (word.startsWith(pref)) {
        count++;
        setCounter(count);
        setExplanation(
          `Match found! "${word}" starts with "${pref}". Count: ${count}`
        );
      } else {
        setExplanation(
          `No match. "${word}" doesn't start with "${pref}". Count stays at ${count}`
        );
      }
      await sleep(1000);
    }

    setCurrentCheckIndex(-1);
    setExplanation(`Final count: ${count} words start with "${pref}"`);
    setIsChecking(false);
  };

  const reset = () => {
    setIsAnimating(true);
    setCounter(0);
    setCurrentCheckIndex(-1);
    setExplanation("");
    setIsChecking(false);
    setEditIndex(-1);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const addWord = () => {
    if (newWord.trim()) {
      setWords([...words, newWord.trim()]);
      setNewWord("");
    }
  };

  const removeWord = (indexToRemove) => {
    setWords(words.filter((_, index) => index !== indexToRemove));
    if (editIndex === indexToRemove) {
      setEditIndex(-1);
    }
  };

  const startEdit = (index) => {
    setEditIndex(index);
    setEditValue(words[index]);
  };

  const saveEdit = () => {
    if (editValue.trim() && editIndex !== -1) {
      const newWords = [...words];
      newWords[editIndex] = editValue.trim();
      setWords(newWords);
      setEditIndex(-1);
      setEditValue("");
    }
  };

  const cancelEdit = () => {
    setEditIndex(-1);
    setEditValue("");
  };

  const handlePrefixChange = (e) => {
    setPref(e.target.value);
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md">
      <div className="space-y-4">
        <div
          className={`text-6xl font-bold text-center transition-transform duration-500 ${
            isAnimating ? "scale-125" : "scale-100"
          }`}
        >
          {counter}
        </div>

        {explanation && (
          <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-800 transition-all duration-300">
            {explanation}
          </div>
        )}

        <div className="space-y-2">
          <input
            type="text"
            value={pref}
            onChange={handlePrefixChange}
            placeholder="Enter prefix to search"
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isChecking}
          />

          <div className="flex space-x-2">
            <button
              onClick={checkPrefix}
              disabled={isChecking}
              className={`flex-1 ${
                isChecking ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
              } text-white p-2 rounded transition-colors duration-200`}
            >
              {isChecking ? "Checking..." : "Start"}
            </button>
            <button
              onClick={reset}
              disabled={isChecking}
              className="flex-1 bg-gray-500 text-white p-2 rounded hover:bg-gray-600 transition-colors duration-200"
            >
              Reset
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex space-x-2">
            <input
              type="text"
              value={newWord}
              onChange={(e) => setNewWord(e.target.value)}
              placeholder="Add new word"
              className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isChecking}
            />
            <button
              onClick={addWord}
              disabled={isChecking}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors duration-200"
            >
              Add
            </button>
          </div>

          <div className="mt-4">
            <h3 className="font-semibold mb-2">Word List:</h3>
            <ul className="space-y-2">
              {words.map((word, index) => (
                <li
                  key={index}
                  className={`flex items-center justify-between p-2 rounded transition-all duration-300 ${
                    currentCheckIndex === index
                      ? "bg-yellow-100 scale-105"
                      : editIndex === index
                      ? "bg-blue-50"
                      : "bg-gray-50"
                  }`}
                >
                  {editIndex === index ? (
                    <div className="flex-1 flex space-x-2">
                      <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="flex-1 p-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        autoFocus
                      />
                      <button
                        onClick={saveEdit}
                        className="text-green-500 hover:text-green-700 px-2"
                      >
                        ✓
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="text-red-500 hover:text-red-700 px-2"
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <>
                      <span>{word}</span>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => startEdit(index)}
                          disabled={isChecking}
                          className="text-blue-500 hover:text-blue-700 transition-colors duration-200"
                        >
                          ✎
                        </button>
                        <button
                          onClick={() => removeWord(index)}
                          disabled={isChecking}
                          className="text-red-500 hover:text-red-700 transition-colors duration-200"
                        >
                          ×
                        </button>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrefixCounter;
