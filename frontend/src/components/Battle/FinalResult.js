import React from 'react';
import { motion } from 'framer-motion';
import { IoTrophyOutline, IoRocketOutline, IoGiftOutline } from 'react-icons/io5';

const FinalResult = ({ player, opponent, gameResults, onRetry, onExit }) => {
  const playerWon = player.score > opponent.score;
  const isDraw = player.score === opponent.score;
  
  // Get rewards info from gameResults if available
  const rewards = gameResults?.rewards || null;
  
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
        className="bg-white rounded-xl shadow-2xl p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto"
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
        
        {/* Score Display */}
        <div className="flex justify-between items-center mb-6 bg-gray-50 rounded-lg p-4">
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
        
        {/* Game Stats */}
        {gameResults && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h4 className="font-semibold text-blue-800 mb-2">Thống kê trận đấu</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-blue-700">Tổng câu hỏi:</span>
                <span className="font-medium ml-1">{gameResults.totalQuestions}</span>
              </div>
              <div>
                <span className="text-blue-700">Thời gian:</span>
                <span className="font-medium ml-1">{gameResults.duration || 'N/A'}</span>
              </div>
            </div>
          </div>
        )}
        
        {/* Rewards Section */}
        {playerWon && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6"
          >
            <div className="flex items-start">
              <IoTrophyOutline className="text-yellow-500 w-6 h-6 mr-3 mt-1 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-semibold text-yellow-800 mb-2">Phần thưởng chiến thắng!</p>
                
                {/* Default rewards if no specific rewards from BE */}
                {!rewards ? (
                  <div className="space-y-1 text-yellow-700 text-sm">
                    <p>🏆 +{player.score} điểm kinh nghiệm</p>
                    <p>⭐ +1 trận thắng</p>
                    <p>🎖️ Huy hiệu "Chiến thắng Battle"</p>
                  </div>
                ) : (
                  <div className="space-y-1 text-yellow-700 text-sm">
                    {rewards.experience && <p>🏆 +{rewards.experience} điểm kinh nghiệm</p>}
                    {rewards.coins && <p>💰 +{rewards.coins} coin</p>}
                    {rewards.badge && <p>🎖️ {rewards.badge}</p>}
                    {rewards.items && rewards.items.map((item, index) => (
                      <p key={index}>🎁 {item}</p>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
        
        {/* Participation rewards for losing/draw */}
        {!playerWon && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6"
          >
            <div className="flex items-start">
              <IoGiftOutline className="text-purple-500 w-6 h-6 mr-3 mt-1 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-semibold text-purple-800 mb-2">Phần thưởng tham gia!</p>
                <div className="space-y-1 text-purple-700 text-sm">
                  <p>🏆 +{Math.floor(player.score / 2)} điểm kinh nghiệm</p>
                  <p>⭐ +1 trận đã chơi</p>
                  <p>💪 Kinh nghiệm quý báu!</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
        
        {/* Action buttons */}
        <div className="space-y-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onRetry}
            className="w-full py-3 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
          >
            <IoRocketOutline className="w-5 h-5" />
            Chơi lại
          </motion.button>
          
          <button
            onClick={onExit}
            className="w-full py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
          >
            Thoát
          </button>
        </div>
        
        {/* Don't auto-disconnect message */}
        <p className="text-xs text-gray-500 text-center mt-4">
          Bạn có thể xem kết quả này trước khi thoát
        </p>
      </motion.div>
    </motion.div>
  );
};

export default FinalResult;