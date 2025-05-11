import React, { useEffect } from "react";
import { useQuizStore } from "@/store/useQuizStore";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

const Result = () => {
  const navigate = useNavigate();
  const { result, questions } = useQuizStore();
  const { id: flashcardId } = useParams();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const handleNewQuiz = () => {
  navigate(`/flashcard/${flashcardId}/quiz`);
};

  if (!result || questions.length === 0) {
    return (
      <div className="text-center py-20 text-xl text-gray-700">
        Không tìm thấy kết quả. Vui lòng làm bài kiểm tra trước.
      </div>
    );
  }

  const total = questions.length;
  const score = result.score;
  const correct = Math.round((score / 100) * total);
  const wrong = total - correct;

  const handleReview = () => {
    navigate(`/flashcard/${flashcardId}/testAgain`, {
      state: { retryWrongOnly: true },
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
        {score === 100 ? "Tuyệt vời! Bạn đã hoàn thành hoàn hảo!" : "Hãy cố gắng nhé!"}
      </h1>

      <div className="flex flex-col md:flex-row justify-between items-center bg-white p-8 rounded-2xl shadow-xl gap-6">
        {/* Score chart */}
        <div className="flex flex-col items-center">
          <div className="relative w-32 h-32">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r="54"
                stroke="#EF4444"  
                strokeWidth="12"
                fill="none"
              />
              <circle
                cx="60"
                cy="60"
                r="54"
                stroke="#10B981" 
                strokeWidth="12"
                fill="none"
                strokeDasharray={2 * Math.PI * 54}
                strokeDashoffset={(1 - score / 100) * 2 * Math.PI * 54}
                strokeLinecap="round"
                style={{ transition: "stroke-dashoffset 0.5s ease-in-out" }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-xl font-bold text-gray-700">
              {score}%
            </div>
          </div>

          <div className="mt-4">
            <p className="text-green-600 font-semibold">Đúng: {correct}</p>
            <p className="text-red-600 font-semibold">Sai: {wrong}</p>
          </div>
        </div>

        {/* Next steps */}
        <div className="flex flex-col gap-4 w-full max-w-md">
          {score === 100 ? (
            <div
              onClick={handleNewQuiz}
              className="flex items-center justify-between border border-blue-100 rounded-xl p-4 cursor-pointer hover:bg-blue-50 transition-all"
            >
              <div>
                <h3 className="text-red-700 font-semibold text-lg">Làm bài kiểm tra mới</h3>
                <p className="text-gray-600 text-sm">Hãy thử một bài kiểm tra khác để tăng sự tự tin của bạn.</p>
              </div>
              <span className="text-red-700 text-xl">›</span>
            </div>
          ) : (
            <div
              onClick={handleReview}
              className="flex items-center justify-between border border-blue-100 rounded-xl p-4 cursor-pointer hover:bg-blue-50 transition-all"
            >
              <div>
                <h3 className="text-red-700 font-semibold text-lg">Hỏi lại các thuật ngữ sai</h3>
                <p className="text-gray-600 text-sm">Tự kiểm tra lại những thuật ngữ bạn nhớ sai.</p>
              </div>
              <span className="text-red-700 text-xl">›</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Result;