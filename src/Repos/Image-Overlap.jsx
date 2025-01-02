import React, { useState, useEffect } from "react";

const ImageOverlapVisualizer = () => {
  const [img1] = useState([
    [1, 1, 0],
    [0, 1, 0],
    [0, 1, 0],
  ]);

  const [img2] = useState([
    [0, 0, 0],
    [0, 1, 1],
    [0, 0, 1],
  ]);

  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [overlap, setOverlap] = useState(0);

  const calculateOverlap = () => {
    let count = 0;
    const n = img1.length;

    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        const img2Row = i - position.y;
        const img2Col = j - position.x;

        if (img2Row >= 0 && img2Row < n && img2Col >= 0 && img2Col < n) {
          if (img1[i][j] === 1 && img2[img2Row][img2Col] === 1) {
            count++;
          }
        }
      }
    }
    return count;
  };

  useEffect(() => {
    setOverlap(calculateOverlap());
  }, [position]);

  const moveGrid = (dx, dy) => {
    setPosition((prev) => ({
      x: Math.min(Math.max(prev.x + dx, -2), 2),
      y: Math.min(Math.max(prev.y + dy, -2), 2),
    }));
  };

  const Cell = ({ filled, overlapped }) => (
    <div
      className={`
      w-12 h-12 border border-gray-300 transition-all duration-200
      ${filled ? "bg-blue-500" : "bg-white"}
      ${overlapped ? "bg-green-500" : ""}
    `}
    />
  );

  const renderCombinedGrid = () => {
    const n = img1.length;
    const grid = Array(n)
      .fill()
      .map(() => Array(n).fill(null));

    // Mark img1 cells
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        grid[i][j] = {
          img1: img1[i][j] === 1,
          img2: false,
          overlapped: false,
        };
      }
    }

    // Mark img2 cells and overlaps
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        const img2Row = i - position.y;
        const img2Col = j - position.x;

        if (img2Row >= 0 && img2Row < n && img2Col >= 0 && img2Col < n) {
          if (img2[img2Row][img2Col] === 1) {
            if (grid[i][j].img1) {
              grid[i][j].overlapped = true;
            }
            grid[i][j].img2 = true;
          }
        }
      }
    }

    return (
      <div className="grid grid-cols-3 gap-1">
        {grid.map((row, i) =>
          row.map((cell, j) => (
            <Cell
              key={`${i}-${j}`}
              filled={cell.img1 || cell.img2}
              overlapped={cell.overlapped}
            />
          ))
        )}
      </div>
    );
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <div className="flex flex-col items-center gap-6">
        <div className="text-xl font-bold">Image Overlap Visualization</div>

        {renderCombinedGrid()}

        <div className="grid grid-cols-3 gap-2">
          {[
            ["↖", -1, -1],
            ["↑", 0, -1],
            ["↗", 1, -1],
            ["←", -1, 0],
            ["•", 0, 0],
            ["→", 1, 0],
            ["↙", -1, 1],
            ["↓", 0, 1],
            ["↘", 1, 1],
          ].map(([arrow, dx, dy]) => (
            <button
              key={arrow}
              onClick={() => moveGrid(dx, dy)}
              className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-lg"
            >
              {arrow}
            </button>
          ))}
        </div>

        <div className="text-center">
          <div className="text-lg">Overlap Count: {overlap}</div>
          <div className="text-sm text-gray-600">
            Offset: ({position.x}, {position.y})
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageOverlapVisualizer;
