import React, { useEffect, useState } from "react";
import useVocabularyStore from "@/store/useVocabularyStore";
import { motion, AnimatePresence } from "framer-motion";
import { IoSearchOutline } from "react-icons/io5";
import { RiEmotionSadLine, RiRobot2Line } from "react-icons/ri";
import { BiHistory } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";

const SearchResult = () => {
  const {
    searchResults,
    loading,
    relatedWords,
    fetchAIExplain,
    getHistorySearch,
    addHistorySearch,
    searchTerm,
    updateResults,
    isSearchModalOpen: isOpen,
    setSelectedWord,
    closeSearchModal,
    normalizeVocabularyData,
  } = useVocabularyStore();

  const navigate = useNavigate();
  const axios = useAxiosPrivate();

  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isAILoading, setIsAILoading] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // Reset selectedIndex khi searchResults thay đổi
  useEffect(() => {
    setSelectedIndex(-1);
  }, [searchResults]);

  // Fetch history khi mở modal và không có searchTerm
  useEffect(() => {
    const fetchHistory = async () => {
      if (isOpen && !searchTerm.trim()) {
        setLoadingHistory(true);
        try {
          await getHistorySearch(axios);
        } catch (error) {
          console.error("Error fetching history:", error);
        } finally {
          setLoadingHistory(false);
        }
      }
    };

    fetchHistory();
  }, [isOpen, searchTerm, getHistorySearch, axios]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen || loading || searchResults.length === 0) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev < searchResults.length - 1 ? prev + 1 : prev
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
          break;
        case "Enter":
          e.preventDefault();
          if (selectedIndex >= 0) {
            handleWordSelect(searchResults[selectedIndex]);
          }
          break;
        case "Escape":
          closeSearchModal();
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, loading, searchResults, selectedIndex]);

  const handleWordSelect = async (word) => {
    closeSearchModal();

    const normalizedWord = normalizeVocabularyData(word);
    setSelectedWord(normalizedWord);
    updateResults([normalizedWord]);

    if (word.vocab_id) {
      await addHistorySearch(axios, word.vocab_id);
    }

    navigate(`/vocabulary/${encodeURIComponent(searchTerm)}`, {
      replace: true,
    });
  };

  const handleHistorySelect = (historyItem) => {
    closeSearchModal();
    
    const normalizedWord = normalizeVocabularyData(historyItem.Vocabulary);
    setSelectedWord(normalizedWord);
    updateResults([normalizedWord]);
    
    navigate(`/vocabulary/${encodeURIComponent(normalizedWord.word)}`, { replace: true });
  };

  const handleAISearch = async () => {
    setIsAILoading(true);
    try {
      const aiData = await fetchAIExplain(axios, searchTerm);

      // Update both search results and vocabulary sets
      // updateResults([normalizedAIResult]);
      // setSelectedWord(normalizedAIResult);

      // Navigate to vocabulary detail page
      navigate(`/vocabulary/${encodeURIComponent(searchTerm)}`, {
        replace: true,
      });
    } catch (error) {
      console.error("AI Search Error:", error);
    } finally {
      setIsAILoading(false);
      closeSearchModal();
    }
  };

  if (!isOpen) return null;

  if (!searchTerm.trim()) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="absolute left-0 right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-[400px] overflow-y-auto z-50"
        >
          <div className="py-2 divide-y divide-gray-100">
            {loadingHistory ? (
              <div className="flex items-center justify-center p-4">
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-gray-300 border-t-blue-600"></div>
              </div>
            ) : relatedWords.length === 0 ? (
              <div className="px-4 py-3 text-sm text-gray-500 text-center flex items-center justify-center gap-2">
                <BiHistory className="size-6" />
                Chưa có lịch sử tìm kiếm
              </div>
            ) : (
              relatedWords.slice(0, 10).map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ backgroundColor: "#F9FAFB" }}
                  onClick={() => handleHistorySelect(item)}
                  className="px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors duration-150 flex items-center gap-3"
                >
                  <div className="flex-shrink-0">
                    <BiHistory className="text-gray-400 size-6" />
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-baseline justify-between">
                      <h4 className="text-base font-medium text-gray-900">
                        {item.Vocabulary.word}
                      </h4>
                      <span className="text-sm text-gray-500 font-medium">
                        {item.Vocabulary.pronunciation}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-gray-600 text-sm">
                        {item.Vocabulary.meaning}
                      </p>
                      <span className="text-xs text-gray-400">
                        {new Date(item.searched_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
          {relatedWords.length > 0 && (
            <div className="px-4 py-2 bg-gray-50 text-sm text-gray-500 border-t">
              <p className="text-xs text-gray-400 italic">
                Hiển thị {Math.min(10, relatedWords.length)} kết quả tìm kiếm
                gần đây nhất
              </p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    );
  }

  const renderEmptyState = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center py-8 px-4 text-gray-500"
    >
      <RiEmotionSadLine className="w-12 h-12 mb-2 text-gray-400" />
      <p className="text-center font-medium text-gray-600">
        Không tìm thấy kết quả nào cho "{searchTerm}"
      </p>
      <p className="text-sm mt-1 text-gray-400 mb-6">
        Bạn có thể dùng AI hỗ trợ tìm kiếm từ vựng
      </p>

      <motion.button
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleAISearch}
        disabled={isAILoading}
        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 w-full justify-center disabled:opacity-50"
      >
        {isAILoading ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
            <span>Đang xử lý...</span>
          </>
        ) : (
          <>
            <RiRobot2Line className="w-5 h-5" />
            <span>Dùng AI hỗ trợ tìm kiếm</span>
          </>
        )}
      </motion.button>
    </motion.div>
  );

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
        className="absolute left-0 right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-[400px] overflow-y-auto z-50"
      >
        {loading ? (
          <div className="flex items-center justify-center p-4">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-gray-300 border-t-blue-600"></div>
          </div>
        ) : searchResults.length === 0 ? (
          renderEmptyState()
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-2 divide-y divide-gray-100"
          >
            {searchResults.map((result, index) => (
              <motion.div
                key={result.vocab_id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ backgroundColor: "#F9FAFB" }}
                onClick={() => handleWordSelect(result)}
                className={`px-4 py-3 cursor-pointer transition-colors duration-150 ${
                  index === selectedIndex ? "bg-blue-50" : "hover:bg-gray-50"
                }`}
              >
                <div>
                  <div className="flex items-baseline justify-between">
                    <h4 className="text-base font-medium text-gray-900">
                      {result.word}
                    </h4>
                    <span className="text-sm text-gray-500 font-medium">
                      {result.pronunciation}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mt-1.5">
                    {result.meaning}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {!loading && searchResults.length > 0 && (
          <div className="px-4 py-2 bg-gray-50 text-sm text-gray-500 border-t flex items-center">
            <IoSearchOutline className="w-4 h-4 mr-1" />
            Tìm thấy {searchResults.length} kết quả
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default SearchResult;
