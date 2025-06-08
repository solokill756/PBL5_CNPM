import React from 'react';
import { motion } from 'framer-motion';

const CountdownTimer = ({ timeLeft, totalTime }) => {
  const percentage = Math.max(0, (timeLeft / totalTime) * 100);
  const isWarning = timeLeft <= 3;
  
  return (
    <div className="relative w-full h-4 bg-gray-200 rounded-full overflow-hidden">
      <motion.div
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 0.5, ease: "linear" }}
        className={`absolute top-0 left-0 h-full transition-colors duration-300 ${
          isWarning 
            ? 'bg-red-500' 
            : (timeLeft <= 5 ? 'bg-yellow-500' : 'bg-green-500')
        }`}
      />
      <div className="absolute top-0 left-0 w-full flex justify-center items-center h-full text-xs font-bold text-white mix-blend-difference">
        {Math.max(0, timeLeft)}s
      </div>
    </div>
  );
};

export default CountdownTimer;