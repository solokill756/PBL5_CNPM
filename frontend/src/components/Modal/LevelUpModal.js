import React from 'react';
import { motion } from 'framer-motion';

const LevelUpModal = ({ levelUpResults, onClose }) => {
  if (!levelUpResults) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full"
      >
        <div className="text-center">
          <div className="inline-flex items-center justify-center p-2 bg-indigo-100 rounded-full mb-4">
            <motion.div
              initial={{ scale: 0.5, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.3, type: "spring" }}
              className="w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold"
            >
              {levelUpResults.newLevel}
            </motion.div>
          </div>

          <h3 className="text-2xl font-bold mb-2">Chúc mừng!</h3>
          <p className="text-lg mb-6">
            Bạn đã đạt{" "}
            <span className="text-indigo-600 font-semibold">
              cấp độ {levelUpResults.newLevel}
            </span>
          </p>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h4 className="font-semibold text-gray-700 mb-3">
              Phần thưởng mở khóa:
            </h4>
            <div className="flex flex-wrap gap-2 justify-center">
              {levelUpResults.rewards.topics &&
                levelUpResults.rewards.topics.map((topic) => (
                  <span
                    key={topic}
                    className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm"
                  >
                    Chủ đề: {topic}
                  </span>
                ))}
              {levelUpResults.rewards.badges &&
                levelUpResults.rewards.badges.map((badge) => (
                  <span
                    key={badge}
                    className="px-3 py-1 bg-yellow-50 text-yellow-700 rounded-full text-sm"
                  >
                    Huy hiệu: {badge}
                  </span>
                ))}
              {levelUpResults.rewards.themes &&
                levelUpResults.rewards.themes.map((theme) => (
                  <span
                    key={theme}
                    className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm"
                  >
                    Giao diện: {theme}
                  </span>
                ))}
            </div>
          </div>

          <button
            onClick={onClose}
            className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            Tiếp tục học
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default LevelUpModal;