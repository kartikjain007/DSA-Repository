import React, { useState, useEffect } from "react";

const FindErrorNums = () => {
  const [nums, setNums] = useState([1, 2, 2, 4]);
  const [currentWindow, setCurrentWindow] = useState({ start: 0, end: 0 });
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [phase, setPhase] = useState("idle"); // 'idle', 'finding-duplicate', 'finding-missing'
  const [currentIndex, setCurrentIndex] = useState(0);
  const [result, setResult] = useState({ duplicate: null, missing: null });
  const [workingArray, setWorkingArray] = useState([]);

  // Reset everything to initial state
  const reset = () => {
    setCurrentWindow({ start: 0, end: 0 });
    setIsRunning(false);
    setPhase("idle");
    setCurrentIndex(0);
    setResult({ duplicate: null, missing: null });
    setWorkingArray([...nums]);
  };

  // Animation logic using useEffect
  useEffect(() => {
    if (!isRunning) return;

    const timer = setTimeout(() => {
      if (phase === "idle" || phase === "finding-duplicate") {
        if (currentIndex >= nums.length) {
          setPhase("finding-missing");
          setCurrentIndex(0);
          return;
        }

        const index = Math.abs(workingArray[currentIndex]) - 1;
        const newArray = [...workingArray];

        if (newArray[index] < 0) {
          setResult((prev) => ({
            ...prev,
            duplicate: Math.abs(workingArray[currentIndex]),
          }));
        } else {
          newArray[index] *= -1;
        }

        setWorkingArray(newArray);
        setCurrentIndex((prev) => prev + 1);
      } else if (phase === "finding-missing") {
        if (currentIndex >= nums.length) {
          setIsRunning(false);
          // Restore positive numbers
          setWorkingArray((prev) => prev.map(Math.abs));
          return;
        }

        if (workingArray[currentIndex] > 0) {
          setResult((prev) => ({ ...prev, missing: currentIndex + 1 }));
          setIsRunning(false);
          return;
        }

        setCurrentIndex((prev) => prev + 1);
      }
    }, speed);

    return () => clearTimeout(timer);
  }, [isRunning, currentIndex, phase, workingArray, nums.length, speed]);

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Find Error Numbers</h1>

        {/* Controls */}
        <div className="space-y-2">
          <input
            type="text"
            value={nums.join(",")}
            onChange={(e) => {
              const newNums = e.target.value.split(",").map(Number);
              setNums(newNums);
              setWorkingArray([...newNums]);
            }}
            className="border p-2 rounded w-full"
            placeholder="Enter numbers separated by commas"
          />
          <div className="flex gap-2">
            <button
              onClick={() => {
                reset();
                setWorkingArray([...nums]);
                setPhase("finding-duplicate");
                setIsRunning(true);
              }}
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
        </div>

        {/* Array Visualization */}
        <div className="space-y-4">
          <h2 className="font-bold">Current Array State:</h2>
          <div className="flex flex-wrap gap-2">
            {workingArray.map((num, idx) => (
              <div
                key={idx}
                className={`w-12 h-12 flex items-center justify-center border rounded transition-all duration-300 ${
                  idx === currentIndex
                    ? "bg-yellow-200 scale-110"
                    : num < 0
                    ? "bg-blue-100"
                    : "bg-white"
                }`}
              >
                {num}
              </div>
            ))}
          </div>
        </div>

        {/* Current Phase */}
        <div className="bg-gray-100 p-4 rounded">
          <h3 className="font-bold">Current Phase:</h3>
          <p>
            {phase === "finding-duplicate"
              ? "Finding Duplicate Number"
              : phase === "finding-missing"
              ? "Finding Missing Number"
              : "Ready to Start"}
          </p>
        </div>

        {/* Results */}
        <div className="bg-gray-100 p-4 rounded">
          <h3 className="font-bold">Results:</h3>
          <div className="space-y-2">
            <p>
              Duplicate Number:{" "}
              {result.duplicate !== null ? result.duplicate : "Not found yet"}
            </p>
            <p>
              Missing Number:{" "}
              {result.missing !== null ? result.missing : "Not found yet"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FindErrorNums;
