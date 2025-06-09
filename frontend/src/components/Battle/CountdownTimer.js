import React, { memo } from 'react';

const CountdownTimer = memo(({ timeLeft, totalTime }) => {
  const percentage = Math.max(0, (timeLeft / totalTime) * 100);
  const isWarning = timeLeft <= 3;
  const isCaution = timeLeft <= 5;
  
  // Xác định màu text dựa trên trạng thái
  const getTextColor = () => {
    if (isWarning) return 'text-white';
    if (isCaution) return 'text-white';
    return 'text-white';
  };
  
  // Xác định màu background và shadow
  const getProgressStyles = () => {
    if (isWarning) {
      return 'bg-gradient-to-r from-red-600 to-red-500 shadow-red-500/50';
    }
    if (isCaution) {
      return 'bg-gradient-to-r from-yellow-600 to-yellow-500 shadow-yellow-500/50';
    }
    return 'bg-gradient-to-r from-green-600 to-green-500 shadow-green-500/50';
  };
  
  return (
    <div className="relative w-full h-4 bg-gray-200 rounded-full overflow-hidden shadow-inner">
      <div
        className={`absolute top-0 left-0 h-full rounded-full shadow-lg transition-all duration-1000 ease-out ${getProgressStyles()}`}
        style={{ 
          width: `${percentage}%`,
          transform: 'translateZ(0)',
          // Thêm cubic-bezier cho animation mượt hơn
          transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      />
      
      {/* Shine effect */}
      <div 
        className="absolute top-0 left-0 h-full rounded-full opacity-30 bg-gradient-to-r from-transparent via-white to-transparent transition-all duration-1000"
        style={{ 
          width: `${percentage}%`,
          transform: 'translateZ(0)'
        }}
      />
      
      {/* Text overlay với shadow để dễ đọc */}
      <div className={`absolute top-0 left-0 w-full flex justify-center items-center h-full text-xs font-bold ${getTextColor()} transition-colors duration-300`}>
        <span className="drop-shadow-sm">
          {Math.max(0, timeLeft)}s
        </span>
      </div>
    </div>
  );
});

CountdownTimer.displayName = 'CountdownTimer';

export default CountdownTimer;