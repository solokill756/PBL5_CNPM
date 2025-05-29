import React from 'react';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const VocabularyQuestion = ({ 
  question, 
  playerAnswer, 
  onSelectAnswer, 
  currentQuestion,
  questionCount,
  playerAnswerTime 
}) => {
  if (!question) return null;
  
  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
              Thuật ngữ tiếng Nhật
            </span>
            <span className="text-sm text-gray-500 font-medium">
              Câu {currentQuestion + 1}/{questionCount}
            </span>
          </div>
          <h2 className="text-3xl font-bold text-gray-800">
            {question.term}
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            {question.pronunciation}
          </p>
        </div>
        
        <motion.div 
          key={`question-${currentQuestion}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-indigo-50 rounded-lg p-4"
        >
          <p className="font-medium text-gray-700 mb-1">Chọn nghĩa đúng:</p>
          {/* <p className="text-xl font-semibold text-indigo-800">
            {question.definition}
          </p> */}
        </motion.div>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {question.options.map((option, index) => {
            // Xác định trạng thái của đáp án
            const isSelected = playerAnswer !== null && option === question.correctAnswer;
            const isCorrect = option === question.correctAnswer;
            const isWrong = playerAnswer !== null && !isCorrect && playerAnswer === false;
            
            return (
              <motion.button
                key={`option-${currentQuestion}-${index}`}
                whileHover={{ scale: playerAnswer === null ? 1.02 : 1 }}
                whileTap={{ scale: playerAnswer === null ? 0.98 : 1 }}
                disabled={playerAnswer !== null}
                onClick={() => onSelectAnswer(option)}
                className={`p-4 rounded-xl text-left transition-all ${
                  isSelected
                    ? 'bg-green-100 border-2 border-green-500 text-green-800'
                    : isWrong
                    ? 'bg-red-100 border-2 border-red-500 text-red-800'
                    : playerAnswer !== null
                    ? 'bg-gray-100 border-2 border-gray-200 text-gray-500'
                    : 'bg-white border-2 border-gray-200 hover:border-indigo-300 hover:bg-indigo-50'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium">{option}</span>
                  {isSelected && <FaCheckCircle className="text-green-600 w-5 h-5" />}
                  {isWrong && <FaTimesCircle className="text-red-600 w-5 h-5" />}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
      
      {/* Hiển thị kết quả của người chơi sau khi trả lời */}
      {playerAnswer !== null && (
        <div className={`p-4 ${playerAnswer ? 'bg-green-50 border-t border-green-100' : 'bg-red-50 border-t border-red-100'}`}>
          <div className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${playerAnswer ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
              {playerAnswer ? <FaCheckCircle /> : <FaTimesCircle />}
            </div>
            <div>
              <p className={`font-medium ${playerAnswer ? 'text-green-800' : 'text-red-800'}`}>
                {playerAnswer ? 'Chính xác!' : 'Sai rồi!'}
              </p>
              <p className="text-sm text-gray-600">
                {playerAnswer
                  ? `+${playerAnswerTime < 5 ? '25' : '20'} điểm (${playerAnswerTime.toFixed(1)}s)`
                  : `Đáp án đúng là: ${question.correctAnswer}`}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VocabularyQuestion;