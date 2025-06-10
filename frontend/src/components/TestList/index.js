import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useTestStore } from "@/store/useTestStore";
import useTopicStore from "@/store/useTopicStore";
import { postTestResult } from "@/api/postTestResult";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";

const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const LoadingSkeleton = () => {
  return (
    <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
      <div className="max-w-4xl w-full mx-4">
        {/* Header skeleton */}
        <div className="text-center mb-8">
          <div className="h-8 bg-gray-200 rounded-lg w-64 mx-auto mb-4 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-48 mx-auto animate-pulse"></div>
        </div>

        {/* Score circle skeleton */}
        <div className="flex justify-center mb-8">
          <div className="w-48 h-48 bg-gray-200 rounded-full animate-pulse flex items-center justify-center">
            <div className="w-32 h-32 bg-gray-300 rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Stats skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-50 p-6 rounded-xl">
              <div className="h-6 bg-gray-200 rounded w-24 mx-auto mb-2 animate-pulse"></div>
              <div className="h-8 bg-gray-200 rounded w-16 mx-auto animate-pulse"></div>
            </div>
          ))}
        </div>

        {/* Buttons skeleton */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <div className="h-12 bg-gray-200 rounded-full w-48 animate-pulse"></div>
          <div className="h-12 bg-gray-200 rounded-full w-48 animate-pulse"></div>
        </div>

        {/* Loading text */}
        <div className="text-center mt-8">
          <div className="flex items-center justify-center space-x-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </div>
    </div>
  );
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

const TestPage = ({ timeLeft, isTimeUp, questionsReady, topicId }) => {
  const {
    questions,
    wrongQuestions,
    setAnswers,
    setResult,
    setWrongQuestions,
    setQuestions,
  } = useTestStore();
  const { currentTopic } = useTopicStore();
  const [currentAnswer, setCurrentAnswer] = useState({});
  const [isOpen, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // Thêm state cho loading
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const questionRefs = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();
  const axiosPrivate = useAxiosPrivate();

  // Shuffle questions chỉ khi có data và chưa shuffle
  useEffect(() => {
    if (questions.length > 0 && shuffledQuestions.length === 0) {
      const shuffled = shuffleArray(questions);
      setShuffledQuestions(shuffled);
      setCurrentAnswer({});
    }
  }, [questions.length, shuffledQuestions.length]);

  useEffect(() => {
    if (location.state?.retryWrongOnly && wrongQuestions.length > 0) {
      setOpen(false);
      setQuestions(wrongQuestions);
    }
  }, [location.state?.retryWrongOnly, wrongQuestions, setQuestions]);

  useEffect(() => {
    if (isTimeUp && !submitted) {
      handleSubmit();
    }
  }, [isTimeUp, submitted]);

  const isAllAnswered =
    shuffledQuestions.length === Object.keys(currentAnswer).length;

  const handleAnswer = (qIndex, selectedOption) => {
    if (isTimeUp || isSubmitting) return;

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
    if (isSubmitting) return;

    questionRefs.current[index]?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
    setCurrentQuestionIndex(index);
  };

  const handleSubmit = async () => {
    if (submitted || isSubmitting) return;

    const currentTopicId =
      currentTopic?.topic_id || currentTopic?.topic_Id || topicId;

    if (!currentTopicId) {
      console.error("Không tìm thấy topicId");
      return;
    }

    setSubmitted(true);
    setIsSubmitting(true);

    try {
      const { answers } = useTestStore.getState();

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

      const res = await postTestResult(
        axiosPrivate,
        correctCount,
        total,
        topicId
      );
      console.log("Kết quả bài test:", res.result);

      const { markTopicTestCompleted } = useTopicStore.getState();
      markTopicTestCompleted(parseInt(currentTopicId));

      // Signal completion via localStorage
      localStorage.setItem("test_completed", Date.now().toString());
      setTimeout(() => {
        localStorage.removeItem("test_completed");
      }, 1000);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (currentTopicId) {
        navigate(`/vocabulary/topic/${currentTopicId}/TestResult`);
      } else {
        console.error("Không tìm thấy topicId");
        console.error("Available data:", { topicId, currentTopic });
        navigate("/vocabulary");
      }
    } catch (err) {
      console.error("Gửi kết quả thất bại", err);
      setIsSubmitting(false);
      setSubmitted(false);

      alert("Có lỗi xảy ra khi gửi kết quả. Vui lòng thử lại!");
    }
  };

  const handleCheckBeforeSubmit = () => {
    if (isTimeUp || isSubmitting) return;

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

  const onClose = () => {
    if (isSubmitting) return; // Prevent closing modal during submission
    setOpen(false);
  };

  // Hiển thị loading skeleton khi đang submit
  if (isSubmitting) {
    return <LoadingSkeleton />;
  }

  // Chờ questions được load từ component cha
  if (!questionsReady || shuffledQuestions.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang chuẩn bị câu hỏi...</p>
        </div>
      </div>
    );
  }

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
              className={`bg-white p-10 rounded-2xl shadow-xl shadow-neutral-300 w-full max-w-4xl mx-auto space-y-6 relative ${
                isTimeUp || isSubmitting ? "opacity-75 pointer-events-none" : ""
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
                <p className="text-2xl font-bold text-gray-800">
                  {q.definition}
                </p>
              </div>

              {/* Các đáp án */}
              <div>
                <p className="text-base text-gray-500 font-medium mb-2">
                  Chọn thuật ngữ đúng:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  {q.options &&
                    q.options.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => handleAnswer(index, opt)}
                        disabled={isTimeUp || isSubmitting}
                        className={`border px-6 py-5 text-lg rounded-xl text-left transition-all duration-200 ${
                          isTimeUp || isSubmitting
                            ? "cursor-not-allowed opacity-50"
                            : ""
                        } ${
                          currentAnswer[index] === opt
                            ? "bg-blue-100 border-blue-500 text-blue-800 font-semibold"
                            : "hover:bg-gray-50 border-gray-200"
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
              {isTimeUp
                ? "Đã hết thời gian!"
                : "Tất cả đã xong! Bạn đã sẵn sàng gửi bài kiểm tra?"}
            </h2>
            <button
              onClick={handleCheckBeforeSubmit}
              disabled={!isAllAnswered || isTimeUp || isSubmitting}
              className={`${
                !isAllAnswered || isTimeUp || isSubmitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-red-700 hover:bg-red-800"
              } text-white font-semibold text-xl px-10 py-4 rounded-full transition-all duration-300 flex items-center justify-center mx-auto min-w-[200px]`}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Đang xử lý...
                </>
              ) : isTimeUp ? (
                "Đang tự động nộp bài..."
              ) : (
                "Gửi bài kiểm tra"
              )}
            </button>
          </div>
        )}
      </div>

      {/* Modal cảnh báo câu hỏi chưa trả lời */}
      {isOpen && !isSubmitting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md mx-4">
            <div className="text-center">
              <div className="text-4xl mb-4">⚠️</div>
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Còn câu hỏi chưa trả lời
              </h2>
              <p className="text-gray-600 mb-6">
                Bạn có chưa trả lời một số câu hỏi. Bạn có muốn tiếp tục nộp bài
                không? Bạn có chưa trả lời một số câu hỏi. Bạn có muốn tiếp tục
                nộp bài không?
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={onClose}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
                >
                  Hủy
                </button>
                <button
                  onClick={handleSubmit}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                >
                  Nộp bài
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestPage;
