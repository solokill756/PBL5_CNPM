import React from "react";

export default function LearnProgressBar({ correct, review, total, className = "" }) {
  const correctPercent = (correct / total) * 100;
  const reviewPercent = (review / total) * 100;

  return (
    <div className={`flex items-center w-full h-8 ${className}`}>
      {/* Số đúng */}
      <div className="w-20 h-8 flex items-center justify-center rounded-full bg-green-100 text-xl font-semibold mr-2">
        {correct}
      </div>
      {/* Progress bar */}
      <div className="relative flex-1 h-4 rounded-full bg-gray-200 overflow-hidden">
        {/* Đúng */}
        <div
          className="absolute left-0 top-0 h-4 bg-green-700"
          style={{ width: `${correctPercent}%`, borderRadius: "16px 0 0 16px" }}
        />
        {/* Đúng nhưng cần review */}
        <div
          className="absolute left-0 top-0 h-4 bg-green-300"
          style={{
            width: `${correctPercent + reviewPercent}%`,
            borderRadius: correctPercent + reviewPercent === 100 ? "16px" : "16px 0 0 16px"
          }}
        />
      </div>
      {/* Tổng số */}
      <div className="w-20 h-8 flex items-center justify-center rounded-full bg-gray-200 text-xl font-semibold ml-2">
        {total}
      </div>
    </div>
  );
}