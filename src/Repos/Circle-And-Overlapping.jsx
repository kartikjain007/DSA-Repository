import React, { useState, useEffect } from "react";

const OverlapDetector = () => {
  const [radius, setRadius] = useState(40);
  const [circle, setCircle] = useState({ x: 150, y: 150 });
  const [rect, setRect] = useState({ x1: 200, y1: 100, x2: 300, y2: 200 });
  const [isAnimating, setIsAnimating] = useState(false);
  const [isOverlapping, setIsOverlapping] = useState(false);

  const roundToTwo = (num) => Math.round(num * 100) / 100;

  const checkOverlap = (xCenter, yCenter) => {
    const nearX = roundToTwo(Math.max(rect.x1, Math.min(xCenter, rect.x2)));
    const nearY = roundToTwo(Math.max(rect.y1, Math.min(yCenter, rect.y2)));

    const d1 = roundToTwo(Math.abs(nearX - xCenter));
    const d2 = roundToTwo(Math.abs(nearY - yCenter));

    return d1 * d1 + d2 * d2 <= radius * radius;
  };

  useEffect(() => {
    let interval;
    if (isAnimating) {
      interval = setInterval(() => {
        setCircle((prev) => ({
          x: roundToTwo(prev.x + Math.sin(Date.now() / 1000) * 2),
          y: roundToTwo(prev.y + Math.cos(Date.now() / 1000) * 2),
        }));
      }, 50);
    }
    return () => clearInterval(interval);
  }, [isAnimating]);

  useEffect(() => {
    setIsOverlapping(checkOverlap(circle.x, circle.y));
  }, [circle, radius, rect]);

  const InputGroup = ({ label, value, onChange, min = 0, max = 400 }) => (
    <div className="flex items-center gap-2">
      <label className="w-24 text-sm">{label}:</label>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(roundToTwo(Number(e.target.value)))}
        className="w-32"
      />
      <span className="w-16 text-sm">{roundToTwo(value)}</span>
    </div>
  );

  return (
    <div className="w-full max-w-2xl p-4 space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <h3 className="font-medium">Circle Controls</h3>
          <InputGroup
            label="Radius"
            value={radius}
            onChange={setRadius}
            max={100}
          />
          <InputGroup
            label="X Position"
            value={circle.x}
            onChange={(x) => setCircle((prev) => ({ ...prev, x }))}
          />
          <InputGroup
            label="Y Position"
            value={circle.y}
            onChange={(y) => setCircle((prev) => ({ ...prev, y }))}
          />
        </div>
        <div className="space-y-2">
          <h3 className="font-medium">Rectangle Controls</h3>
          <InputGroup
            label="X1"
            value={rect.x1}
            onChange={(x1) => setRect((prev) => ({ ...prev, x1 }))}
          />
          <InputGroup
            label="Y1"
            value={rect.y1}
            onChange={(y1) => setRect((prev) => ({ ...prev, y1 }))}
          />
          <InputGroup
            label="X2"
            value={rect.x2}
            onChange={(x2) => setRect((prev) => ({ ...prev, x2 }))}
          />
          <InputGroup
            label="Y2"
            value={rect.y2}
            onChange={(y2) => setRect((prev) => ({ ...prev, y2 }))}
          />
        </div>
      </div>

      <button
        onClick={() => setIsAnimating(!isAnimating)}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        {isAnimating ? "Stop Animation" : "Start Animation"}
      </button>

      <svg
        viewBox="0 0 400 300"
        className="w-full border rounded-lg bg-gray-50"
      >
        <circle
          cx={circle.x}
          cy={circle.y}
          r={radius}
          className={`transition-colors duration-300 ${
            isOverlapping
              ? "fill-red-400 stroke-red-600"
              : "fill-blue-400 stroke-blue-600"
          }`}
          strokeWidth="2"
        />
        <rect
          x={rect.x1}
          y={rect.y1}
          width={rect.x2 - rect.x1}
          height={rect.y2 - rect.y1}
          className={`transition-colors duration-300 ${
            isOverlapping
              ? "fill-red-200 stroke-red-600"
              : "fill-green-200 stroke-green-600"
          }`}
          strokeWidth="2"
        />
      </svg>

      <div className="text-center font-medium">
        Status: {isOverlapping ? "Overlapping" : "Not Overlapping"}
      </div>
    </div>
  );
};

export default OverlapDetector;
