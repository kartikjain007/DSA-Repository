import { useState, useEffect } from "react";

const RomanNumeralConverter = () => {
  const [inputNumber, setInputNumber] = useState(3549);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [remainingNumber, setRemainingNumber] = useState(0);
  const [result, setResult] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [currentStep, setCurrentStep] = useState(null);

  const values = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
  const symbols = [
    "M",
    "CM",
    "D",
    "CD",
    "C",
    "XC",
    "L",
    "XL",
    "X",
    "IX",
    "V",
    "IV",
    "I",
  ];

  const reset = () => {
    setCurrentIndex(0);
    setRemainingNumber(inputNumber);
    setResult("");
    setIsAnimating(false);
    setCurrentStep(null);
  };

  const startAnimation = () => {
    reset();
    setRemainingNumber(inputNumber);
    setIsAnimating(true);
  };

  useEffect(() => {
    if (isAnimating && currentIndex < values.length && remainingNumber > 0) {
      const timer = setTimeout(() => {
        const currentValue = values[currentIndex];
        const times = Math.floor(remainingNumber / currentValue);

        if (times > 0) {
          const newSymbols = symbols[currentIndex].repeat(times);
          setResult((prev) => prev + newSymbols);
          setRemainingNumber((prev) => prev % currentValue);
          setCurrentStep({
            value: currentValue,
            symbol: symbols[currentIndex],
            times: times,
            remaining: remainingNumber % currentValue,
          });
        }

        setCurrentIndex((prev) => prev + 1);
      }, speed);

      return () => clearTimeout(timer);
    } else if (isAnimating) {
      setIsAnimating(false);
    }
  }, [isAnimating, currentIndex, remainingNumber, speed]);

  const renderValueSymbolPairs = () => {
    return values.map((value, index) => (
      <div
        key={index}
        className={`flex items-center justify-between p-2 rounded
          ${
            currentIndex === index
              ? "bg-blue-100 border-2 border-blue-500"
              : "bg-gray-50"
          }
          ${currentIndex > index ? "opacity-50" : ""}`}
      >
        <span className="font-mono">{value}</span>
        <span className="font-bold">{symbols[index]}</span>
      </div>
    ));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6 space-y-4">
        <div className="flex gap-4 items-center">
          <input
            type="number"
            value={inputNumber}
            onChange={(e) => {
              const val = parseInt(e.target.value);
              if (val > 0 && val < 4000) {
                setInputNumber(val);
                reset();
              }
            }}
            className="border p-2 rounded w-32"
            min="1"
            max="3999"
          />
          <button
            onClick={startAnimation}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            disabled={isAnimating || inputNumber < 1 || inputNumber > 3999}
          >
            Start
          </button>
          <button
            onClick={reset}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
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

      <div className="grid grid-cols-2 gap-8">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Roman Numeral Values</h3>
          <div className="grid grid-cols-2 gap-2">
            {renderValueSymbolPairs()}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Conversion Process</h3>
          <div className="bg-white p-4 rounded-lg border space-y-4">
            <div className="text-3xl font-bold text-center font-mono">
              {result || "..."}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Original Number:</span>
                <span className="font-mono">{inputNumber}</span>
              </div>
              <div className="flex justify-between">
                <span>Remaining:</span>
                <span className="font-mono">{remainingNumber}</span>
              </div>
            </div>

            {currentStep && (
              <div className="bg-blue-50 p-3 rounded">
                <div>Current Value: {currentStep.value}</div>
                <div>Symbol: {currentStep.symbol}</div>
                <div>Times Used: {currentStep.times}</div>
                <div>Remaining: {currentStep.remaining}</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {!isAnimating && result && (
        <div className="mt-6 text-center text-lg font-semibold text-green-600">
          Conversion complete! {inputNumber} = {result}
        </div>
      )}
    </div>
  );
};

export default RomanNumeralConverter;
