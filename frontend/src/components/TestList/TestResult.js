import React, { useEffect } from "react";
import { useTestStore } from "@/store/useTestStore";

const Result = () => {
  const { result, questions } = useTestStore();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
  const passed = correct > total / 2;

  return (
    <div className="max-w-4xl mx-auto px-6 py-16 mt-4">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
        {score === 100 ? "Tuyệt vời! Bạn đã hoàn thành hoàn hảo!" : "Kết quả bài kiểm tra"}
      </h1>

      <div className="flex flex-col items-center bg-white p-8 rounded-2xl shadow-xl">
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

          <div className="mt-6 text-center">
            <p className="text-green-600 font-semibold text-lg">
              Đúng: {correct}/{total}
            </p>
            <p className="text-red-600 font-semibold text-lg">
              Sai: {wrong}/{total}
            </p>
          </div>

          {passed && (
            <div className="mt-6 text-blue-600 font-semibold text-lg text-center">
              Chúc mừng bạn đã vượt qua bài kiểm tra!
            </div>
          )}
          {!passed && (
            <div className="mt-6 text-red-600 font-semibold text-lg text-center">
              Rất tiếc, bạn chưa vượt qua bài kiểm tra. Hãy thử lại!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Result;
