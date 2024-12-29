import { useState, useEffect } from "react";

const OriginalArrayFinder = () => {
  const [inputArray, setInputArray] = useState([1, 4, 2, 8, 6, 9, 7, 3]);
  const [sortedArray, setSortedArray] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [frequencyMap, setFrequencyMap] = useState({});
  const [result, setResult] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [step, setStep] = useState("initial");
  const [error, setError] = useState("");
  const [currentPair, setCurrentPair] = useState(null);

  const reset = () => {
    setCurrentIndex(0);
    setFrequencyMap({});
    setResult([]);
    setIsAnimating(false);
    setStep("initial");
    setError("");
    setCurrentPair(null);
    setSortedArray([]);
  };

  const startAnimation = () => {
    if (inputArray.length % 2 !== 0) {
      setError("Array length must be even!");
      return;
    }
    reset();
    const sorted = [...inputArray].sort((a, b) => a - b);
    setSortedArray(sorted);
    setStep("sorting");
    setIsAnimating(true);
  };

  useEffect(() => {
    if (!isAnimating) return;

    const timer = setTimeout(() => {
      if (step === "sorting") {
        // Build frequency map
        const newMap = {};
        sortedArray.forEach((num) => {
          newMap[num] = (newMap[num] || 0) + 1;
        });
        setFrequencyMap(newMap);
        setStep("processing");
        setCurrentIndex(0);
      } else if (step === "processing" && currentIndex < sortedArray.length) {
        const num = sortedArray[currentIndex];
        const twice = 2 * num;

        if (frequencyMap[num] > 0) {
          if (frequencyMap[twice] > 0) {
            // Valid pair found
            setResult((prev) => [...prev, num]);
            setFrequencyMap((prev) => ({
              ...prev,
              [num]: prev[num] - 1,
              [twice]: prev[twice] - 1,
            }));
            setCurrentPair({ original: num, doubled: twice });
          } else {
            setError("Invalid doubled array!");
            setIsAnimating(false);
            return;
          }
        }
        setCurrentIndex((prev) => prev + 1);
      } else {
        setIsAnimating(false);
      }
    }, speed);

    return () => clearTimeout(timer);
  }, [isAnimating, step, currentIndex, sortedArray, frequencyMap, speed]);

  const renderArray = (array, highlight = -1) => (
    <div className="flex flex-wrap gap-2">
      {array.map((num, idx) => (
        <div
          key={idx}
          className={`w-12 h-12 flex items-center justify-center border rounded
            ${
              highlight === idx
                ? "border-2 border-blue-500 bg-blue-100"
                : "border-gray-300 bg-white"
            }
            ${
              currentPair &&
              (num === currentPair.original || num === currentPair.doubled)
                ? "bg-green-100"
                : ""
            }`}
        >
          {num}
        </div>
      ))}
    </div>
  );

  const renderFrequencyMap = () => (
    <div className="grid grid-cols-4 gap-2">
      {Object.entries(frequencyMap).map(([num, freq]) => (
        <div
          key={num}
          className={`p-2 border rounded ${
            freq > 0 ? "bg-white" : "bg-gray-100"
          }`}
        >
          {num}: {freq}
        </div>
      ))}
    </div>
  );

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6 space-y-4">
        <div className="flex gap-4 items-center">
          <input
            type="text"
            value={inputArray.join(",")}
            onChange={(e) => {
              const vals = e.target.value
                .split(",")
                .map((x) => parseInt(x.trim()))
                .filter((x) => !isNaN(x));
              setInputArray(vals);
              reset();
            }}
            className="border p-2 rounded flex-grow"
            placeholder="Enter numbers separated by commas"
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
            min="200"
            max="2000"
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="w-32"
          />
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <h3 className="font-semibold">Input Array:</h3>
          {renderArray(inputArray)}
        </div>

        {sortedArray.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-semibold">Sorted Array:</h3>
            {renderArray(sortedArray, currentIndex)}
          </div>
        )}

        {Object.keys(frequencyMap).length > 0 && (
          <div className="space-y-2">
            <h3 className="font-semibold">Frequency Map:</h3>
            {renderFrequencyMap()}
          </div>
        )}

        {result.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-semibold">Original Array:</h3>
            {renderArray(result)}
          </div>
        )}

        {currentPair && (
          <div className="bg-blue-50 p-4 rounded">
            <div>Current number: {currentPair.original}</div>
            <div>Looking for doubled value: {currentPair.doubled}</div>
          </div>
        )}

        {error && (
          <div className="text-red-500 font-semibold text-center">{error}</div>
        )}

        {!isAnimating && result.length > 0 && !error && (
          <div className="text-green-500 font-semibold text-center">
            Original array found!
          </div>
        )}
      </div>
    </div>
  );
};

export default OriginalArrayFinder;
