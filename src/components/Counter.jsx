import { useState, useCallback, useRef, useEffect } from 'react';
// Import sound files
import clickSoundSrc from '../assets/clicksound.wav';
import popupSoundSrc from '../assets/popupsound.wav';

const Counter = () => {
  const [count, setCount] = useState(0);
  const alertTimeoutRef = useRef(null);
  const lastDivisibleByTenRef = useRef(null);

  // Refs for audio elements
  const clickAudioRef = useRef(null);
  const popupAudioRef = useRef(null);

  // Initialize audio elements on mount
  useEffect(() => {
    clickAudioRef.current = new Audio(clickSoundSrc);
    popupAudioRef.current = new Audio(popupSoundSrc);
  }, []);

  // Function to play sound safely
  const playSound = (audioRef) => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0; // Rewind to start
      audioRef.current.play().catch(e => console.error("Audio play error:", e));
    }
  };

  // Memoize counter functions to prevent unnecessary re-renders
  const incrementCount = useCallback(() => {
    playSound(clickAudioRef); // Play click sound
    setCount(prevCount => prevCount + 1);
  }, []);

  const decrementCount = useCallback(() => {
    playSound(clickAudioRef); // Play click sound
    setCount(prevCount => prevCount - 1);
  }, []);

  const resetCount = useCallback(() => {
    // No sound for reset based on request
    setCount(0);
    lastDivisibleByTenRef.current = null;
  }, []);

  // Using a separate useEffect for showing alerts to improve performance
  useEffect(() => {
    // Clear any existing timeout to prevent multiple alerts
    if (alertTimeoutRef.current) {
      clearTimeout(alertTimeoutRef.current);
    }

    // Only show alert if count is not 0, divisible by 10, and different from the last alert
    if (count !== 0 && count % 10 === 0 && lastDivisibleByTenRef.current !== count) {
      lastDivisibleByTenRef.current = count;

      // Play popup sound before showing alert
      playSound(popupAudioRef);

      // Very short delay to ensure UI is updated first
      alertTimeoutRef.current = setTimeout(() => {
        alert(`Congratulations! The counter has reached ${count}, which is divisible by 10!`);
        alertTimeoutRef.current = null;
      }, 10); // Keep the delay minimal
    }

    return () => {
      if (alertTimeoutRef.current) {
        clearTimeout(alertTimeoutRef.current);
      }
    };
  }, [count]);

  return (
    <section id="counter" className="min-h-screen flex flex-col items-center justify-center w-full transition-all duration-200">
      <div className="w-full max-w-7xl px-6 md:px-12">
        <h2 className="text-4xl font-bold mb-8 text-center text-gray-900 dark:text-white transition-all duration-200 animate-bounce">Counter Application</h2>

        <div className="bg-white dark:bg-gray-800 p-12 rounded-lg shadow-lg max-w-md mx-auto text-center transition-all duration-200 transform hover:scale-105">
          {/* Display counter value from useState */}
          <div className="text-7xl font-bold mb-8 text-gray-900 dark:text-white transition-all duration-200">{count}</div>

          {/* Note about useEffect functionality */}
          <p className="mb-6 text-gray-600 dark:text-gray-300">
            An alert will appear when the counter is divisible by 10!
          </p>

          <div className="flex justify-center space-x-6">
            {/* Decrement button - using optimized handler */}
            <button
              className="bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white px-8 py-4 rounded-md text-2xl transition-all duration-200 transform hover:scale-110 active:scale-95"
              onClick={decrementCount} // Updated handler
              aria-label="Decrease count"
            >
              -
            </button>

            {/* Increment button - using optimized handler */}
            <button
              className="bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white px-8 py-4 rounded-md text-2xl transition-all duration-200 transform hover:scale-110 active:scale-95"
              onClick={incrementCount} // Updated handler
              aria-label="Increase count"
            >
              +
            </button>
          </div>

          {/* Reset button - using optimized handler */}
          <button
            className="mt-8 bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-white px-6 py-3 rounded-md transition-all duration-200 transform hover:scale-105 active:scale-95"
            onClick={resetCount}
            aria-label="Reset count"
          >
            Reset
          </button>
        </div>

        <div className="max-w-md mx-auto mt-8 p-6 bg-blue-50 dark:bg-blue-900 rounded-lg transform hover:rotate-1 transition-all duration-300">
          <h3 className="font-bold text-xl mb-2 text-gray-900 dark:text-white">How this component works:</h3>
          <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300 text-left">
            <li><strong>useState</strong>: Maintains the counter value and provides a way to update it</li>
            <li><strong>useEffect</strong>: Monitors changes to the counter and shows an alert when it's divisible by 10</li>
            <li>The buttons trigger state changes that React efficiently renders to the UI</li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Counter;
