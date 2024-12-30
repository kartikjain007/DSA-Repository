import React, { useState, useEffect } from "react";

const DutchFlagSortVisualizer = () => {
  const [numbers, setNumbers] = useState([2, 0, 2, 1, 1, 0]);
  const [pointers, setPointers] = useState({ i: 0, j: 0, k: 0 });
  const [isAnimating, setIsAnimating] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [history, setHistory] = useState([]);
  const [swapping, setSwapping] = useState({ from: null, to: null });

  const reset = () => {
    setPointers({ i: 0, j: 0, k: numbers.length - 1 });
    setIsAnimating(false);
    setHistory([]);
    setSwapping({ from: null, to: null });
  };

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const swap = (arr, x, y) => {
    const temp = arr[x];
    arr[x] = arr[y];
    arr[y] = temp;
  };

  const sortColors = async () => {
    setIsAnimating(true);
    let nums = [...numbers];
    let i = 0,
      j = 0,
      k = nums.length - 1;

    setPointers({ i, j, k });
    setHistory([{ type: "init", message: "Starting sort" }]);
    await delay(speed);

    while (j <= k) {
      setPointers({ i, j, k });

      if (nums[j] === 1) {
        setHistory((prev) => [
          ...prev,
          {
            type: "skip",
            message: `Found 1 at position ${j}, moving j pointer`,
          },
        ]);
        j++;
      } else if (nums[j] === 2) {
        setHistory((prev) => [
          ...prev,
          {
            type: "swap",
            message: `Found 2 at position ${j}, swapping with position ${k}`,
          },
        ]);
        setSwapping({ from: j, to: k });
        await delay(speed);
        swap(nums, j, k);
        k--;
        setSwapping({ from: null, to: null });
      } else {
        setHistory((prev) => [
          ...prev,
          {
            type: "swap",
            message: `Found 0 at position ${j}, swapping with position ${i}`,
          },
        ]);
        setSwapping({ from: j, to: i });
        await delay(speed);
        swap(nums, j, i);
        i++;
        j++;
        setSwapping({ from: null, to: null });
      }

      setNumbers([...nums]);
      await delay(speed);
    }

    setIsAnimating(false);
    setHistory((prev) => [
      ...prev,
      { type: "complete", message: "Sorting complete!" },
    ]);
  };

  const getNumberStyle = (index, value) => {
    const baseStyle =
      "w-12 h-12 flex items-center justify-center rounded-lg transition-all duration-300 transform ";

    // Color based on value
    const valueColor =
      value === 0 ? "bg-red-500" : value === 1 ? "bg-white" : "bg-blue-500";

    // Border style for white elements
    const borderStyle = value === 1 ? "border-2 border-gray-300" : "";

    // Text color
    const textColor = value === 1 ? "text-black" : "text-white";

    // Animation styles
    let transform = "";
    if (swapping.from === index || swapping.to === index) {
      transform = "scale-110";
    }

    // Pointer indicators
    let pointerStyle = "";
    if (index === pointers.i)
      pointerStyle =
        "after:content-['i'] after:absolute after:top-full after:text-red-500";
    if (index === pointers.j)
      pointerStyle +=
        " before:content-['j'] before:absolute before:bottom-full before:text-blue-500";
    if (index === pointers.k)
      pointerStyle +=
        " after:content-['k'] after:absolute after:top-full after:text-green-500";

    return `${baseStyle} ${valueColor} ${borderStyle} ${textColor} ${transform} ${pointerStyle} relative`;
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="grid gap-4">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="space-y-2">
            <label className="block text-sm font-medium">Input Array:</label>
            <input
              className="p-2 border rounded w-64"
              value={numbers.join(", ")}
              onChange={(e) => {
                const validNumbers = e.target.value
                  .split(",")
                  .map((n) => parseInt(n.trim()))
                  .filter((n) => !isNaN(n) && n >= 0 && n <= 2);
                setNumbers(validNumbers);
              }}
              placeholder="Enter numbers (0, 1, 2) separated by commas"
              disabled={isAnimating}
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium">
              Animation Speed:
            </label>
            <input
              type="range"
              min="500"
              max="2000"
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              disabled={isAnimating}
              className="w-48"
            />
          </div>
          <button
            onClick={isAnimating ? reset : sortColors}
            className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            {isAnimating ? "Reset" : "Start Sort"}
          </button>
        </div>

        <div className="p-4 border rounded-lg">
          <h3 className="font-medium mb-4">Array Visualization</h3>
          <div className="flex flex-wrap gap-4">
            {numbers.map((num, idx) => (
              <div key={idx} className={getNumberStyle(idx, num)}>
                {num}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 border rounded-lg">
            <h3 className="font-medium mb-2">Legend</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded" />
                <span>0 (Red)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-white border border-gray-300 rounded" />
                <span>1 (White)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-500 rounded" />
                <span>2 (Blue)</span>
              </div>
            </div>
          </div>

          <div className="p-4 border rounded-lg">
            <h3 className="font-medium mb-2">Pointer Positions</h3>
            <div className="space-y-2">
              <p>i: {pointers.i} (Red section end)</p>
              <p>j: {pointers.j} (Current element)</p>
              <p>k: {pointers.k} (Blue section start)</p>
            </div>
          </div>
        </div>

        <div className="p-4 border rounded-lg max-h-48 overflow-y-auto">
          <h3 className="font-medium mb-2">Operation History</h3>
          <div className="space-y-2">
            {history.map((entry, idx) => (
              <div
                key={idx}
                className={`text-sm p-2 rounded ${
                  entry.type === "swap"
                    ? "bg-blue-50"
                    : entry.type === "complete"
                    ? "bg-green-50"
                    : "bg-gray-50"
                }`}
              >
                {entry.message}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DutchFlagSortVisualizer;
