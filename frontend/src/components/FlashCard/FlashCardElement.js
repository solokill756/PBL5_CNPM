import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { useFlashcardStore } from "@/store/useflashcardStore";
import React, { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import { MdLightbulbOutline } from "react-icons/md";

const FlashcardElement = ({ text, onClick, star, flashcardId, isJapanese = false }) => {
  const [showHint, setShowHint] = useState(false);
  const axiosPrivate = useAxiosPrivate();
  const {
    fetchAIExplain,
    aiExplainCache,
    aiExplainLoading,
    aiExplainError
  } = useFlashcardStore();

  const handleHintClick = async (e) => {
    e.stopPropagation();
    if (!showHint && isJapanese) {
      try {
        await fetchAIExplain(axiosPrivate, flashcardId);
      } catch (error) {
        console.error("Failed to fetch AI explain:", error);
      }
    }
    setShowHint(!showHint);
  };

  const hintContent = aiExplainCache[flashcardId];
  console.log('Cache content:', hintContent);
  console.log('Loading state:', aiExplainLoading[flashcardId]);
  console.log('Error state:', aiExplainError[flashcardId]);

  return (
    <div className="relative h-full w-full flex flex-col justify-center">
      <div className="flex-1 flex items-center justify-center">
        <span className="text-2xl font-medium text-center break-words max-w-full">
          {text}
        </span>
      </div>

      <div className="absolute z-10 top-7 right-7 flex gap-2">
        {isJapanese && (
          <button
            onClick={handleHintClick}
            className="flex items-center p-2 rounded-full hover:bg-zinc-100 text-gray-600"
            disabled={aiExplainLoading[flashcardId]}
          >
            <MdLightbulbOutline 
              className={`size-4 ${
                aiExplainLoading[flashcardId] 
                  ? 'animate-blink text-yellow-400' 
                  : 'text-gray-600'
              }`} 
            />
          </button>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
          className="flex items-center p-2 rounded-full hover:bg-zinc-100 text-white"
        >
          <FaStar
            className={`size-3.5 ${star ? "text-yellow-400" : "text-gray-400"}`}
          />
        </button>
      </div>

      {/* Hint Popup */}
      {showHint && isJapanese && (
        <div 
          onClick={(e) => e.stopPropagation()} 
          className="absolute top-16 right-0 w-full bg-white rounded-lg shadow-lg p-4 max-w-[300px] z-20"
        >
          {aiExplainLoading[flashcardId] ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-sm text-gray-600">Đang tải gợi ý...</span>
            </div>
          ) : aiExplainError[flashcardId] ? (
            <div className="text-sm text-red-500">
              Không thể tải gợi ý. Vui lòng thử lại sau.
            </div>
          ) : (
            <div className="space-y-2">
              <div className="text-base font-semibold">
                <span className="text-gray-700">Phát âm:</span>
                <p className="text-sm text-gray-600">{hintContent.pronunciation}</p>
              </div>
              <div className="text-base font-semibold">
                <span className="text-gray-700">Cách dùng:</span>
                <p className="text-sm text-gray-600">{hintContent.usage}</p>
              </div>
              <div className="text-base font-semibold">
                <span className="text-gray-700">Ví dụ:</span>
                <p className="text-sm text-gray-600">{hintContent.example}</p>
              </div>
            </div>
          )}
          <div className="absolute -top-2 right-4 w-4 h-4 bg-white transform rotate-45"></div>
        </div>
      )}
    </div>
  );
};

export default FlashcardElement;
