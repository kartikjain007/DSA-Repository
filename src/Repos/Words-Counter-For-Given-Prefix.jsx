import React, { useState, useEffect } from "react";

const PrefixCounter = () => {
  const [word, setWord] = useState(["leetcode", "win", "loops", "success"]);
  const [pref, setPref] = useState("code");
  const [counter, setCounter] = useState(0);
  const [currentWord, setCurrentWord] = useState("");

  function checkPrefix() {
    const count = word.reduce((acc, word) => {
      return word.startsWith(pref) ? acc + 1 : acc;
    }, 0);
    setCounter(count);
  }

  function reset() {
    setCounter(0);
    // setCurrentWord("");
  }
  return (
    <>
      <div>
        {counter}
        <button onClick={checkPrefix}>Start</button>
        <button onClick={reset}>Reset</button>
      </div>
    </>
  );
};

export default PrefixCounter;
