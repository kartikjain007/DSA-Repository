import React, { useState, useEffect } from "react";
import { Play, Pause, RotateCcw } from "lucide-react";

const PatternMatcher = () => {
  const [input, setInput] = useState("leetcode");
  const [pattern, setPattern] = useState("ee*e");
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [beforeStar, setBeforeStar] = useState("");
  const [afterStar, setAfterStar] = useState("");
  const [matched, setMatched] = useState(false);
  const [hasFinished, setHasFinished] = useState(false);
  const [matchStart, setMatchStart] = useState(-1);
  const [matchEnd, setMatchEnd] = useState(-1);
  const [middleMatch, setMiddleMatch] = useState("");

  useEffect(() => {
    const starPos = pattern.indexOf("*");
    if (starPos !== -1) {
      setBeforeStar(pattern.substring(0, starPos));
      setAfterStar(pattern.substring(starPos + 1));
    } else {
      setBeforeStar("");
      setAfterStar("");
    }
    reset();
  }, [pattern]);

  // Fixed pattern matching logic
  const findMatch = (s, p) => {
    const starPos = p.indexOf("*");
    if (starPos === -1) return false;

    const before = p.substring(0, starPos);
    const after = p.substring(starPos + 1);

    // Find all occurrences of the prefix
    for (let i = 0; i <= s.length - before.length; i++) {
      if (s.substring(i, i + before.length) === before) {
        // For each prefix match, look for suffix
        for (let j = i + before.length; j <= s.length - after.length; j++) {
          if (s.substring(j, j + after.length) === after) {
            // Found a valid match - store details
            setMatchStart(i);
            setMatchEnd(j + after.length);
            setMiddleMatch(s.substring(i + before.length, j));
            return true;
          }
        }
      }
    }
    return false;
  };

  useEffect(() => {
    let timer;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= input.length) {
            setIsPlaying(false);
            setHasFinished(true);
            const found = findMatch(input, pattern);
            setMatched(found);
            return prev;
          }
          return prev + 1;
        });
      }, 500);
    }
    return () => clearInterval(timer);
  }, [isPlaying, input, pattern]);

  const reset = () => {
    setCurrentStep(0);
    setIsPlaying(false);
    setMatched(false);
    setHasFinished(false);
    setMatchStart(-1);
    setMatchEnd(-1);
    setMiddleMatch("");
  };

  const getCharacterStyle = (idx) => ({
    width: "32px",
    height: "32px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.3s",
    backgroundColor: getBackgroundColor(idx),
    borderRadius: "4px",
    position: "relative",
  });

  const getBackgroundColor = (idx) => {
    if (!hasFinished) {
      return idx === currentStep ? "#bfdbfe" : "transparent";
    }

    if (matched && idx >= matchStart && idx < matchEnd) {
      if (idx < matchStart + beforeStar.length) {
        return "#bbf7d0"; // prefix match
      } else if (idx >= matchEnd - afterStar.length) {
        return "#bbf7d0"; // suffix match
      } else {
        return "#fde68a"; // middle part (*)
      }
    }
    return "transparent";
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl mb-6 font-bold">Substring Pattern Matcher</h2>

      <div className="flex gap-4 mb-6">
        <div className="flex-1">
          <label className="block mb-2">Input String</label>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="flex-1">
          <label className="block mb-2">Pattern</label>
          <input
            type="text"
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <div className="flex gap-2 font-mono text-2xl mb-4 justify-center">
          {input.split("").map((char, idx) => (
            <div key={idx} style={getCharacterStyle(idx)}>
              {char}
            </div>
          ))}
        </div>

        <div className="flex gap-4 justify-center">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-bbf7d0 rounded"></div>
            <span>Pattern Match</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-fde68a rounded"></div>
            <span>* Replacement</span>
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="px-4 py-2 border rounded flex items-center gap-2 hover:bg-gray-50"
        >
          {isPlaying ? <Pause size={16} /> : <Play size={16} />}
          {isPlaying ? "Pause" : "Play"}
        </button>
        <button
          onClick={reset}
          className="px-4 py-2 border rounded flex items-center gap-2 hover:bg-gray-50"
        >
          <RotateCcw size={16} />
          Reset
        </button>
      </div>

      <div
        className={`text-center p-4 rounded ${
          hasFinished
            ? matched
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
            : "bg-gray-50 text-gray-800 border border-gray-200"
        }`}
      >
        {hasFinished ? (
          matched ? (
            <div>
              <p>✅ Pattern match found!</p>
              <p className="text-sm mt-2">
                Replacing * with "{middleMatch}" creates the substring "
                {input.substring(matchStart, matchEnd)}"
              </p>
            </div>
          ) : (
            "❌ No match found. The pattern cannot be made into a substring."
          )
        ) : (
          "Searching for pattern match..."
        )}
      </div>
    </div>
  );
};

export default PatternMatcher;
