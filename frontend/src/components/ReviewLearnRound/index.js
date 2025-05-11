import React from "react";
import LearnProgressBar from "../LearnProgressBar";

export default function ReviewLearnRound({
  correct,
  total,
  nextReview,
  reviewList,
  onContinue,
  title = "Mạnh mẽ lên, bạn có thể thành công!",
  subtitle = "Thuật ngữ đã học trong vòng này",
  continueLabel = "Tiếp tục học"
}) {
  return (
    <main className="flex flex-col items-center flex-grow scrollbar-hide p-4">
      <h2 className="text-3xl font-bold my-6 text-center text-green-600">{title}</h2>
      
      {/* Progress display */}
      <div className="w-full max-w-[900px]">
        <LearnProgressBar
          correct={correct}
          total={total}
          nextReview={nextReview}
          className="mb-8"
        />
      
        {/* Statistics */}
        <div className="flex justify-center gap-8 mb-8">
          <div className="text-center">
            <div className="text-4xl font-bold text-green-600">{correct}</div>
            <div className="text-sm text-gray-500">Đã biết</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-700">{total - correct}</div>
            <div className="text-sm text-gray-500">Còn lại</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600">{Math.round((correct/total) * 100)}%</div>
            <div className="text-sm text-gray-500">Hoàn thành</div>
          </div>
        </div>
      
        {/* Review list */}
        <div className="w-full text-left mt-8">
          <h3 className="text-lg font-semibold text-gray-600 mb-4">{subtitle}</h3>
          <div className="bg-white rounded-lg shadow p-6">
            <ul className="space-y-3 divide-y divide-gray-100">
              {reviewList.map((card, idx) => (
                <li key={card.flashcard_id} className="pt-3 first:pt-0">
                  <div className="flex flex-col md:flex-row md:items-center gap-2">
                    <span className="font-semibold text-lg text-gray-800">{card.front_text}</span>
                    <span className="hidden md:inline text-gray-400 mx-2">—</span>
                    <span className="text-gray-600">{card.back_text}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      
      {/* Continue button */}
      <button
        className="mt-8 px-8 py-4 rounded-full bg-green-500 hover:bg-green-600 text-white text-xl font-semibold transition shadow-md"
        onClick={onContinue}
      >
        {continueLabel}
      </button>
    </main>
  );
}