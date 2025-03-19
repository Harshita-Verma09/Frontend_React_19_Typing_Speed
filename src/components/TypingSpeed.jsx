import React, { useState, useEffect } from "react";

const TypingSpeedTester = () => {
  const givenText = "The quick brown fox jumps over the lazy dog. It runs swiftly through the forest, chasing the fading light of dusk.";
  const [userInput, setUserInput] = useState(""); // User input
  const [mistakes, setMistakes] = useState(new Set()); // Mistake tracking
  const [timeLeft, setTimeLeft] = useState(60); // Timer
  const [isRunning, setIsRunning] = useState(false); // Check if typing started
  const [cpm, setCpm] = useState(0); // Characters per minute

  useEffect(() => {
    let timer;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  const handleChange = (e) => {
    if (!isRunning) setIsRunning(true);

    const value = e.target.value;
    if (value.length < userInput.length) return; // Prevent backspace

    setUserInput(value);

    if (value[value.length - 1] !== givenText[value.length - 1]) {
      setMistakes((prev) => new Set([...prev, value.length - 1])); // Store mistake index
    }

    setCpm(Math.floor((value.length / (60 - timeLeft)) * 60) || 0);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-5">
      <h2 className="text-3xl font-bold mb-4">Typing Speed Tester</h2>

      {/* Display given text with color coding */}
      <div className="text-lg mb-4 p-3 border border-gray-700 rounded-md bg-gray-900">
        {givenText.split("").map((char, index) => {
          let color;
          if (index < userInput.length) {
            color = mistakes.has(index) ? "text-red-500 underline" : "text-green-400";
          } else {
            color = "text-gray-500";
          }
          return (
            <span key={index} className={`${color}`}>
              {char}
            </span>
          );
        })}
      </div>

      {/* User input field */}
      <textarea
        rows="3"
        className="text-lg w-full max-w-2xl p-3 border border-gray-700 bg-gray-800 text-white rounded-md focus:outline-none"
        value={userInput}
        onChange={handleChange}
        disabled={timeLeft === 0}
        placeholder="Start typing..."
      />

      <h3 className="text-xl font-semibold mt-4">Time Left: {timeLeft} sec</h3>
      <h3 className="text-xl font-semibold">Typing Speed: {cpm} CPM</h3>
      {timeLeft === 0 && <h2 className="text-2xl font-bold text-yellow-400 mt-3">Final Speed: {cpm} CPM</h2>}
    </div>
  );
};

export default TypingSpeedTester;
