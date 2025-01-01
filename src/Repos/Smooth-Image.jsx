import React, { useState, useEffect } from "react";

const ImageSmoother = () => {
  const image = [
    [100, 200, 100],
    [200, 50, 200],
    [100, 200, 100],
  ];

  const directions = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 0],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ];

  const [currentCell, setCurrentCell] = useState([-1, -1]);
  const [activeNeighbors, setActiveNeighbors] = useState([]);
  const [result, setResult] = useState(() =>
    Array(image.length)
      .fill()
      .map(() => Array(image[0].length).fill(-1))
  );

  const getValidNeighbors = (i, j) => {
    return directions
      .map(([di, dj]) => [i + di, j + dj])
      .filter(
        ([ni, nj]) =>
          ni >= 0 && ni < image.length && nj >= 0 && nj < image[0].length
      );
  };

  const processNextCell = (i, j) => {
    if (i >= image.length) return;

    const nextJ = j + 1 >= image[0].length ? 0 : j + 1;
    const nextI = nextJ === 0 ? i + 1 : i;

    setCurrentCell([i, j]);
    const neighbors = getValidNeighbors(i, j);
    setActiveNeighbors(neighbors);

    const sum = neighbors.reduce((acc, [ni, nj]) => acc + image[ni][nj], 0);
    setResult((prevResult) => {
      const newResult = prevResult.map((row) => [...row]);
      newResult[i][j] = Math.floor(sum / neighbors.length);
      return newResult;
    });

    if (nextI < image.length) {
      setTimeout(() => processNextCell(nextI, nextJ), 500);
    }
  };

  useEffect(() => {
    processNextCell(0, 0);
  }, []);

  const getCellStyle = (i, j) => {
    const isActive = currentCell[0] === i && currentCell[1] === j;
    const isNeighbor = activeNeighbors.some(([ni, nj]) => ni === i && nj === j);

    return `
      w-16 h-16 flex items-center justify-center transition-all duration-300 
      ${
        isActive
          ? "bg-blue-500 text-white transform scale-110"
          : isNeighbor
          ? "bg-blue-200"
          : "bg-gray-100"
      } 
      border border-gray-300
    `;
  };

  return (
    <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-6">
      <div className="space-y-8">
        <div className="text-xl font-bold mb-4">Image Smoothing Process</div>

        <div className="grid grid-cols-2 gap-8">
          <div>
            <div className="font-semibold mb-2">Original Image</div>
            <div className="grid grid-cols-3 gap-1">
              {image.map((row, i) =>
                row.map((cell, j) => (
                  <div key={`orig-${i}-${j}`} className={getCellStyle(i, j)}>
                    {cell}
                  </div>
                ))
              )}
            </div>
          </div>

          <div>
            <div className="font-semibold mb-2">Smoothed Result</div>
            <div className="grid grid-cols-3 gap-1">
              {result.map((row, i) =>
                row.map((cell, j) => (
                  <div
                    key={`res-${i}-${j}`}
                    className="w-16 h-16 flex items-center justify-center bg-gray-100 border border-gray-300"
                  >
                    {cell !== -1 ? cell : ""}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="text-sm">
            {currentCell[0] !== -1
              ? `Processing cell (${currentCell[0]}, ${currentCell[1]}) with ${activeNeighbors.length} neighbors`
              : "Starting process..."}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageSmoother;
