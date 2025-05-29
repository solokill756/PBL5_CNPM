import React from 'react';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const ResultNotification = ({ playerCorrect, opponentCorrect, playerTime, opponentTime, onContinue }) => {
  const playerPoints = playerCorrect ? (playerTime < 5 ? 25 : 20) : 0;
  const opponentPoints = opponentCorrect ? (opponentTime < 5 ? 25 : 20) : 0;
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        className="bg-white rounded-lg shadow-2xl p-6 max-w-md w-full"
      >
        <h3 className="text-2xl font-bold mb-4 text-center">Kết quả lượt này</h3>
        
        <div className="space-y-4 mb-6">
          <div className="flex justify-between items-center p-3 rounded-lg bg-gray-50">
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${playerCorrect ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                {playerCorrect ? <FaCheckCircle /> : <FaTimesCircle />}
              </div>
              <span className="font-semibold">Bạn</span>
            </div>
            <div>
              <span className="text-gray-600 mr-2">{playerTime.toFixed(1)}s</span>
              <span className="font-bold text-lg text-indigo-600">+{playerPoints}</span>
            </div>
          </div>
          
          <div className="flex justify-between items-center p-3 rounded-lg bg-gray-50">
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${opponentCorrect ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                {opponentCorrect ? <FaCheckCircle /> : <FaTimesCircle />}
              </div>
              <span className="font-semibold">Đối thủ</span>
            </div>
            <div>
              <span className="text-gray-600 mr-2">{opponentTime.toFixed(1)}s</span>
              <span className="font-bold text-lg text-indigo-600">+{opponentPoints}</span>
            </div>
          </div>
        </div>
        
        <button
          onClick={onContinue}
          className="w-full py-3 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition-colors"
        >
          Tiếp tục
        </button>
      </motion.div>
    </motion.div>
  );
};

export default ResultNotification;