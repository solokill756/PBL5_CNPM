import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useVocabularyStore from "@/store/useVocabularyStore";
import { IoBookOutline, IoBookmarkOutline, IoBookmark } from "react-icons/io5";
import { BsCheck2Circle } from "react-icons/bs";
import { TbCards } from "react-icons/tb";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { IoWarningOutline } from "react-icons/io5";
import { FiSend } from "react-icons/fi";
import { useToast, TOAST_TYPES } from "@/context/ToastContext";

const VocabularyDetail = () => {
  const { selectedWord, vocabularySets, setSelectedWord, searchTerm, requestNewVocabulary } =
    useVocabularyStore();

    const [isBookmarked, setIsBookmarked] = useState(false);
    const [showAddedToast, setShowAddedToast] = useState(false);
    // const [showRequestToast, setShowRequestToast] = useState(false);
    const [addToFlashcardLoading, setAddToFlashcardLoading] = useState(false);
    const [requestLoading, setRequestLoading] = useState(false);
    const axios = useAxiosPrivate();
    const { addToast } = useToast();

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

  const handleRequestAddVocabulary = async () => {
    try {
      setRequestLoading(true);
      // setShowRequestToast(true);
      const newVocabulary = await requestNewVocabulary(axios, selectedWord);
      if (newVocabulary) {
        addToast("Yêu cầu thêm từ vựng đã được gửi", TOAST_TYPES.SUCCESS);
      }
    } catch (error) {
      console.error("Error requesting new vocabulary:", error);
      addToast("Có lỗi xảy ra khi gửi yêu cầu", TOAST_TYPES.ERROR);
    } finally {
      setRequestLoading(false);
      // setShowRequestToast(false);
    }
  };

  const renderWord = () => {
    // Kiểm tra xem word này có phải từ AI và có displayWord không
    const displayWord = selectedWord.displayWord || selectedWord.word;

    return (
      <>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">{displayWord}</h2>
        <p className="text-gray-500 mt-1">{selectedWord.pronunciation}</p>
      </>
    );
  };

  // Helper function to render examples
  const renderExample = () => {
    const { example, example_meaning } = selectedWord;

    if (!example || !example_meaning) return null;

    const examples = example.split("||");
    const meanings = example_meaning.split("||");

    return (
      <motion.div
        whileHover={{ scale: 1.01 }}
        className="bg-red-50 rounded-lg p-4 shadow-sm"
      >
        <h3 className="text-lg font-semibold mb-3 text-indigo-800 flex items-center gap-2">
          Ví dụ
        </h3>
        {examples.map((ex, index) => (
          <div key={index} className="mb-4">
            <div className="rounded-lg">
              <ul className="list-disc list-inside space-y-1.5">
                <li className="text-gray-700">{ex.trim()}</li>
                <p className="text-gray-600 text-sm ml-6">{meanings[index]?.trim()}</p>
              </ul>
            </div>
          </div>
        ))}
      </motion.div>
    );
  };

  // Render AI disclaimer
  const renderAIDisclaimer = () => {
    if (!selectedWord.ai_suggested) return null;
    
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-6 bg-purple-50 rounded-lg p-4 border border-purple-100 shadow-sm"
      >
        <div className="flex items-start gap-3">
          <IoWarningOutline className="text-purple-600 w-6 h-6 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-lg font-semibold mb-2 text-purple-800">Kết quả từ AI</h3>
            <p className="text-purple-700 text-sm">
              Từ vựng này được tạo bởi AI và có thể chưa hoàn toàn chính xác. Hãy kiểm tra kỹ thông tin trước khi sử dụng.
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleRequestAddVocabulary}
              disabled={requestLoading}
              className="mt-3 flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors duration-200 text-sm disabled:opacity-50"
            >
              {requestLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
              ) : (
                <>
                  <FiSend className="w-4 h-4" />
                  Gửi yêu cầu thêm từ vựng này
                </>
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>
    );
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
          <div className="space-y-3 mb-4">
            {vocabularySets.map((word, index) => (
              <motion.div
                key={index}
                whileHover={{ x: 5 }}
                onClick={() => setSelectedWord(word)}
                className={`p-3 rounded-md hover:bg-indigo-50 cursor-pointer border transition-all duration-200 ${
                  selectedWord.vocab_id === word.vocab_id
                    ? "border-indigo-200 bg-indigo-50"
                    : "border-transparent hover:border-indigo-100"
                }`}
              >
                <h4 className="font-medium text-gray-900">{ word.displayWord || word.word}</h4>
                <p className="text-sm text-gray-600 mt-1">{ word.displayMeaning || word.meaning}</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {word.pronunciation}
                </p>
              </motion.div>
            ))}
          </div>

          {renderAIDisclaimer()}
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
          <motion.div whileHover={{ scale: 1.01 }}>
            <div className="mb-6 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-3 text-indigo-800 flex items-center gap-2">
                Nghĩa
              </h3>
              <ul className="list-disc list-inside space-y-2">
                <li className="text-gray-700">
                  {selectedWord.displayMeaning || selectedWord.meaning}
                </li>
              </ul>
            </div>
          </motion.div>

          {/* Cách dùng */}
          <motion.div whileHover={{ scale: 1.01 }}>
            <div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-3 text-indigo-800">
                Cách dùng
              </h3>
              <ul className="list-disc list-inside space-y-2">
                <li className="text-gray-700">{selectedWord.usage}</li>
              </ul>
            </div>
          </motion.div>

          {/* Ví dụ */}
          {selectedWord.example && <div className="">{renderExample()}</div>}
        </div>
      </div>
    </motion.div>
  );
};

export default VocabularyDetail;
