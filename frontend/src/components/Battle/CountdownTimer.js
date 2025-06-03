import React from 'react';
import { motion } from 'framer-motion';

const CountdownTimer = ({ timeLeft, totalTime }) => {
  const percentage = (timeLeft / totalTime) * 100;
  const isWarning = timeLeft <= 3;
  
  return (
    <div className="relative w-full h-4 bg-gray-200 rounded-full overflow-hidden">
      <motion.div
        initial={{ width: `${percentage}%` }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 0.3 }}
        className={`absolute top-0 left-0 h-full ${
          isWarning 
            ? 'bg-red-500' 
            : (timeLeft <= 5 ? 'bg-yellow-500' : 'bg-green-500')
        }`}
      />
      <div className="absolute top-0 left-0 w-full flex justify-center items-center h-full text-xs font-bold text-white">
        {timeLeft}s
      </div>
    </div>
  );
};

export default CountdownTimer;