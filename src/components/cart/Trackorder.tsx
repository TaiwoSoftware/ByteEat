import { useEffect, useState } from "react";

export const TrackOrder = () => {
  const totalTime = 90 * 60; // 1hr 30mins in seconds
  const [timeLeft, setTimeLeft] = useState(totalTime);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  const progress = ((totalTime - timeLeft) / totalTime) * 100;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <h1 className="text-3xl font-bold mb-4 text-gray-800 text-center">
        Your Order is Being Processed
      </h1>

      <div className="w-full max-w-xl bg-white shadow-lg p-6 rounded-lg text-center">
        <p className="text-gray-600 mb-4 text-lg">
          Estimated Time Remaining: <span className="font-bold text-blue-600">{formatTime(timeLeft)}</span>
        </p>

        <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
          <div
            className="bg-blue-600 h-full transition-all duration-1000 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>

        {timeLeft === 0 && (
          <p className="mt-4 text-green-600 font-semibold text-lg">
            🎉 Your order should have arrived!
          </p>
        )}
      </div>
    </div>
  );
};
