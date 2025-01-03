import React, { useState, useEffect, useCallback } from "react";
import { Play, Pause, RotateCcw } from "lucide-react";

const NiceSubarrays = () => {
  const [nums, setNums] = useState([1, 1, 2, 1, 1]);
  const [k, setK] = useState(3);
  const [currentK, setCurrentK] = useState(3);
  const [left, setLeft] = useState(0);
  const [right, setRight] = useState(0);
  const [count, setCount] = useState(0);
  const [phase, setPhase] = useState("k");
  const [isPlaying, setIsPlaying] = useState(false);
  const [kCount, setKCount] = useState(0);
  const [kMinusOneCount, setKMinusOneCount] = useState(0);
  const [finalResult, setFinalResult] = useState(0);
  const [explanation, setExplanation] = useState(
    "Click play to start visualization"
  );

  const resetState = useCallback(() => {
    setLeft(0);
    setRight(0);
    setCount(0);
    setPhase("k");
    setIsPlaying(false);
    setKCount(0);
    setKMinusOneCount(0);
    setFinalResult(0);
    setExplanation("Click play to start visualization");
  }, []);

  const handleNumberEdit = (index, value) => {
    const newNums = [...nums];
    newNums[index] = parseInt(value) || 0;
    setNums(newNums);
    resetState();
  };

  const addNumber = () => {
    setNums([...nums, 0]);
    resetState();
  };

  const removeNumber = (index) => {
    setNums(nums.filter((_, idx) => idx !== index));
    resetState();
  };

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setRight((r) => {
        if (r >= nums.length) {
          if (phase === "k") {
            setKCount(count);
            setPhase("k-1");
            setLeft(0);
            setRight(0);
            setCount(0);
            setCurrentK(k - 1);
            setExplanation(`Completed atMost(${k}). Starting atMost(${k - 1})`);
            return 0;
          }
          setKMinusOneCount(count);
          const result = kCount - count;
          setFinalResult(result);
          setExplanation(
            `Final result: ${result} subarrays have exactly ${k} odd numbers`
          );
          setIsPlaying(false);
          clearInterval(interval);
          return r;
        }

        let newRight = r + 1;
        let oddCount = 0;
        let newLeft = left;

        for (let i = left; i < newRight; i++) {
          if (nums[i] % 2 === 1) oddCount++;
        }

        while (oddCount > currentK && newLeft < newRight) {
          if (nums[newLeft] % 2 === 1) oddCount--;
          newLeft++;
        }

        setLeft(newLeft);
        const newCount = count + (newRight - newLeft);
        setCount(newCount);

        setExplanation(
          `Window [${newLeft}, ${newRight - 1}] has ${oddCount} odd numbers. ` +
            `Adding ${newRight - newLeft} subarrays to count. ` +
            `Current atMost(${currentK}) = ${newCount}`
        );

        return newRight;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, nums, k, left, phase, currentK, count, kCount]);

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">
          Count Nice Subarrays with Exactly {k} Odd Numbers
        </h2>
      </div>

      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <label className="w-20">K value:</label>
          <input
            type="number"
            value={k}
            onChange={(e) => {
              const val = parseInt(e.target.value);
              if (val > 0) {
                setK(val);
                setCurrentK(val);
                resetState();
              }
            }}
            className="w-24 p-2 border rounded"
            min="1"
          />
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          {nums.map((num, idx) => (
            <div key={idx} className="flex items-center space-x-1">
              <input
                type="number"
                value={num}
                onChange={(e) => handleNumberEdit(idx, e.target.value)}
                className="w-16 p-2 border rounded"
              />
              <button
                onClick={() => removeNumber(idx)}
                className="px-2 py-1 border rounded hover:bg-gray-100"
              >
                ×
              </button>
            </div>
          ))}
          <button
            onClick={addNumber}
            className="px-3 py-1 border rounded hover:bg-gray-100"
          >
            +
          </button>
        </div>

        <div className="flex justify-center space-x-4">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-24 p-2 border rounded hover:bg-gray-100 flex items-center justify-center"
          >
            {isPlaying ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </button>
          <button
            onClick={resetState}
            className="w-24 p-2 border rounded hover:bg-gray-100 flex items-center justify-center"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-2 p-4 bg-gray-50 rounded-lg">
          <p className="font-medium">Current Status:</p>
          <p>Phase: {phase}</p>
          <p>
            Window: [{left}, {right - 1}]
          </p>
          <p>
            atMost({k}) = {kCount}
          </p>
          <p>
            atMost({k - 1}) = {kMinusOneCount}
          </p>
          <p className="font-bold text-lg">Result = {finalResult}</p>
          <p className="mt-2 text-sm">{explanation}</p>
        </div>
      </div>
    </div>
  );
};

export default NiceSubarrays;
