import React from "react";

export default function LearnProgressBar({ correct, total, nextReview, className = "" }) {
  // Calculate percentages for the progress bar
  const correctPercent = total > 0 ? (correct / total) * 100 : 0;
  const reviewPercent = total > 0 ? (nextReview / total) * 100 : 0;
  
  // Calculate remaining items until next review
  const remainToReview = Math.max(nextReview - correct, 0);
  
  // Minimum width for visibility even when correct is 0
  const minCorrectWidth = 6; // px

  return (
    <div className={`flex items-center w-full h-8 ${className}`}>
      {/* Current correct count */}
      <div className="w-16 h-8 flex items-center justify-center rounded-full bg-emerald-100 text-base font-semibold mr-2">
        {correct}
      </div>
      
      {/* Progress bar container */}
      <div className="relative flex-1 h-4 rounded-full bg-gray-200 overflow-hidden group">
        {/* Next review threshold (light green) */}
        <div
          className="absolute left-0 top-0 h-4 bg-emerald-300 z-10 group/next"
          style={{
            width: `${reviewPercent}%`,
            borderRadius: reviewPercent >= 99.9 ? "16px" : "16px 0 0 16px",
          }}
        >
          {/* Tooltip for remaining items to review */}
          {reviewPercent > correctPercent && (
            <div
              className="absolute left-1/2 top-[-56px] -translate-x-1/2 px-4 py-2 bg-gray-900 text-white text-base rounded-lg font-semibold shadow-lg opacity-0 group-hover/next:opacity-100 pointer-events-none transition"
              style={{ minWidth: 260, whiteSpace: "pre-line" }}
            >
              {remainToReview > 0 ? 
                `Còn ${remainToReview} câu nữa đến lượt ôn tập` : 
                'Sắp đến lượt ôn tập'
              }
            </div>
          )}
        </div>
        
        {/* Current progress (dark green) */}
        <div
          className="absolute left-0 top-0 h-4 bg-emerald-700 font-bold shadow-md z-20 group/correct"
          style={
            correct === 0
              ? { width: minCorrectWidth, borderRadius: "16px 0 0 16px" }
              : {
                  width: `${correctPercent}%`,
                  borderRadius: correctPercent >= 99.9 ? "16px" : "16px 0 0 16px",
                }
          }
        >
          {/* Tooltip for correct items */}
          {correct > 0 && (
            <div
              className="absolute left-1/2 top-[-56px] -translate-x-1/2 px-4 py-2 bg-gray-900 text-white text-base rounded-lg font-semibold shadow-lg opacity-0 group-hover/correct:opacity-100 pointer-events-none transition"
              style={{ minWidth: 180 }}
            >
              {`Đã biết ${correct}/${total} câu`}
            </div>
          )}
        </div>
      </div>
      
      {/* Total count */}
      <div className="w-16 h-8 flex items-center justify-center rounded-full bg-gray-200 text-base font-semibold ml-2">
        {total}
      </div>
    </div>
  );
}