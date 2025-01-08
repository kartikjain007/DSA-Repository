import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

const PrefixSuffixChecker = () => {
  const [words, setWords] = useState(["a", "aba", "ababa", "aa"]);
  const [currentI, setCurrentI] = useState(0);
  const [currentJ, setCurrentJ] = useState(1);
  const [count, setCount] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [newWord, setNewWord] = useState("");
  const [pairs, setPairs] = useState([]);
  const [isChecking, setIsChecking] = useState(false);

  const isPrefixAndSuffix = (str1, str2) => {
    if (str1.length > str2.length) return false;

    const isPrefix = str2.startsWith(str1);
    const isSuffix = str2.endsWith(str1);

    return isPrefix && isSuffix;
  };

  const reset = () => {
    setCurrentI(0);
    setCurrentJ(1);
    setCount(0);
    setPairs([]);
    setIsRunning(false);
    setIsChecking(false);
  };

  const removeWord = (indexToRemove) => {
    if (isRunning) return; // Prevent removal while animation is running

    setWords(words.filter((_, index) => index !== indexToRemove));
    reset();
  };

  const addWord = () => {
    if (newWord) {
      setWords([...words, newWord]);
      setNewWord("");
      reset();
    }
  };

  const step = () => {
    if (currentI >= words.length - 1) {
      setIsRunning(false);
      return;
    }

    setIsChecking(true);

    const valid = isPrefixAndSuffix(words[currentI], words[currentJ]);
    if (valid) {
      setCount((prev) => prev + 1);
      setPairs((prev) => [...prev, [currentI, currentJ]]);
    }

    setTimeout(() => {
      setIsChecking(false);
      if (currentJ < words.length - 1) {
        setCurrentJ(currentJ + 1);
      } else {
        setCurrentI(currentI + 1);
        setCurrentJ(currentI + 2);
      }
    }, 1000);
  };

  useEffect(() => {
    let interval;
    if (isRunning && !isChecking) {
      interval = setInterval(step, 1500);
    }
    return () => clearInterval(interval);
  }, [isRunning, currentI, currentJ, isChecking]);

  const getHighlightColor = (idx) => {
    if (isChecking) {
      if (idx === currentI) return "bg-blue-200 border-blue-500";
      if (idx === currentJ) return "bg-green-200 border-green-500";
    }
    return "bg-gray-50 border-gray-200";
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Prefix and Suffix Checker</h2>

        <div className="flex gap-4">
          <input
            type="text"
            value={newWord}
            onChange={(e) => setNewWord(e.target.value)}
            placeholder="Add new word"
            className="border p-2 rounded"
          />
          <button
            onClick={addWord}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            Add Word
          </button>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`px-4 py-2 rounded transition-colors ${
              isRunning
                ? "bg-red-500 hover:bg-red-600"
                : "bg-green-500 hover:bg-green-600"
            } text-white`}
          >
            {isRunning ? "Pause" : "Start"}
          </button>
          <button
            onClick={step}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
            disabled={isRunning || isChecking}
          >
            Step
          </button>
          <button
            onClick={reset}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="text-lg">
          Valid Pairs Found: <span className="font-bold">{count}</span>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {words.map((word, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-lg border-2 transition-all duration-300 ${getHighlightColor(
                idx
              )} relative`}
            >
              <div className="flex items-center space-x-4">
                <div className="w-8 text-gray-500">[{idx}]</div>
                <div className="flex-1 text-center text-lg font-mono">
                  {word}
                </div>
                <button
                  onClick={() => removeWord(idx)}
                  disabled={isRunning}
                  className={`absolute right-2 top-2 p-1 rounded-full 
                    ${
                      isRunning
                        ? "text-gray-300"
                        : "text-gray-500 hover:bg-red-100 hover:text-red-500"
                    } 
                    transition-colors`}
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 space-y-2">
          <h3 className="text-lg font-semibold">Found Valid Pairs:</h3>
          <div className="space-y-1">
            {pairs.map(([i, j], idx) => (
              <div key={idx} className="text-sm">
                ({i}, {j}): isPrefixAndSuffix("{words[i]}", "{words[j]}") is
                true
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrefixSuffixChecker;
