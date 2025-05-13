import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useVocabularyStore from "@/store/useVocabularyStore";
import { IoBookOutline, IoBookmarkOutline, IoBookmark } from "react-icons/io5";
import { BsCheck2Circle } from "react-icons/bs";
import { TbCards } from "react-icons/tb";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";

const VocabularyDetail = () => {
  const {
    selectedWord,
    vocabularySets,
    setSelectedWord,
    searchTerm,
  } = useVocabularyStore();
  
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showAddedToast, setShowAddedToast] = useState(false);
  const [addToFlashcardLoading, setAddToFlashcardLoading] = useState(false);
  const axios = useAxiosPrivate();

  useEffect(() => {
    // Reset states when word changes
    setIsBookmarked(false);
  }, [selectedWord]);

  // Safety check - if no word is selected, don't render
  if (!selectedWord) {
    return null;
  }

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    // TODO: Gọi API để lưu/xóa bookmark
  };

  const handleAddToFlashcard = async () => {
    setAddToFlashcardLoading(true);
    // Giả lập API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setAddToFlashcardLoading(false);
    setShowAddedToast(true);
    setTimeout(() => setShowAddedToast(false), 2000);
  };

  // Helper function to render word details
  const renderWord = () => (
    <>
      <h2 className="text-3xl font-bold text-gray-900 mb-2">{selectedWord.word}</h2>
      <p className="text-gray-500 mt-1">{selectedWord.pronunciation}</p>
    </>
  );

  // Helper function to render examples
  const renderExample = () => {
    const { example, example_meaning } = selectedWord;
    
    if (!example || !example_meaning) return null;

    const examples = example.split("||");
    const meanings = example_meaning.split("||");

    return examples.map((ex, index) => (
      <motion.div
        key={index}
        whileHover={{ scale: 1.01 }}
        className="bg-gradient-to-r from-gray-50 to-indigo-50 rounded-lg p-4 border border-indigo-100 shadow-sm"
      >
        <div className="space-y-2">
          <p className="text-gray-900 font-medium">{ex.trim()}</p>
          <p className="text-gray-600 text-sm">{meanings[index]?.trim()}</p>
        </div>
      </motion.div>
    ));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-1 md:grid-cols-3 gap-6 relative"
    >
      {/* Toast notification */}
      <AnimatePresence>
        {showAddedToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 right-4 bg-green-50 text-green-700 px-4 py-3 rounded-lg shadow-lg border border-green-100 flex items-center gap-2"
          >
            <BsCheck2Circle className="w-5 h-5" />
            Đã thêm vào flashcard
          </motion.div>
        )}
      </AnimatePresence>

      {/* Danh sách từ liên quan - Cột trái */}
      <div className="md:col-span-1">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-indigo-800">
            <IoBookOutline className="w-5 h-5" />
            Kết quả tra cứu {searchTerm}
          </h3>
          <div className="space-y-3">
            {vocabularySets.map((word) => (
              <motion.div
                key={word.vocab_id}
                whileHover={{ x: 5 }}
                onClick={() => setSelectedWord(word)}
                className={`p-3 rounded-md hover:bg-indigo-50 cursor-pointer border transition-all duration-200 ${
                  selectedWord.vocab_id === word.vocab_id
                    ? "border-indigo-200 bg-indigo-50"
                    : "border-transparent hover:border-indigo-100"
                }`}
              >
                <h4 className="font-medium text-gray-900">{word.word}</h4>
                <p className="text-sm text-gray-600 mt-1">{word.meaning}</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {word.pronunciation}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Chi tiết từ vựng - Cột phải */}
      <div className="md:col-span-2">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 relative">
          {/* Header với các action buttons */}
          <div className="absolute right-4 top-4 flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleBookmark}
              className={`p-2 rounded-full transition-colors duration-200 ${
                isBookmarked
                  ? "bg-yellow-50 text-yellow-500"
                  : "hover:bg-gray-100 text-gray-400"
              }`}
            >
              {isBookmarked ? (
                <IoBookmark className="w-6 h-6" />
              ) : (
                <IoBookmarkOutline className="w-6 h-6" />
              )}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddToFlashcard}
              disabled={addToFlashcardLoading}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors duration-200 disabled:opacity-50"
            >
              {addToFlashcardLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
              ) : (
                <>
                  <TbCards className="w-5 h-5" />
                  Thêm vào Flashcard
                </>
              )}
            </motion.button>
          </div>

          {/* Nội dung chính */}
          <div className="mb-8 pt-2">
            <div className="flex items-start gap-4">
              <div>{renderWord()}</div>
              {selectedWord.level && (
                <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium self-start">
                  {selectedWord.level}
                </span>
              )}
              {selectedWord.ai_suggested && (
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium self-start">
                  AI Suggested
                </span>
              )}
            </div>
          </div>

          {/* Nghĩa */}
          <div className="mb-6 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-3 text-indigo-800 flex items-center gap-2">
              Nghĩa
            </h3>
            <ul className="list-disc list-inside space-y-2">
              <li className="text-gray-700">{selectedWord.meaning}</li>
            </ul>
          </div>

          {/* Cách dùng */}
          {selectedWord.usage && (
            <div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-3 text-indigo-800">
                Cách dùng
              </h3>
              <ul className="list-disc list-inside space-y-2">
                <li className="text-gray-700">{selectedWord.usage}</li>
              </ul>
            </div>
          )}

          {/* Ví dụ */}
          {selectedWord.example && (
            <div>
              <h3 className="text-lg font-semibold mb-3 text-indigo-800">
                Ví dụ
              </h3>
              <div className="space-y-4">
                {renderExample()}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default VocabularyDetail;