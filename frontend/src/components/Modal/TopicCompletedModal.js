import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoClose, IoTrophy, IoSchool } from 'react-icons/io5';
import { TbBrain } from 'react-icons/tb';

const TopicCompletedModal = ({ topicResults, onClose, onAction }) => {
  if (!topicResults) return null;

  const { topicName, totalWords } = topicResults;

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
          className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
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
              Xuất sắc! 🎉
            </motion.h2>
            
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-gray-600"
            >
              Bạn đã hoàn thành chủ đề "{topicName}"
            </motion.p>
          </div>

          {/* Topic completion info */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-1">
                {totalWords}
              </div>
              <div className="text-sm text-green-800">
                từ vựng đã học thành công
              </div>
            </div>
          </div>

          {/* Achievement message */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <TbBrain className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Bạn đã hoàn thành xuất sắc!</p>
                <p>
                  Để kiểm tra kiến thức và củng cố những gì đã học, 
                  hãy thử sức với bài kiểm tra nhé!
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
              className="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:from-green-700 hover:to-blue-700 transition-all font-medium flex items-center justify-center gap-2"
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

export default TopicCompletedModal;