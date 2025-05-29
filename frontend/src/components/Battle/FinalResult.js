import React from 'react';
import { motion } from 'framer-motion';
import { IoTrophyOutline, IoRocketOutline } from 'react-icons/io5';

const FinalResult = ({ player, opponent, onRetry, onExit }) => {
  const playerWon = player.score > opponent.score;
  const isDraw = player.score === opponent.score;
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="bg-white rounded-xl shadow-2xl p-8 max-w-lg w-full"
      >
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1, rotate: [0, 10, -10, 10, 0] }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-7xl mx-auto mb-4"
          >
            {playerWon ? '🏆' : (isDraw ? '🤝' : '😔')}
          </motion.div>
          
          <h2 className="text-3xl font-bold mb-2 text-indigo-800">
            {playerWon ? 'Chúc mừng chiến thắng!' : (isDraw ? 'Hòa!' : 'Rất tiếc!')}
          </h2>
          <p className="text-gray-600 mb-6">
            {playerWon 
              ? 'Bạn đã chiến thắng đối thủ trong trận đấu từ vựng này!' 
              : (isDraw 
                ? 'Cả hai đã có một trận đấu ngang tài ngang sức!' 
                : 'Đừng nản lòng, hãy thử lại và cải thiện kỹ năng của bạn!')}
          </p>
        </div>
        
        <div className="flex justify-between items-center p-4 bg-indigo-50 rounded-lg mb-8">
          <div className="flex flex-col items-center">
            <img src={player.avatar} alt={player.name} className="w-16 h-16 rounded-full mb-2 border-3 border-indigo-500" />
            <p className="font-semibold">{player.name}</p>
            <p className="text-2xl font-bold text-indigo-600">{player.score}</p>
          </div>
          
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100 text-indigo-800 font-bold text-xl">
            VS
          </div>
          
          <div className="flex flex-col items-center">
            <img src={opponent.avatar} alt={opponent.name} className="w-16 h-16 rounded-full mb-2 border-3 border-indigo-500" />
            <p className="font-semibold">{opponent.name}</p>
            <p className="text-2xl font-bold text-indigo-600">{opponent.score}</p>
          </div>
        </div>
        
        {playerWon && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 flex items-center"
          >
            <IoTrophyOutline className="text-yellow-500 w-6 h-6 mr-3" />
            <div>
              <p className="font-semibold text-yellow-800">Thành tích đạt được!</p>
              <p className="text-yellow-700 text-sm">Bạn đã nhận được huy hiệu "Bậc thầy từ vựng" và 100 điểm kinh nghiệm!</p>
            </div>
          </motion.div>
        )}
        
        <div className="flex gap-4">
          <button
            onClick={onRetry}
            className="flex-1 py-3 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
          >
            <IoRocketOutline className="w-5 h-5" />
            Thử lại
          </button>
          <button
            onClick={onExit}
            className="flex-1 py-3 bg-gray-200 text-gray-800 rounded-lg font-bold hover:bg-gray-300 transition-colors"
          >
            Thoát
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default FinalResult;