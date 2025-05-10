import React, { useRef, useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";

// Modal component integrated directly
const Modal = ({ isOpen, onClose, children, size = "max-w-2xl" }) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black bg-opacity-50"
      onClick={handleOverlayClick} 
    >
      <div className={`relative w-full ${size} max-h-full`}>
        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
          <div className="p-5">
            {children}
          </div>
        </div>
        <button className="absolute p-3 top-0 right-0" onClick={onClose}>
          <IoClose className="size-6"/>
        </button>
      </div>
    </div>
  );
};

const questions = [
  { id: 1, definition: "ゆるい lỏng HOÃN", options: ["緩い", "惜しい", "鈍い", "鋭い"], answer: "緩い" },
  { id: 2, definition: "かってな _ ích kỷ...", options: ["勝手な", "丁寧な", "親切な", "楽な"], answer: "勝手な" },
  { id: 3, definition: "かってな _ ích kỷ...", options: ["勝手な", "丁寧な", "親切な", "楽な"], answer: "勝手な" },
  { id: 4, definition: "かってな _ ích kỷ...", options: ["勝手な", "丁寧な", "親切な", "楽な"], answer: "勝手な" },
  { id: 5, definition: "かってな _ ích kỷ...", options: ["勝手な", "丁寧な", "親切な", "楽な"], answer: "勝手な" },
  { id: 6, definition: "かってな _ ích kỷ...", options: ["勝手な", "丁寧な", "親切な", "楽な"], answer: "勝手な" },
  { id: 7, definition: "かってな _ ích kỷ...", options: ["勝手な", "丁寧な", "親切な", "楽な"], answer: "勝手な" },
];

// Question navigator component - modified to show red numbers for answered questions
const QuestionNavigator = ({ questions, currentQuestionIndex, onNavigate, currentAnswer }) => {
  return (
    <div className="bg-slate-50 p-4 rounded-lg shadow-md">
      <h3 className="text-red-700 font-semibold text-base mb-3">Nhiều lựa chọn</h3>
      <div className="grid grid-cols-5 gap-2 sm:gap-3">
        {questions.map((question, index) => {
          // Check if this question has been answered
          const isAnswered = currentAnswer && currentAnswer[index];
          
          return (
            <button
              key={question.id}
              onClick={() => onNavigate(index)}
              className={`py-2 rounded-md text-center transition-all ${
                currentQuestionIndex === index
                  ? "bg-slate-200 font-medium"
                  : "hover:bg-slate-100"
              } ${
                isAnswered ? "text-red-700" : "text-gray-700"
              }`}
            >
              {question.id}
            </button>
          );
        })}
      </div>
    </div>
  );
};

