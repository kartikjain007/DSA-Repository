import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const BinarySearchViz = () => {
  const [nums, setNums] = useState([1, 1, 2, 2, 3, 3, 4, 5, 5, 6, 6]);
  const [inputArray, setInputArray] = useState("1,1,2,2,3,3,4,5,5,6,6");
  const [left, setLeft] = useState(0);
  const [right, setRight] = useState(nums.length - 1);
  const [mid, setMid] = useState(0);
  const [result, setResult] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [explanation, setExplanation] = useState("");

  const reset = () => {
    setLeft(0);
    setRight(nums.length - 1);
    setMid(0);
    setResult(null);
    setExplanation("");
    setIsSearching(false);
  };

  const handleArrayInput = () => {
    try {
      const newArray = inputArray.split(",").map((num) => parseInt(num.trim()));
      if (newArray.length < 3) throw new Error("Array too short");
      setNums(newArray);
      reset();
    } catch (error) {
      setExplanation("Invalid input. Please enter comma-separated numbers.");
    }
  };

  const startSearch = async () => {
    setIsSearching(true);
    setResult(null);
    let l = 0;
    let h = nums.length - 1;

    while (l < h) {
      const m = l + Math.floor((h - l) / 2);
      setLeft(l);
      setRight(h);
      setMid(m);

      const isEven = (h - m) % 2 === 0;
      const currentExplanation = `
        Step:
        - Left: ${l}, Mid: ${m}, Right: ${h}
        - Current element: ${nums[m]}
        - Next element: ${nums[m + 1]}
        - Subsequence length is ${isEven ? "even" : "odd"}
        - ${
          nums[m] === nums[m + 1]
            ? "Elements are equal, " +
              (isEven ? "moving left pointer" : "moving right pointer")
            : "Elements are different, " +
              (isEven ? "moving right pointer" : "moving left pointer")
        }
      `;
      setExplanation(currentExplanation);

      await new Promise((resolve) => setTimeout(resolve, speed));

      if (nums[m] === nums[m + 1]) {
        if (isEven) {
          l = m + 2;
        } else {
          h = m - 1;
        }
      } else {
        if (isEven) {
          h = m;
        } else {
          l = m + 1;
        }
      }
    }

    setResult(nums[h]);
    setExplanation(`Found single non-duplicate number: ${nums[h]}`);
    setIsSearching(false);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8 space-y-4">
        <div className="flex space-x-4">
          <input
            type="text"
            value={inputArray}
            onChange={(e) => setInputArray(e.target.value)}
            className="flex-1 border rounded p-2"
            placeholder="Enter comma-separated numbers"
          />
          <button
            onClick={handleArrayInput}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Set Array
          </button>
        </div>

        <div className="flex space-x-4 items-center">
          <button
            onClick={startSearch}
            disabled={isSearching}
            className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
          >
            Start Search
          </button>
          <button
            onClick={reset}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Reset
          </button>
          <div className="flex items-center space-x-2">
            <span>Speed:</span>
            <input
              type="range"
              min="100"
              max="2000"
              step="100"
              value={speed}
              onChange={(e) => setSpeed(parseInt(e.target.value))}
              className="w-32"
            />
            <span>{speed}ms</span>
          </div>
        </div>
      </div>

      <div className="bg-gray-100 p-4 rounded-lg mb-4 min-h-[100px] whitespace-pre-line">
        {explanation}
      </div>

      <div className="relative h-64 bg-gray-100 rounded-lg overflow-hidden">
        {nums.map((num, index) => (
          <motion.div
            key={index}
            className={`absolute bottom-0 w-8 flex items-end justify-center
              ${
                index === left
                  ? "bg-green-500"
                  : index === right
                  ? "bg-red-500"
                  : index === mid
                  ? "bg-yellow-500"
                  : "bg-blue-400"
              }`}
            style={{
              left: `${(index / nums.length) * 100}%`,
              height: `${(num / Math.max(...nums)) * 100}%`,
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <span className="absolute -top-6 text-sm">{num}</span>
          </motion.div>
        ))}
      </div>

      <div className="mt-4 flex justify-between text-sm">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
          Left
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-yellow-500 rounded mr-2"></div>
          Mid
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-red-500 rounded mr-2"></div>
          Right
        </div>
      </div>
    </div>
  );
};

export default BinarySearchViz;
