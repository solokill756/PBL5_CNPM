import React from 'react';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaTimesCircle, FaClock } from 'react-icons/fa';

const VocabularyQuestion = ({ 
  question, 
  playerAnswer, 
  onSelectAnswer, 
  currentQuestion,
  questionCount,
  playerAnswerTime,
  questionResults,
  waitingForOpponent
}) => {
  if (!question) return null;
  
  // Check if question is completed (both players answered)
  const isQuestionCompleted = questionResults && questionResults.answers;
  
  // Get player's actual result from BE
  const getPlayerResult = () => {
    if (!isQuestionCompleted) return null;
    
    const answersArray = Object.values(questionResults.answers);
    return answersArray.find(answer => answer.answer === playerAnswer);
  };
  
  const playerResult = getPlayerResult();
  
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
        </motion.div>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {question.options.map((option, index) => {
            // Determine option state
            const isSelected = playerAnswer === option;
            const isCorrect = option === question.correctAnswer;
            const isTimeout = playerAnswer === "timeout";
            const showCorrectAnswer = isQuestionCompleted || isTimeout;
            
            let optionClass = "";
            let icon = null;
            
            if (isQuestionCompleted || isTimeout) {
              if (isCorrect) {
                optionClass = 'bg-green-100 border-2 border-green-500 text-green-800';
                icon = <FaCheckCircle className="text-green-600 w-5 h-5" />;
              } else if (isSelected && !isCorrect) {
                optionClass = 'bg-red-100 border-2 border-red-500 text-red-800';
                icon = <FaTimesCircle className="text-red-600 w-5 h-5" />;
              } else {
                optionClass = 'bg-gray-100 border-2 border-gray-200 text-gray-500';
              }
            } else if (isSelected) {
              optionClass = 'bg-blue-100 border-2 border-blue-500 text-blue-800';
            } else if (playerAnswer !== null) {
              optionClass = 'bg-gray-100 border-2 border-gray-200 text-gray-500';
            } else {
              optionClass = 'bg-white border-2 border-gray-200 hover:border-indigo-300 hover:bg-indigo-50';
            }
            
            return (
              <motion.button
                key={`option-${currentQuestion}-${index}`}
                whileHover={{ scale: playerAnswer === null ? 1.02 : 1 }}
                whileTap={{ scale: playerAnswer === null ? 0.98 : 1 }}
                disabled={playerAnswer !== null}
                onClick={() => onSelectAnswer(option)}
                className={`p-4 rounded-xl text-left transition-all ${optionClass}`}
              >
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium">{option}</span>
                  {icon}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
      
      {/* Show result after answering */}
      {playerAnswer !== null && (
        <div className={`p-4 border-t ${
          playerAnswer === "timeout" 
            ? 'bg-yellow-50 border-yellow-100' 
            : playerResult?.isCorrect 
              ? 'bg-green-50 border-green-100' 
              : 'bg-red-50 border-red-100'
        }`}>
          <div className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
              playerAnswer === "timeout" 
                ? 'bg-yellow-100 text-yellow-600'
                : playerResult?.isCorrect 
                  ? 'bg-green-100 text-green-600' 
                  : 'bg-red-100 text-red-600'
            }`}>
              {playerAnswer === "timeout" ? (
                <FaClock />
              ) : playerResult?.isCorrect ? (
                <FaCheckCircle />
              ) : (
                <FaTimesCircle />
              )}
            </div>
            <div>
              <p className={`font-medium ${
                playerAnswer === "timeout" 
                  ? 'text-yellow-800'
                  : playerResult?.isCorrect 
                    ? 'text-green-800' 
                    : 'text-red-800'
              }`}>
                {playerAnswer === "timeout" 
                  ? 'Hết thời gian!' 
                  : playerResult?.isCorrect 
                    ? 'Chính xác!' 
                    : 'Sai rồi!'}
              </p>
              <p className="text-sm text-gray-600">
                {playerAnswer === "timeout" 
                  ? '+0 điểm (hết thời gian)'
                  : playerResult
                    ? `+${playerResult.points} điểm (${(playerResult.responseTime / 1000).toFixed(1)}s)`
                    : `Đáp án đúng là: ${question.correctAnswer}`}
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Show waiting status */}
      {waitingForOpponent && !isQuestionCompleted && (
        <div className="p-4 bg-blue-50 border-t border-blue-100">
          <div className="flex items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full mr-2"
            />
            <span className="text-blue-700 font-medium">Đang chờ đối thủ trả lời...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default VocabularyQuestion;