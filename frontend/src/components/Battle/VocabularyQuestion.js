import React from 'react';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaTimesCircle, FaClock } from 'react-icons/fa';

const VocabularyQuestion = ({ 
  question, 
  playerAnswer, 
  onSelectAnswer, 
  currentQuestion,
  questionCount,
  questionResults,
  waitingForOpponent,
  currentUser,
  isTimeUp
}) => {
  if (!question) return null;
  
  const isQuestionCompleted = questionResults && questionResults.answers;
  
  // Get player's actual result from BE
  const getPlayerResult = () => {
    if (!isQuestionCompleted || !currentUser) return null;
    
    const answersArray = Object.values(questionResults.answers);
    const playerResult = answersArray.find(
      answerObj => answerObj.username === currentUser.username
    );
    
    return playerResult;
  };
  
  const playerResult = getPlayerResult();
  
  // Enhanced timeout logic
  const isTimeout = playerAnswer === "timeout" || 
                   (playerResult && playerResult.answer === null) ||
                   (isTimeUp && playerAnswer === null);

  const isPlayerCorrect = playerResult 
    ? playerResult.isCorrect 
    : (playerAnswer !== "timeout" && playerAnswer !== null && playerAnswer === question.correctAnswer);

  // Determine if answers should be disabled
  const isAnswerDisabled = playerAnswer !== null || isTimeUp;

  return (
    <motion.div
      key={`question-${currentQuestion}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-xl overflow-hidden"
    >
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
          {question.pronunciation && (
            <p className="text-gray-500 text-sm mt-1">
              {question.pronunciation}
            </p>
          )}
        </div>
        
        <motion.div 
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
            const showResults = isQuestionCompleted || isTimeout;
            
            let optionClass = "";
            let icon = null;
            
            if (showResults) {
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
            } else if (isAnswerDisabled) {
              optionClass = 'bg-gray-100 border-2 border-gray-200 text-gray-500';
            } else {
              optionClass = 'bg-white border-2 border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 cursor-pointer';
            }
            
            return (
              <motion.button
                key={`option-${currentQuestion}-${index}`}
                whileHover={{ scale: !isAnswerDisabled ? 1.02 : 1 }}
                whileTap={{ scale: !isAnswerDisabled ? 0.98 : 1 }}
                disabled={isAnswerDisabled}
                onClick={() => onSelectAnswer(option)}
                className={`p-4 rounded-xl text-left transition-all ${optionClass} ${
                  isAnswerDisabled ? 'cursor-not-allowed' : ''
                }`}
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
      
      {/* Player result display */}
      {(playerAnswer !== null || isQuestionCompleted) && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className={`p-4 border-t ${
            isTimeout
              ? 'bg-yellow-50 border-yellow-100' 
              : isPlayerCorrect
                ? 'bg-green-50 border-green-100' 
                : 'bg-red-50 border-red-100'
          }`}
        >
          <div className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
              isTimeout
                ? 'bg-yellow-100 text-yellow-600'
                : isPlayerCorrect
                  ? 'bg-green-100 text-green-600' 
                  : 'bg-red-100 text-red-600'
            }`}>
              {isTimeout ? (
                <FaClock />
              ) : isPlayerCorrect ? (
                <FaCheckCircle />
              ) : (
                <FaTimesCircle />
              )}
            </div>
            <div>
              <p className={`font-medium ${
                isTimeout
                  ? 'text-yellow-800'
                  : isPlayerCorrect
                    ? 'text-green-800' 
                    : 'text-red-800'
              }`}>
                {isTimeout
                  ? 'Hết thời gian!' 
                  : isPlayerCorrect
                    ? 'Chính xác!' 
                    : 'Sai rồi!'}
              </p>
              <p className="text-sm text-gray-600">
                {isTimeout
                  ? '+0 điểm (hết thời gian)'
                  : playerResult
                    ? `+${playerResult.points || 0} điểm (${((playerResult.responseTime || 0) / 1000).toFixed(1)}s)`
                    : `Đáp án đúng là: ${question.correctAnswer}`}
              </p>
            </div>
          </div>
        </motion.div>
      )}
      
      {/* Enhanced waiting status */}
      {waitingForOpponent && !isQuestionCompleted && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-4 bg-blue-50 border-t border-blue-100"
        >
          <div className="flex items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full mr-2"
            />
            <span className="text-blue-700 font-medium">
              {isTimeout || isTimeUp
                ? "Đang chờ đối thủ hoặc kết quả..." 
                : "Đang chờ đối thủ trả lời..."}
            </span>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default VocabularyQuestion;