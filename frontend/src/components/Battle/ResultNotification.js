import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaTimesCircle, FaClock } from 'react-icons/fa';

const ResultNotification = ({ 
  playerCorrect, 
  opponentCorrect, 
  playerTime, 
  opponentTime, 
  playerPoints,
  opponentPoints,
  playerTimeout,
  opponentTimeout,
  questionResults,
  currentUser
}) => {
  const [showNotification, setShowNotification] = useState(true);
  
  // Auto hide after 2.5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowNotification(false);
    }, 2500);
    
    return () => clearTimeout(timer);
  }, []);
  
  const renderPlayerResult = (isPlayer, correct, time, points, isTimeout) => {
    return (
      <motion.div
        initial={{ opacity: 0, x: isPlayer ? -20 : 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: isPlayer ? 0.1 : 0.2 }}
        className="flex justify-between items-center p-3 rounded-lg bg-gray-50 mb-3"
      >
        <div className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${
            isTimeout 
              ? 'bg-yellow-100 text-yellow-600'
              : correct 
                ? 'bg-green-100 text-green-600' 
                : 'bg-red-100 text-red-600'
          }`}>
            {isTimeout ? (
              <FaClock />
            ) : correct ? (
              <FaCheckCircle />
            ) : (
              <FaTimesCircle />
            )}
          </div>
          <span className="font-semibold">{isPlayer ? "Bạn" : "Đối thủ"}</span>
        </div>
        <div className="text-right">
          <div className="text-gray-600 text-sm">
            {isTimeout ? "Hết giờ" : `${time.toFixed(1)}s`}
          </div>
          <div className="font-bold text-lg text-indigo-600">+{points}</div>
        </div>
      </motion.div>
    );
  };
  
  if (!showNotification) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.8, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 20 }}
        className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full"
      >
        <motion.h3
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-2xl font-bold mb-4 text-center text-gray-800"
        >
          Kết quả lượt này
        </motion.h3>
        
        <div className="space-y-3 mb-6">
          {renderPlayerResult(true, playerCorrect, playerTime, playerPoints, playerTimeout)}
          {renderPlayerResult(false, opponentCorrect, opponentTime, opponentPoints, opponentTimeout)}
        </div>
        
        {/* Show correct answer từ backend question */}
        {questionResults?.question?.correct_answer && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4"
          >
            <p className="text-sm text-blue-800">
              <span className="font-semibold">Đáp án đúng:</span> {questionResults.question.correct_answer}
            </p>
          </motion.div>
        )}
        
        {/* Progress indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center"
        >
          <div className="flex items-center justify-center gap-2 text-gray-500 text-sm">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full"
            />
            <span>Chuẩn bị câu tiếp theo...</span>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default ResultNotification;