import React, { useState, useEffect } from "react";
import { ArrowRight, PlayCircle, StopCircle, RotateCcw } from "lucide-react";

const JosephusProblem = () => {
  const [n, setN] = useState(5);
  const [k, setK] = useState(2);
  const [players, setPlayers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [winner, setWinner] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [eliminationHistory, setEliminationHistory] = useState([]);
  const [speed, setSpeed] = useState(1000);

  const initializePlayers = () => {
    setPlayers(
      Array.from({ length: n }, (_, i) => ({
        id: i + 1,
        isActive: true,
        angle: (2 * Math.PI * i) / n,
        scale: 1,
      }))
    );
    setCurrentIndex(0);
    setWinner(null);
    setRotation(0);
    setEliminationHistory([]);
  };

  const simulateStep = () => {
    setPlayers((prevPlayers) => {
      let count = k;
      let idx = currentIndex;

      while (count > 0) {
        if (prevPlayers[idx % n].isActive) count--;
        if (count > 0) idx++;
      }

      idx = idx % n;

      const newPlayers = prevPlayers.map((p, i) =>
        i === idx ? { ...p, isActive: false } : p
      );

      setEliminationHistory((prev) => [...prev, idx + 1]);

      const activeCount = newPlayers.filter((p) => p.isActive).length;
      if (activeCount === 1) {
        const winner = newPlayers.find((p) => p.isActive).id;
        setWinner(winner);
        setIsPlaying(false);
      }

      setCurrentIndex(idx);
      setRotation((prev) => prev + 360 / n);
      return newPlayers;
    });
  };

  useEffect(() => {
    initializePlayers();
  }, [n]);

  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(simulateStep, speed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentIndex, speed]);

  const getPlayerStyles = (player) => {
    if (!player.isActive) {
      return {
        circle: "fill-gray-200 opacity-40",
        text: "text-gray-600",
      };
    }
    if (player.id === winner) {
      return {
        circle: "fill-green-500",
        text: "text-white",
      };
    }
    return {
      circle: "fill-blue-500",
      text: "text-white",
    };
  };

  return (
    <div className="w-full max-w-3xl p-6 space-y-6 bg-gray-50 rounded-lg">
      <div className="flex flex-wrap gap-6 items-center justify-between">
        <div className="space-y-4">
          <div className="flex gap-4">
            <div>
              <label className="block text-sm font-medium">Players (n)</label>
              <input
                type="number"
                value={n}
                onChange={(e) =>
                  setN(Math.max(2, parseInt(e.target.value) || 2))
                }
                className="w-24 p-2 border rounded"
                min="2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Skip (k)</label>
              <input
                type="number"
                value={k}
                onChange={(e) =>
                  setK(Math.max(1, parseInt(e.target.value) || 1))
                }
                className="w-24 p-2 border rounded"
                min="1"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium">Speed (ms)</label>
            <input
              type="range"
              min="200"
              max="2000"
              step="100"
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              className="w-48"
            />
          </div>
        </div>

        <div className="space-x-2">
          <button
            onClick={() => {
              initializePlayers();
              setIsPlaying(false);
            }}
            className="p-2 text-gray-600 hover:bg-gray-200 rounded-full"
          >
            <RotateCcw size={24} />
          </button>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2 text-blue-600 hover:bg-blue-100 rounded-full"
          >
            {isPlaying ? <StopCircle size={24} /> : <PlayCircle size={24} />}
          </button>
        </div>
      </div>

      <div className="flex gap-6">
        <div className="relative w-80 h-80">
          <svg
            viewBox="-110 -110 220 220"
            className="transform transition-transform duration-1000"
            style={{ transform: `rotate(${rotation}deg)` }}
          >
            {players.map((player, i) => {
              const nextActive = players.findIndex(
                (p, j) => j > i && p.isActive
              );
              if (nextActive === -1 || !player.isActive) return null;

              const x1 = 100 * Math.cos(player.angle);
              const y1 = 100 * Math.sin(player.angle);
              const x2 = 100 * Math.cos(players[nextActive].angle);
              const y2 = 100 * Math.sin(players[nextActive].angle);

              return (
                <line
                  key={`line-${i}`}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  className="stroke-blue-200"
                  strokeWidth="2"
                />
              );
            })}

            {players.map((player) => {
              const x = 100 * Math.cos(player.angle);
              const y = 100 * Math.sin(player.angle);
              const styles = getPlayerStyles(player);
              return (
                <g
                  key={player.id}
                  transform={`translate(${x},${y})`}
                  className="transition-all duration-500"
                >
                  <circle
                    r="20"
                    className={`transition-colors duration-300 ${styles.circle}`}
                  />
                  <text
                    className={`text-sm font-medium ${styles.text}`}
                    textAnchor="middle"
                    dy="0.3em"
                  >
                    {player.id}
                  </text>
                  {!player.isActive && (
                    <line
                      x1="-14"
                      y1="-14"
                      x2="14"
                      y2="14"
                      className="stroke-gray-400 stroke-2"
                    />
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        <div className="flex-1">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="font-medium mb-2">Elimination Order</h3>
            <div className="space-y-2">
              {eliminationHistory.map((id, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 animate-fade-in"
                >
                  <span className="text-sm text-gray-500">#{index + 1}</span>
                  <ArrowRight size={16} className="text-gray-400" />
                  <span className="font-medium">Player {id}</span>
                </div>
              ))}
            </div>
          </div>

          {winner && (
            <div className="mt-4 p-4 bg-green-100 text-green-800 rounded-lg animate-bounce">
              Winner: Player {winner}! 🎉
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JosephusProblem;
