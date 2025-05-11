import { useNavigate } from "react-router-dom";

export const CompletedState = ({ flashcardId, onReset }) =>{
    const navigate = useNavigate();
    
    return (
    <div className="flex flex-col items-center justify-center w-full h-64">
      <h2 className="text-3xl font-bold text-green-600 mb-4">
        🎉 Chúc mừng!
      </h2>
      <p className="text-xl mb-6">
        Bạn đã hoàn thành tất cả các từ trong bộ thẻ này.
      </p>
      <div className="flex gap-4">
        <button
          className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
          onClick={() => navigate(`/flashcard/${flashcardId}`)}
        >
          Quay lại bộ thẻ
        </button>
        {onReset && (
          <button
            className="px-6 py-2 bg-gray-100 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-200 transition"
            onClick={onReset}
          >
            Học lại từ đầu
          </button>
        )}
      </div>
    </div>
  );
};