import React, { useState, useEffect } from "react";
import { Check, X } from "lucide-react";

const DuplicateFinder = () => {
  const [numbers, setNumbers] = useState([1, 2, 3, 1, 2, 3]);
  const [k, setK] = useState(2);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [map, setMap] = useState({});
  const [found, setFound] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(1000);

  // Reset the visualization
  const reset = () => {
    setCurrentIndex(0);
    setMap({});
    setFound(false);
    setIsRunning(false);
  };

  // Main algorithm logic
  useEffect(() => {
    if (!isRunning) return;

    const timer = setTimeout(() => {
      if (currentIndex >= numbers.length) {
        setIsRunning(false);
        return;
      }

      const currentNum = numbers[currentIndex];

      if (currentNum in map && Math.abs(map[currentNum] - currentIndex) <= k) {
        setFound(true);
        setIsRunning(false);
      } else {
        setMap((prev) => ({ ...prev, [currentNum]: currentIndex }));
        setCurrentIndex((prev) => prev + 1);
      }
    }, speed);

    return () => clearTimeout(timer);
  }, [currentIndex, isRunning, numbers, k, map, speed]);

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Duplicate Finder Visualization</h2>

        {/* Controls */}
        <div className="space-y-2">
          <div className="flex gap-4 items-center">
            <input
              type="text"
              value={numbers.join(",")}
              onChange={(e) =>
                setNumbers(e.target.value.split(",").map(Number))
              }
              className="border p-2 rounded"
              placeholder="Enter numbers separated by commas"
            />
            <input
              type="number"
              value={k}
              onChange={(e) => setK(Number(e.target.value))}
              className="border p-2 rounded w-20"
              placeholder="k"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setIsRunning(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded"
              disabled={isRunning}
            >
              Start
            </button>
            <button
              onClick={reset}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Reset
            </button>
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

        {/* Array Visualization */}
        <div className="flex flex-wrap gap-2">
          {numbers.map((num, idx) => (
            <div
              key={idx}
              className={`w-12 h-12 flex items-center justify-center border rounded transition-all duration-300 ${
                idx === currentIndex
                  ? "bg-yellow-200 scale-110"
                  : idx < currentIndex
                  ? "bg-gray-100"
                  : "bg-white"
              }`}
            >
              {num}
            </div>
          ))}
        </div>

        {/* Map Visualization */}
        <div className="space-y-2">
          <h3 className="font-bold">Hash Map:</h3>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(map).map(([key, value]) => (
              <div
                key={key}
                className="flex gap-2 items-center p-2 bg-gray-50 rounded"
              >
                <span>Number {key}:</span>
                <span>Index {value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Result */}
        <div className="flex items-center gap-2">
          <span>Result:</span>
          {found ? (
            <div className="flex items-center text-green-500">
              <Check size={20} />
              <span>Found duplicate within distance k!</span>
            </div>
          ) : currentIndex >= numbers.length ? (
            <div className="flex items-center text-red-500">
              <X size={20} />
              <span>No duplicates found within distance k</span>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default DuplicateFinder;
