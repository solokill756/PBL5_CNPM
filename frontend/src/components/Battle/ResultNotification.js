import React from 'react';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaTimesCircle, FaClock } from 'react-icons/fa';

const ResultNotification = ({ 
  playerCorrect, 
  opponentCorrect, 
  playerTime, 
  opponentTime, 
  playerPoints,
  opponentPoints,
  questionResults 
}) => {
  
  // Get detailed results from BE
  const getPlayerDetails = () => {
    if (!questionResults?.answers) return null;
    
    const answersArray = Object.values(questionResults.answers);
    return {
      player: answersArray[0],
      opponent: answersArray[1]
    };
  };
  
  const details = getPlayerDetails();
  
  const renderPlayerResult = (isPlayer, correct, time, points, answer) => {
    const isTimeout = answer?.answer === null;
    
    return (
      <div className="flex justify-between items-center p-3 rounded-lg bg-gray-50 mb-3">
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
        <div>
          <span className="text-gray-600 mr-2">
            {isTimeout ? "Hết giờ" : `${time.toFixed(1)}s`}
          </span>
          <span className="font-bold text-lg text-indigo-600">+{points}</span>
        </div>
      </div>
    );
  };
  
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
        
        <div className="space-y-3 mb-6">
          {details ? (
            <>
              {renderPlayerResult(true, details.player?.isCorrect, playerTime, details.player?.points || 0, details.player)}
              {renderPlayerResult(false, details.opponent?.isCorrect, opponentTime, details.opponent?.points || 0, details.opponent)}
            </>
          ) : (
            <>
              {renderPlayerResult(true, playerCorrect, playerTime, playerPoints)}
              {renderPlayerResult(false, opponentCorrect, opponentTime, opponentPoints)}
            </>
          )}
        </div>
        
        {/* Show correct answer */}
        {questionResults?.correctAnswer && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
            <p className="text-sm text-blue-800">
              <span className="font-semibold">Đáp án đúng:</span> {questionResults.correctAnswer}
            </p>
          </div>
        )}
        
        {/* <button
          onClick={onContinue}
          className="w-full py-3 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition-colors"
        >
          Tiếp tục
        </button> */}
        
        {/* <p className="text-xs text-gray-500 text-center mt-2">
          Câu tiếp theo sẽ bắt đầu khi cả hai người chơi sẵn sàng
        </p> */}
      </motion.div>
    </motion.div>
  );
};

export default ResultNotification;