const QuizPage = () => {
  const [currentAnswer, setCurrentAnswer] = useState({});
  const [isOpen, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const questionRefs = useRef([]);
  
  // Check if all questions are answered
  const isAllAnswered = questions.length === Object.keys(currentAnswer).length;

  const handleAnswer = (qIndex, selectedOption) => {
    setCurrentAnswer((prev) => ({ ...prev, [qIndex]: selectedOption }));
    setCurrentQuestionIndex(qIndex);
    setTimeout(() => {
      const nextRef = questionRefs.current[qIndex + 1];
      if (nextRef) {
        nextRef.scrollIntoView({ behavior: "smooth", block: "center" });
        setCurrentQuestionIndex(qIndex + 1);
      }
    }, 100);
  };
  
  const navigateToQuestion = (index) => {
    questionRefs.current[index]?.scrollIntoView({ behavior: "smooth", block: "center" });
    setCurrentQuestionIndex(index);
  };

  const handleSubmit = async () => {
    const result = questions.map((q, idx) => ({
      questionId: q.id,
      selected: currentAnswer[idx] || null,
      correct: q.answer,
    }));

    try {
      const res = await fetch("/api/submit-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: result }),
      });

      const data = await res.json();
      console.log("Server response:", data);
      setSubmitted(true);
      setOpen(false);
    } catch (error) {
      console.error("Submit error:", error);
    }
  };

  const handleCheckBeforeSubmit = () => {
    const unansweredIndex = questions.findIndex((_, index) => !currentAnswer[index]);
    if (unansweredIndex !== -1) {
      setOpen(true);
      questionRefs.current[unansweredIndex]?.scrollIntoView({ behavior: "smooth", block: "center" });
      setCurrentQuestionIndex(unansweredIndex);
    } else {
      handleSubmit(); 
    }
  };

  const onClose = () => setOpen(false);

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      {/* Fixed position navigator for desktop */}
      <div className="hidden lg:block fixed left-8 top-8 w-64 z-40">
        <QuestionNavigator 
          questions={questions} 
          currentQuestionIndex={currentQuestionIndex}
          onNavigate={navigateToQuestion}
          currentAnswer={currentAnswer}
        />
      </div>

      {/* Mobile/Tablet navigator (non-fixed) */}
      <div className="lg:hidden mb-6">
        <QuestionNavigator 
          questions={questions} 
          currentQuestionIndex={currentQuestionIndex}
          onNavigate={navigateToQuestion}
          currentAnswer={currentAnswer}
        />
      </div>
      
      {/* Questions list with proper margin to accommodate the fixed sidebar */}
      <div className="lg:ml-72">
        <div className="space-y-16 w-full flex-col gap-4">
          {questions.map((q, index) => (
            <div
              key={q.id}
              ref={(el) => (questionRefs.current[index] = el)}
              className="bg-white p-12 rounded-2xl shadow-lg min-h-[40rem] w-full"
            >
              <p className="text-sm mb-4 text-gray-700 font-semibold">Định nghĩa:</p>
              <p className="text-3xl mb-8">{q.definition}</p>
              <p className="text-sm mb-8 text-gray-700 font-semibold mt-40">Chọn thuật ngữ đúng</p>
              <div className="grid grid-cols-2 gap-6 mt-8 text-lg">
                {q.options.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => handleAnswer(index, opt)}
                    className={`border text-2xl px-8 py-6 h-24 rounded-lg ${
                      currentAnswer[index] === opt ? "bg-blue-100 border-blue-500 border-2" : "hover:border-2 hover:border-gray-400"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Submit Button Section */}
        {!submitted && (
          <div className="text-center py-16 rounded-xl mt-10 mb-20">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              Tất cả đã xong! Bạn đã sẵn sàng gửi bài kiểm tra?
            </h2>
            <button
              onClick={handleCheckBeforeSubmit}
              disabled={!isAllAnswered}
              className={`${
                !isAllAnswered ? "bg-gray-400 cursor-not-allowed" : "bg-red-700 hover:bg-red-800"
              } text-white font-semibold text-xl px-10 py-4 rounded-full transition-all duration-300`}
            >
              Gửi bài kiểm tra
            </button>
          </div>
        )}

        {submitted && (
          <div className="text-center py-20 bg-green-50 rounded-xl mt-10 mb-20">
            <h2 className="text-3xl font-bold text-green-600">
              ✅ Bài kiểm tra đã được gửi thành công!
            </h2>
          </div>
        )}
        
        {/* Confirmation Modal */}
        <Modal isOpen={isOpen} onClose={onClose} size="max-w-4xl">
          <div className="px-2 py-4">
            <h3 className="text-2xl font-semibold mb-4 text-gray-800">
              Có vẻ như bạn đã bỏ qua một số câu hỏi
            </h3>
            <p className="mb-6 text-gray-600">
              Bạn muốn xem lại các câu hỏi đã bỏ qua hay gửi bài kiểm tra ngay bây giờ?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded"
              >
                Xem lại các câu hỏi đã bỏ qua
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded"
              >
                Gửi bài kiểm tra
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default QuizPage;