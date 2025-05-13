import React, { useRef, useState, useEffect } from "react";
import { useQuizStore } from "@/store/useQuizStore";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

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
              key={question.id}
              onClick={() => onNavigate(index)}
              className={`py-2 rounded-md text-center transition-all ${
                currentQuestionIndex === index
                  ? "bg-slate-200 font-medium"
                  : "hover:bg-slate-100"
              } ${isAnswered ? "text-red-700" : "text-gray-700"}`}
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
  const { questions, fetchQuestions, loading, error } = useQuizStore();
  const [currentAnswer, setCurrentAnswer] = useState({});
  const [isOpen, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const questionRefs = useRef([]);
  const axiosPrivate = useAxiosPrivate();
  const { flashcardId } = useParams();
  const { setAnswers } = useQuizStore();
  const navigate = useNavigate();
  const { wrongQuestions } = useQuizStore();
  const location = useLocation();
  const { setQuestions } = useQuizStore();

  useEffect(() => {
    if (location.state?.retryWrongOnly && wrongQuestions.length > 0) {
      setOpen(false);
      setQuestions(wrongQuestions);
    } else if (flashcardId) {
      fetchQuestions(flashcardId, "1", 10, axiosPrivate);
    }
  }, [flashcardId, axiosPrivate, location.state?.retryWrongOnly]);

  const isAllAnswered = questions.length === Object.keys(currentAnswer).length;

  const handleAnswer = (qIndex, selectedOption) => {
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
    const { questions, answers, setResult } = useQuizStore.getState();
    const { setWrongQuestions } = useQuizStore.getState();

    let correctCount = 0;
    const answerDetails = questions.map((q, index) => {
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
        return questions.find((q) => q.id === wrong.questionId);
      });

    setWrongQuestions(wrongQs);

    const total = questions.length;
    const score = (correctCount / total) * 100;

    const result = {
      score: Math.round(score),
    };

    setResult(result);

    try {
      await axiosPrivate.post(
        "http://localhost:9000/api/quiz/saveResultQuiz",
        result
      );
      console.log("Gửi kết quả thành công:", result);
    } catch (err) {
      console.error("Gửi kết quả thất bại:", err);
    }

    navigate(`/flashcard/${flashcardId}/quizResult`);
  };

  const handleCheckBeforeSubmit = () => {
    const unansweredIndex = questions.findIndex(
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
  if (questions.length === 0) return null;

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="hidden lg:block fixed left-8 top-32 w-64 z-30">
        <QuestionNavigator
          questions={questions}
          currentQuestionIndex={currentQuestionIndex}
          onNavigate={navigateToQuestion}
          currentAnswer={currentAnswer}
        />
      </div>

      <div className="lg:hidden mb-6 mt-6">
        <QuestionNavigator
          questions={questions}
          currentQuestionIndex={currentQuestionIndex}
          onNavigate={navigateToQuestion}
          currentAnswer={currentAnswer}
        />
      </div>

      <div className="lg:ml-72 mt-6">
        <div className="space-y-20 w-full flex-col gap-4">
          {questions.map((q, index) => (
            <div
              key={q.id}
              ref={(el) => (questionRefs.current[index] = el)}
              className="bg-white p-10 rounded-2xl shadow-xl shadow-neutral-300 w-full max-w-4xl mx-auto space-y-6"
            >
              <div className="absolute top-4 right-6 text-sm text-gray-400 font-semibold">
                Câu {index + 1}/{questions.length}
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
                      className={`border px-6 py-5 text-lg rounded-xl text-left transition-all duration-200
                        ${
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
            </div>
          ))}
        </div>

        {!submitted && (
          <div className="text-center py-16 rounded-xl mt-10 mb-20">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              Tất cả đã xong! Bạn đã sẵn sàng gửi bài kiểm tra?
            </h2>
            <button
              onClick={handleCheckBeforeSubmit}
              disabled={!isAllAnswered}
              className={`${
                !isAllAnswered
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-red-700 hover:bg-red-800"
              } text-white font-semibold text-xl px-10 py-4 rounded-full transition-all duration-300`}
            >
              Gửi bài kiểm tra
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizPage;
