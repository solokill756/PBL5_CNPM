import React from 'react';
import { motion } from 'framer-motion';
import { FiClock } from 'react-icons/fi';

const BattleTimer = ({ timeLeft, totalTime = 10 }) => {
  const percentage = (timeLeft / totalTime) * 100;
  const isWarning = timeLeft <= 3;
  const isUrgent = timeLeft <= 5;

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="bg-white rounded-2xl shadow-xl p-6 mb-6 border border-gray-100"
    >
      <div className="flex items-center justify-center gap-4 mb-4">
        <motion.div
          animate={isWarning ? { 
            scale: [1, 1.2, 1],
            rotate: [0, -5, 5, 0]
          } : {}}
          transition={{ duration: 0.5, repeat: isWarning ? Infinity : 0 }}
        >
          <FiClock className={`text-3xl ${
            isWarning ? 'text-red-500' : isUrgent ? 'text-yellow-500' : 'text-green-500'
          }`} />
        </motion.div>
        <motion.span
          key={timeLeft}
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          className={`text-4xl font-bold ${
            isWarning ? 'text-red-600' : isUrgent ? 'text-yellow-600' : 'text-green-600'
          }`}
        >
          {timeLeft}s
        </motion.span>
      </div>
      
      <div className="relative w-full h-4 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: "100%" }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.1, ease: "linear" }}
          className={`absolute top-0 left-0 h-full rounded-full ${
            isWarning 
              ? 'bg-gradient-to-r from-red-500 to-red-600' 
              : isUrgent 
              ? 'bg-gradient-to-r from-yellow-500 to-yellow-600'
              : 'bg-gradient-to-r from-green-500 to-green-600'
          }`}
        />
        {isWarning && (
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 0.5, repeat: Infinity }}
            className="absolute inset-0 bg-red-400 rounded-full"
          />
        )}
      </div>
    </motion.div>
  );
};

export default BattleTimer;