// frontend/src/components/State/CompletedState.js
import { useNavigate } from "react-router-dom";
import ModeHeader from "../ModeHeader";

export const CompletedState = ({ flashcardId, loading = false, onReset, onTest }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-[60vh]">
      {/* Icon cúp */}
      <div className="flex w-full justify-start">
        <ModeHeader
          mode="learn"
          flashcardId={flashcardId}
          onSetting={() => {}}
          onClose={() => {navigate(`/flashcard/${flashcardId}`)}}
        />
      </div>
      <div className="my-6 min-h-64 flex items-center justify-center">
        <img src="https://assets.quizlet.com/_next/static/media/Quizlet_Trophy@2x.7ef119b6.png" alt="cup" className="size-28"/>
      </div>
      {/* Chúc mừng */}
      <h4 className="text-3xl md:text-3xl font-extrabold text-gray-800 mb-2 text-center">
        Chúc mừng! Bạn đã học tất cả các thuật ngữ.
      </h4>
      <span className="text-sm md:text-lg w-full text-gray-500 mb-12 text-center max-w-xl">
        Hãy thử một vòng nữa để bạn có thể luyện tập thêm với những câu hỏi khó hơn.
      </span>
      <div className="flex flex-col md:flex-row gap-4">
        <button
          className="px-8 py-3 border-2 border-blue-500 text-blue-600 bg-white rounded-full font-semibold text-base hover:bg-blue-50 transition"
          onClick={onTest}
        >
          Làm bài kiểm tra
        </button>
        <button
          className="px-8 py-3 bg-blue-600 text-white rounded-full font-semibold text-base hover:bg-blue-700 transition"
          onClick={onReset}
        >
          {loading ? <div className="flex items-center justify-center">
            <div className="w-4 h-4 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
          </div> : "Tiếp tục ôn luyện"}
        </button>
      </div>
    </div>
  );
};