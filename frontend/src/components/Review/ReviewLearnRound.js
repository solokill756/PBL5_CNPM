import React from "react";
import LearnProgressBar from "../LearnProgressBar";
import ModeHeader from "../ModeHeader";
import ReviewItem from "./ReviewItem";
import { useNavigate } from "react-router-dom";

export default function ReviewLearnRound({
  correct,
  total,
  nextReview,
  reviewList,
  onContinue,
  flashcardId,
  title = "Mạnh mẽ lên, bạn có thể thành công!",
  subtitle = "Thuật ngữ đã học trong vòng này",
  continueLabel = "Tiếp tục học",
}) {
  const navigate = useNavigate();

  return (
    <main className="flex flex-col items-center flex-grow scrollbar-hide">
      <div className="flex w-full justify-start">
        <ModeHeader
          mode="learn"
          flashcardId={flashcardId}
          onSetting={() => {}}
          onClose={() => {navigate(`/flashcard/${flashcardId}`)}}
        />
      </div>
      <h2 className="text-3xl font-bold my-6 text-center text-green-600">
        {title}
      </h2>

      {/* Progress display */}
      <div className="w-full max-w-[900px]">
        <LearnProgressBar
          correct={correct}
          total={total}
        //   nextReview={nextReview}
          className="mb-8"
        />

        {/* Statistics */}
        <div className="flex justify-center gap-8 mb-8">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{correct}</div>
            <div className="text-sm text-gray-500">Đã biết</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-700">
              {total - correct}
            </div>
            <div className="text-sm text-gray-500">Còn lại</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {Math.round((correct / total) * 100)}%
            </div>
            <div className="text-sm text-gray-500">Hoàn thành</div>
          </div>
        </div>

        {/* Review list */}
        <div className="w-full text-left mt-8">
          <h3 className="text-lg font-semibold text-gray-600 mb-4">
            {subtitle}
          </h3>
          <div className="bg-white rounded-lg">
            <ul className="space-y-3">
              {reviewList.map((card, idx) => (
                <ReviewItem
                  index={`${card.stt || idx + 1}. `}
                  key={card.flashcard_id}
                  frontText={card.front_text}
                  backText={card.back_text}
                />
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Continue button */}
      <button
        className="mt-8 px-5 py-3 rounded-full bg-sky-600 hover:bg-sky-800 text-white text-base font-semibold transition shadow-md"
        onClick={onContinue}
      >
        {continueLabel}
      </button>
    </main>
  );
}
