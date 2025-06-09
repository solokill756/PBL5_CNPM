import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoClose, IoTrophy, IoSchool, IoArrowForward, IoGift } from 'react-icons/io5';
import { TbBrain, TbAward } from 'react-icons/tb';

const LevelUpModal = ({ levelUpResults, onClose, onAction }) => {
  if (!levelUpResults) return null;

  const { oldLevel, newLevel, totalPoints, wordsLearned, achievements = [] } = levelUpResults;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.7, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.7, opacity: 0, y: 50 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="bg-white rounded-2xl p-8 max-w-lg w-full shadow-2xl relative max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 z-10"
          >
            <IoClose className="w-5 h-5" />
          </button>

          {/* Celebration animation */}
          <div className="text-center mb-6">
            <motion.div
              animate={{ 
                rotate: [0, -10, 10, -10, 10, 0],
                scale: [1, 1.1, 1, 1.1, 1]
              }}
              transition={{ duration: 1, repeat: Infinity, repeatDelay: 3 }}
              className="inline-block mb-4"
            >
              <IoTrophy className="w-16 h-16 text-yellow-500 mx-auto" />
            </motion.div>
            
            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-2xl font-bold text-gray-900 mb-2"
            >
              Chúc mừng! 🎉
            </motion.h2>
            
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-gray-600"
            >
              Bạn đã lên cấp độ mới!
            </motion.p>
          </div>

          {/* Level progress */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 mb-6">
            <div className="text-center mb-4">
              <div className="flex items-center justify-center gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-indigo-600">
                    Level {oldLevel}
                  </div>
                  <div className="text-sm text-gray-500">Cũ</div>
                </div>
                
                <motion.div
                  animate={{ x: [0, 10, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <IoArrowForward className="w-6 h-6 text-indigo-500" />
                </motion.div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    Level {newLevel}
                  </div>
                  <div className="text-sm text-gray-500">Mới</div>
                </div>
              </div>
            </div>
            
            <div className="text-center text-sm text-gray-600">
              <p>Tổng điểm: <span className="font-semibold">{totalPoints}</span></p>
              {wordsLearned && (
                <p>Từ vừa học: <span className="font-semibold">"{wordsLearned}"</span></p>
              )}
            </div>
          </div>

          {/* Achievements section */}
          {achievements && achievements.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 mb-3">
                <TbAward className="w-5 h-5 text-yellow-600" />
                <h3 className="font-semibold text-yellow-800">Thành tựu mở khóa</h3>
              </div>
              <div className="space-y-3">
                {achievements.map((achievement, index) => (
                  <motion.div
                    key={achievement.achievement_id || index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="flex items-center gap-3 p-3 bg-white rounded-lg border border-yellow-200 shadow-sm"
                  >
                    {/* Achievement icon */}
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-yellow-300 flex-shrink-0">
                      <img
                        src={achievement.icon}
                        alt={achievement.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = "https://cdn-icons-png.flaticon.com/512/3064/3064197.png";
                        }}
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 truncate">{achievement.title}</div>
                      <div className="text-sm text-gray-600 line-clamp-2">{achievement.description}</div>
                      {achievement.required_level && (
                        <div className="text-xs text-yellow-700 mt-1">
                          Yêu cầu Level {achievement.required_level}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-shrink-0">
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center"
                      >
                        <IoTrophy className="w-4 h-4 text-yellow-600" />
                      </motion.div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Achievement message */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <TbBrain className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-green-800">
                <p className="font-medium mb-1">Bạn đã tiến bộ rất nhiều!</p>
                <p>
                  Với cấp độ mới, bạn đã mở khóa {achievements.length} thành tựu mới. 
                  Hãy tiếp tục thử sức với bài kiểm tra để phát triển thêm nhé!
                </p>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onAction('continue')}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Tiếp tục học
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onAction('test')}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all font-medium flex items-center justify-center gap-2"
            >
              <IoSchool className="w-4 h-4" />
              Làm bài test
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default LevelUpModal;