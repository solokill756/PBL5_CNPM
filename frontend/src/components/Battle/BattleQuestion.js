import React from 'react';
import { motion } from 'framer-motion';
import { IoCheckmarkCircle } from 'react-icons/io5';

const BattleQuestion = ({ 
  currentQuestion, 
  selectedAnswer, 
  timerActive, 
  onSubmitAnswer 
}) => {
  if (!currentQuestion) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100"
    >
      <div className="p-8 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-100">
        <motion.h3
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-2xl font-bold text-center text-gray-800 leading-relaxed"
        >
          {currentQuestion.question}
        </motion.h3>
      </div>

      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {["A", "B", "C", "D"].map((option, index) => {
            const optionText = currentQuestion[`option_${option.toLowerCase()}`];
            const isSelected = selectedAnswer === optionText;
            const isDisabled = selectedAnswer !== null || !timerActive;

            return (
              <motion.button
                key={option}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={!isDisabled ? { 
                  scale: 1.02, 
                  boxShadow: "0 8px 25px rgba(0,0,0,0.1)" 
                } : {}}
                whileTap={!isDisabled ? { scale: 0.98 } : {}}
                onClick={() => onSubmitAnswer(optionText)}
                disabled={isDisabled}
                className={`p-6 rounded-xl text-left transition-all duration-300 border-2 ${
                  isSelected
                    ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white border-blue-500 shadow-lg"
                    : isDisabled
                    ? "bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed"
                    : "bg-white border-gray-300 hover:border-blue-400 hover:bg-blue-50 shadow-md hover:shadow-lg"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-xl mr-3">{option}.</span>
                    <span className="text-lg">{optionText}</span>
                  </div>
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring" }}
                    >
                      <IoCheckmarkCircle className="text-2xl" />
                    </motion.div>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>

        {selectedAnswer && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 text-center"
          >
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 px-6 py-3 rounded-2xl border border-blue-200">
              <IoCheckmarkCircle className="text-xl" />
              <span className="font-semibold">Đã gửi câu trả lời!</span>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default BattleQuestion;