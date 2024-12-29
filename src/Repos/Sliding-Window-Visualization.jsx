import { useState, useEffect } from "react";

const SlidingWindowViz = () => {
  const [nums, setNums] = useState([2, 3, 1, 2, 4, 3]);
  const [target, setTarget] = useState(7);
  const [currentSum, setCurrentSum] = useState(0);
  const [left, setLeft] = useState(0);
  const [right, setRight] = useState(0);
  const [minLength, setMinLength] = useState(Number.MAX_SAFE_INTEGER);
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [step, setStep] = useState(0);
  const [history, setHistory] = useState([]);

  const reset = () => {
    setLeft(0);
    setRight(0);
    setCurrentSum(0);
    setMinLength(Number.MAX_SAFE_INTEGER);
    setIsRunning(false);
    setStep(0);
    setHistory([]);
  };

  const runAlgorithm = async () => {
    reset();
    setIsRunning(true);
    const newHistory = [];

    let i = 0,
      j = 0;
    let sum = 0;
    let miniL = Number.MAX_SAFE_INTEGER;

    while (j < nums.length) {
      sum += nums[j];
      newHistory.push({
        left: i,
        right: j,
        sum,
        minLength: miniL,
        action: "Add number to sum",
      });

      while (sum >= target) {
        miniL = Math.min(miniL, j - i + 1);
        newHistory.push({
          left: i,
          right: j,
          sum,
          minLength: miniL,
          action: "Found valid subarray",
        });

        sum -= nums[i];
        i++;

        newHistory.push({
          left: i,
          right: j,
          sum,
          minLength: miniL,
          action: "Shrink window",
        });
      }

      j++;
    }

    setHistory(newHistory);
  };

  useEffect(() => {
    if (isRunning && step < history.length) {
      const timer = setTimeout(() => {
        const currentState = history[step];
        setLeft(currentState.left);
        setRight(currentState.right);
        setCurrentSum(currentState.sum);
        setMinLength(currentState.minLength);
        setStep((prev) => prev + 1);
      }, speed);

      return () => clearTimeout(timer);
    } else if (step >= history.length) {
      setIsRunning(false);
    }
  }, [isRunning, step, history, speed]);

  return (
    <div className="p-4">
      <div className="mb-6 space-y-4">
        <div className="flex gap-4 items-center">
          <button
            onClick={() => (isRunning ? setIsRunning(false) : runAlgorithm())}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {isRunning ? "Pause" : "Start"}
          </button>
          <button
            onClick={reset}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Reset
          </button>
          <div className="flex items-center gap-2">
            <label>Speed:</label>
            <input
              type="range"
              min="100"
              max="2000"
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              className="w-32"
            />
          </div>
        </div>

        <div className="flex gap-4 items-center">
          <label>Target Sum:</label>
          <input
            type="number"
            value={target}
            onChange={(e) => {
              setTarget(Number(e.target.value));
              reset();
            }}
            className="border p-1 w-20"
          />
        </div>
      </div>

      <div className="mb-6">
        <div className="flex gap-2 mb-2">
          {nums.map((num, index) => (
            <div
              key={index}
              className={`w-12 h-12 flex items-center justify-center border-2 
                ${
                  index >= left && index <= right
                    ? "bg-blue-100 border-blue-500"
                    : "border-gray-300"
                }
                ${index === left ? "border-l-4 border-l-green-500" : ""}
                ${index === right ? "border-r-4 border-r-red-500" : ""}`}
            >
              {num}
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2 text-lg">
        <div>Current Sum: {currentSum}</div>
        <div>
          Min Length: {minLength === Number.MAX_SAFE_INTEGER ? "∞" : minLength}
        </div>
        {step > 0 && step <= history.length && (
          <div>Action: {history[step - 1].action}</div>
        )}
      </div>
    </div>
  );
};

export default SlidingWindowViz;
