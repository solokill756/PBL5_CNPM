import React, { useRef, useState, useEffect } from "react";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useTestStore } from "@/store/useTestStore";

const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const QuestionNavigator = ({
  questions,
  currentQuestionIndex,
  onNavigate,
  currentAnswer,
}) => {
  return (
    <div className="bg-slate-50 p-4 rounded-lg shadow-md">
      <h3 className="text-red-700 font-semibold text-base mb-3">Câu hỏi</h3>
      <div className="grid grid-cols-5 gap-2 sm:gap-3">
        {questions.map((question, index) => {
          const isAnswered = currentAnswer && currentAnswer[index];
          return (
            <button
              key={`${question.id}-${index}`}
              onClick={() => onNavigate(index)}
              className={`py-2 rounded-md text-center transition-all ${
                currentQuestionIndex === index
                  ? "bg-slate-200 font-medium"
                  : "hover:bg-slate-100"
              } ${isAnswered ? "text-red-700" : "text-gray-700"}`}
            >
              {index + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
};

const TestPage = ({ timeLeft, isTimeUp }) => {
  const { questions, fetchQuestions, loading, error } = useTestStore();
  const [currentAnswer, setCurrentAnswer] = useState({});
  const [isOpen, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const questionRefs = useRef([]);
  const axiosPrivate = useAxiosPrivate();
  const { flashcardId } = useParams();
  const { setAnswers } = useTestStore();
  const navigate = useNavigate();
  const { wrongQuestions } = useTestStore();
  const location = useLocation();
  const { setQuestions } = useTestStore();

  useEffect(() => {
    if (questions.length > 0) {
      const shuffled = shuffleArray(questions);
      setShuffledQuestions(shuffled);
      setCurrentAnswer({});
    }
  }, [questions]);

  useEffect(() => {
    if (location.state?.retryWrongOnly && wrongQuestions.length > 0) {
      setOpen(false);
      setQuestions(wrongQuestions);
    } else if (flashcardId) {
      fetchQuestions(flashcardId, "1", 10, axiosPrivate);
    }
  }, [flashcardId, axiosPrivate, location.state?.retryWrongOnly]);

  useEffect(() => {
    if (isTimeUp && !submitted) {
      handleSubmit();
    }
  }, [isTimeUp, submitted]);

  const isAllAnswered = shuffledQuestions.length === Object.keys(currentAnswer).length;

  const handleAnswer = (qIndex, selectedOption) => {
    if (isTimeUp) return;

    setCurrentAnswer((prev) => {
      const updated = { ...prev, [qIndex]: selectedOption };
      setAnswers(updated);
      return updated;
    });

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
    questionRefs.current[index]?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
    setCurrentQuestionIndex(index);
  };

  const handleSubmit = async () => {
    if (submitted) return; 
    
    setSubmitted(true);
    
    const { answers, setResult } = useTestStore.getState();
    const { setWrongQuestions } = useTestStore.getState();

    let correctCount = 0;
    const answerDetails = shuffledQuestions.map((q, index) => {
      const selected = answers[index];
      const isCorrect = selected === q.answer;

      if (isCorrect) correctCount++;

      return {
        questionId: q.id,
        selected,
        correct: q.answer,
        isCorrect,
      };
    });

    const wrongQs = answerDetails
      .filter((a) => !a.isCorrect)
      .map((wrong) => {
        return shuffledQuestions.find((q) => q.id === wrong.questionId);
      });

    setWrongQuestions(wrongQs);

    const total = shuffledQuestions.length;
    const score = (correctCount / total) * 100;

    const result = {
      score: Math.round(score),
    };

    setResult(result);

    // try {
    //   await axiosPrivate.post(
    //     "http://localhost:9000/api/quiz/saveResultQuiz",
    //     result
    //   );
    //   console.log("Gửi kết quả thành công:", result);
    // } catch (err) {
    //   console.error("Gửi kết quả thất bại:", err);
    // }

    navigate(`/vocabulary/topic/${topicId}/TestResult`);
  };

  const handleCheckBeforeSubmit = () => {
    if (isTimeUp) return;

    const unansweredIndex = shuffledQuestions.findIndex(
      (_, index) => !currentAnswer[index]
    );
    if (unansweredIndex !== -1) {
      setOpen(true);
      questionRefs.current[unansweredIndex]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      setCurrentQuestionIndex(unansweredIndex);
    } else {
      handleSubmit();
    }
  };

  const onClose = () => setOpen(false);

  if (loading) return <div className="text-center">Đang tải câu hỏi...</div>;
  if (error) return <div className="text-center text-red-600">{error}</div>;
  if (shuffledQuestions.length === 0) return null;

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="hidden lg:block fixed left-8 top-32 w-64 z-30">
        <QuestionNavigator
          questions={shuffledQuestions}
          currentQuestionIndex={currentQuestionIndex}
          onNavigate={navigateToQuestion}
          currentAnswer={currentAnswer}
        />
      </div>

      <div className="lg:hidden mb-6 mt-6">
        <QuestionNavigator
          questions={shuffledQuestions}
          currentQuestionIndex={currentQuestionIndex}
          onNavigate={navigateToQuestion}
          currentAnswer={currentAnswer}
        />
      </div>

      <div className="lg:ml-72 mt-6">
        <div className="space-y-20 w-full flex-col gap-4">
          {shuffledQuestions.map((q, index) => (
            <div
              key={`${q.id}-${index}`}
              ref={(el) => (questionRefs.current[index] = el)}
              className={`bg-white p-10 rounded-2xl shadow-xl shadow-neutral-300 w-full max-w-4xl mx-auto space-y-6 ${
                isTimeUp ? 'opacity-75 pointer-events-none' : ''
              }`}
            >
              <div className="absolute top-4 right-6 text-sm text-gray-400 font-semibold">
                Câu {index + 1}/{shuffledQuestions.length}
              </div>
              {/* Câu hỏi */}
              <div className="">
                <p className="text-base text-gray-500 font-medium mb-1">
                  Định nghĩa:
                </p>
                <p className="text-2xl font-bold text-gray-800 ">
                  {q.definition}
                </p>
              </div>

              {/* Các đáp án */}
              <div>
                <p className="text-base text-gray-500 font-medium mb-2">
                  Chọn thuật ngữ đúng:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  {q.options.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => handleAnswer(index, opt)}
                      disabled={isTimeUp}
                      className={`border px-6 py-5 text-lg rounded-xl text-left transition-all duration-200 ${
                        isTimeUp ? 'cursor-not-allowed opacity-50' : ''
                      } ${
                        currentAnswer[index] === opt
                          ? "bg-blue-100 border-blue-500 text-blue-800 font-semibold"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Hiển thị thông báo hết thời gian trên mỗi câu hỏi */}
              {isTimeUp && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-4">
                  <p className="text-red-600 text-sm font-medium text-center">
                    ⏰ Đã hết thời gian! Bài kiểm tra đang được tự động nộp...
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {!submitted && (
          <div className="text-center py-16 rounded-xl mt-10 mb-20">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              {isTimeUp ? 'Đã hết thời gian!' : 'Tất cả đã xong! Bạn đã sẵn sàng gửi bài kiểm tra?'}
            </h2>
            <button
              onClick={handleCheckBeforeSubmit}
              disabled={!isAllAnswered || isTimeUp}
              className={`${
                !isAllAnswered || isTimeUp
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-red-700 hover:bg-red-800"
              } text-white font-semibold text-xl px-10 py-4 rounded-full transition-all duration-300`}
            >
              {isTimeUp ? "Đang tự động nộp bài..." : "Gửi bài kiểm tra"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestPage;