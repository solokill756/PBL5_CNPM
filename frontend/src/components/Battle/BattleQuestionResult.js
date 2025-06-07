import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoCheckmarkCircle, IoCloseCircle } from 'react-icons/io5';

const BattleQuestionResult = ({ 
  showQuestionResult, 
  questionResults, 
  getPlayerInfo 
}) => (
  <AnimatePresence>
    {showQuestionResult && questionResults && (
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -50, scale: 0.9 }}
        className="mt-6 bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
      >
        <motion.h4
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-2xl font-bold mb-6 text-center text-gray-800"
        >
          📊 Kết quả câu hỏi
        </motion.h4>
        
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-green-50 to-green-100 border-2 border-green-200 rounded-xl p-4 mb-6"
        >
          <p className="text-green-700 font-semibold text-center text-lg">
            ✅ Đáp án đúng: <span className="font-bold">{questionResults.correctAnswer}</span>
          </p>
        </motion.div>

        <div className="space-y-4">
          {Object.entries(questionResults.answers).map(([socketId, answer], index) => {
            const playerInfo = getPlayerInfo(answer.user_id) || { username: answer.username };
            
            return (
              <motion.div
                key={socketId}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className={`flex items-center justify-between p-4 rounded-xl border-2 ${
                  answer.isCorrect 
                    ? "bg-gradient-to-r from-green-50 to-green-100 border-green-200" 
                    : "bg-gradient-to-r from-red-50 to-red-100 border-red-200"
                }`}
              >
                <div className="flex items-center gap-4">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3 + index * 0.1, type: "spring" }}
                  >
                    {answer.isCorrect ? (
                      <IoCheckmarkCircle className="text-green-500 text-2xl" />
                    ) : (
                      <IoCloseCircle className="text-red-500 text-2xl" />
                    )}
                  </motion.div>
                  <div>
                    <p className="font-bold text-lg">{playerInfo.username}</p>
                    <p className={`font-medium ${
                      answer.isCorrect ? "text-green-700" : "text-red-700"
                    }`}>
                      {answer.answer || "Không trả lời"}
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <motion.p
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="text-2xl font-bold text-blue-600"
                  >
                    +{answer.points}
                  </motion.p>
                  <p className="text-sm text-gray-500">
                    {(answer.responseTime / 1000).toFixed(1)}s
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

export default BattleQuestionResult;