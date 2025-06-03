import React from 'react';
import { motion } from 'framer-motion';

const OpponentStatus = ({ playerAnswer, opponentAnswer }) => {
  if (playerAnswer === null || opponentAnswer !== null) return null;
  
  return (
    <div className="p-4 bg-yellow-50 border-t border-yellow-100 flex items-center justify-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        className="w-4 h-4 border-2 border-yellow-500 border-t-transparent rounded-full mr-2"
      />
      <span className="text-yellow-700 font-medium">Đang chờ đối thủ trả lời...</span>
    </div>
  );
};

export default OpponentStatus;