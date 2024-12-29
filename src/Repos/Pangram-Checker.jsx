import { useState, useEffect } from "react";

const PangramChecker = () => {
  const [inputString, setInputString] = useState(
    "thequickbrownfoxjumpsoverthelazydog"
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [letterCounts, setLetterCounts] = useState(new Array(26).fill(0));
  const [uniqueCount, setUniqueCount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [speed, setSpeed] = useState(500);
  const [result, setResult] = useState(null);

  const reset = () => {
    setCurrentIndex(0);
    setLetterCounts(new Array(26).fill(0));
    setUniqueCount(0);
    setResult(null);
    setIsAnimating(false);
  };

  const startAnimation = () => {
    reset();
    setIsAnimating(true);
  };

  useEffect(() => {
    if (isAnimating && currentIndex < inputString.length) {
      const timer = setTimeout(() => {
        const char = inputString[currentIndex].toLowerCase();
        const index = char.charCodeAt(0) - "a".charCodeAt(0);

        if (index >= 0 && index < 26 && letterCounts[index] === 0) {
          const newCounts = [...letterCounts];
          newCounts[index] = 1;
          setLetterCounts(newCounts);
          setUniqueCount((prev) => prev + 1);
        }

        setCurrentIndex((prev) => prev + 1);
      }, speed);

      return () => clearTimeout(timer);
    } else if (isAnimating) {
      setIsAnimating(false);
      setResult(uniqueCount === 26);
    }
  }, [
    isAnimating,
    currentIndex,
    inputString,
    speed,
    letterCounts,
    uniqueCount,
  ]);

  const renderAlphabetGrid = () => {
    const alphabet = "abcdefghijklmnopqrstuvwxyz".split("");
    const rows = [];

    for (let i = 0; i < alphabet.length; i += 13) {
      rows.push(alphabet.slice(i, i + 13));
    }

    return (
      <div className="space-y-2">
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-1 justify-center">
            {row.map((letter) => {
              const index = letter.charCodeAt(0) - "a".charCodeAt(0);
              return (
                <div
                  key={letter}
                  className={`w-8 h-8 flex items-center justify-center border rounded
                    ${
                      letterCounts[index]
                        ? "bg-green-200 border-green-500"
                        : "bg-gray-100 border-gray-300"
                    }
                    ${
                      currentIndex < inputString.length &&
                      inputString[currentIndex].toLowerCase() === letter
                        ? "border-2 border-blue-500"
                        : ""
                    }`}
                >
                  {letter}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    );
  };

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
            className="border p-2 rounded flex-grow"
            placeholder="Enter a string"
          />
          <button
            onClick={startAnimation}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            disabled={isAnimating}
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
            min="100"
            max="1000"
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="w-32"
          />
        </div>
      </div>

      <div className="mb-6">
        <div className="text-center mb-4">
          <div className="text-2xl font-mono mb-2">
            {inputString.split("").map((char, index) => (
              <span
                key={index}
                className={`inline-block mx-0.5 ${
                  index === currentIndex ? "bg-blue-200" : ""
                }`}
              >
                {char}
              </span>
            ))}
          </div>
          <div className="text-gray-600">
            Characters processed: {currentIndex} / {inputString.length}
          </div>
          <div className="text-gray-600">
            Unique letters found: {uniqueCount} / 26
          </div>
        </div>

        {renderAlphabetGrid()}
      </div>

      {result !== null && (
        <div
          className={`text-center text-lg font-semibold ${
            result ? "text-green-600" : "text-red-600"
          }`}
        >
          This string is {result ? "a pangram!" : "not a pangram!"}
        </div>
      )}
    </div>
  );
};

export default PangramChecker;
