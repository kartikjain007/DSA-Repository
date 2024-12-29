import React, { useState, useEffect } from "react";

const HalvesComparison = () => {
  const [inputString, setInputString] = useState("textbook");
  const [leftPointer, setLeftPointer] = useState(0);
  const [rightPointer, setRightPointer] = useState(0);
  const [leftCount, setLeftCount] = useState(0);
  const [rightCount, setRightCount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [result, setResult] = useState(null);

  const vowels = new Set(["a", "e", "i", "o", "u", "A", "E", "I", "O", "U"]);

  const reset = () => {
    setLeftPointer(0);
    setRightPointer(inputString.length / 2);
    setLeftCount(0);
    setRightCount(0);
    setResult(null);
    setIsAnimating(false);
  };

  const startAnimation = () => {
    reset();
    setIsAnimating(true);
  };

  useEffect(() => {
    if (isAnimating && leftPointer < inputString.length / 2) {
      const timer = setTimeout(() => {
        // Check current characters
        if (vowels.has(inputString[leftPointer])) {
          setLeftCount((prev) => prev + 1);
        }
        if (vowels.has(inputString[rightPointer])) {
          setRightCount((prev) => prev + 1);
        }

        // Move pointers
        setLeftPointer((prev) => prev + 1);
        setRightPointer((prev) => prev + 1);
      }, speed);

      return () => clearTimeout(timer);
    } else if (isAnimating) {
      setIsAnimating(false);
      setResult(leftCount === rightCount);
    }
  }, [
    isAnimating,
    leftPointer,
    rightPointer,
    inputString,
    speed,
    leftCount,
    rightCount,
  ]);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-6 space-y-4">
        <div className="flex gap-4 items-center">
          <input
            type="text"
            value={inputString}
            onChange={(e) => {
              setInputString(e.target.value);
              reset();
            }}
            className="border p-2 rounded"
            placeholder="Enter a string"
          />
          <button
            onClick={startAnimation}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            disabled={inputString.length % 2 !== 0}
          >
            Start
          </button>
          <button
            onClick={reset}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Reset
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span>Speed:</span>
          <input
            type="range"
            min="200"
            max="2000"
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="w-32"
          />
        </div>
      </div>

      <div className="mb-6">
        <div className="grid grid-cols-2 gap-4">
          {/* Left half */}
          <div className="border p-4 rounded bg-blue-50">
            <h3 className="text-lg font-semibold mb-2">Left Half</h3>
            <div className="flex gap-1">
              {inputString
                .slice(0, inputString.length / 2)
                .split("")
                .map((char, index) => (
                  <div
                    key={index}
                    className={`w-8 h-8 flex items-center justify-center border rounded
                    ${index === leftPointer ? "border-2 border-green-500" : ""}
                    ${vowels.has(char) ? "bg-yellow-200" : "bg-white"}`}
                  >
                    {char}
                  </div>
                ))}
            </div>
            <div className="mt-2">Vowels: {leftCount}</div>
          </div>

          {/* Right half */}
          <div className="border p-4 rounded bg-blue-50">
            <h3 className="text-lg font-semibold mb-2">Right Half</h3>
            <div className="flex gap-1">
              {inputString
                .slice(inputString.length / 2)
                .split("")
                .map((char, index) => (
                  <div
                    key={index}
                    className={`w-8 h-8 flex items-center justify-center border rounded
                    ${
                      index === rightPointer - inputString.length / 2
                        ? "border-2 border-red-500"
                        : ""
                    }
                    ${vowels.has(char) ? "bg-yellow-200" : "bg-white"}`}
                  >
                    {char}
                  </div>
                ))}
            </div>
            <div className="mt-2">Vowels: {rightCount}</div>
          </div>
        </div>
      </div>

      {result !== null && (
        <div
          className={`text-center text-lg font-semibold ${
            result ? "text-green-600" : "text-red-600"
          }`}
        >
          The halves are {result ? "alike" : "not alike"}!
        </div>
      )}

      {inputString.length % 2 !== 0 && (
        <div className="text-red-500 text-center mt-4">
          Please enter a string with even length
        </div>
      )}
    </div>
  );
};

export default HalvesComparison;
