import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import DefaultHeader from "@/layouts/DefaultHeader";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { useToast, TOAST_TYPES } from "@/context/ToastContext";
import {
  IoBookmarkOutline,
  IoBookmark,
  IoArrowBack,
  IoSchool,
} from "react-icons/io5";
import { TbCards } from "react-icons/tb";

// Mock data - thay thế bằng API call sau này
const mockVocabularies = [
  {
    vocab_id: 1,
    word: "仕事",
    pronunciation: "しごと",
    meaning: "Công việc",
    usage: "Danh từ chỉ công việc, nghề nghiệp",
    example: "私は毎日仕事に行きます。||仕事が忙しいです。",
    example_meaning: "Tôi đi làm mỗi ngày.||Công việc rất bận rộn.",
    level: "N5",
    isBookmarked: false,
  },
  {
    vocab_id: 2,
    word: "勉強",
    pronunciation: "べんきょう",
    meaning: "Học tập",
    usage: "Danh từ và động từ chỉ việc học",
    example: "日本語を勉強しています。||勉強が好きです。",
    example_meaning: "Tôi đang học tiếng Nhật.||Tôi thích học tập.",
    level: "N5",
    isBookmarked: true,
  },
  {
    vocab_id: 3,
    word: "プログラミング",
    pronunciation: "ぷろぐらみんぐ",
    meaning: "Lập trình",
    usage: "Danh từ chỉ việc lập trình",
    example: "プログラミングを学んでいます。||プログラミングは難しいです。",
    example_meaning: "Tôi đang học lập trình.||Lập trình thì khó.",
    level: "N3",
    isBookmarked: false,
  },
  {
    vocab_id: 4,
    word: "アプリ",
    pronunciation: "あぷり",
    meaning: "Ứng dụng",
    usage: "Danh từ, viết tắt của アプリケーション",
    example: "新しいアプリをダウンロードしました。||このアプリは便利です。",
    example_meaning: "Tôi đã tải một ứng dụng mới.||Ứng dụng này rất tiện lợi.",
    level: "N3",
    isBookmarked: false,
  },
  {
    vocab_id: 5,
    word: "データベース",
    pronunciation: "でーたべーす",
    meaning: "Cơ sở dữ liệu",
    usage: "Danh từ chỉ cơ sở dữ liệu trong công nghệ thông tin",
    example:
      "データベースを構築しています。||データベースからデータを取得します。",
    example_meaning:
      "Tôi đang xây dựng cơ sở dữ liệu.||Lấy dữ liệu từ cơ sở dữ liệu.",
    level: "N2",
    isBookmarked: false,
  },
];

// Mock topic data
const mockTopic = {
  topic_id: 1,
  name: "Công nghệ thông tin",
  description: "Từ vựng liên quan đến CNTT và lập trình",
  image_url: "https://placehold.co/64x64/indigo/white/png?text=IT",
};

const VocabularyItem = ({
  vocabulary,
  isSelected,
  onClick,
  onToggleBookmark,
  index,
  total,
}) => {
  const { word, pronunciation, meaning, level, isBookmarked } = vocabulary;

  return (
    <motion.div
      whileHover={{ x: 5 }}
      onClick={onClick}
      className={`p-4 border rounded-lg mb-3 cursor-pointer transition-all ${
        isSelected
          ? "border-indigo-300 bg-indigo-50"
          : "border-gray-200 hover:border-indigo-200"
      }`}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-gray-900">{word}</h3>
            {isSelected && (
              <span className="text-xs text-gray-500 font-medium">
                {index + 1}/{total}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500">{pronunciation}</p>
          <p className="text-gray-700 mt-1">{meaning}</p>
        </div>
        <div className="flex items-center gap-3 ml-2">
          {level && (
            <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium">
              {level}
            </span>
          )}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              onToggleBookmark(vocabulary.vocab_id);
            }}
            className={`p-1.5 rounded-full transition-colors ${
              isBookmarked
                ? "bg-yellow-50 text-yellow-500"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            {isBookmarked ? (
              <IoBookmark className="w-5 h-5" />
            ) : (
              <IoBookmarkOutline className="w-5 h-5" />
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

const VocabularyDetail = ({ vocabulary, index, total }) => {
  if (!vocabulary) return null;

  const { word, pronunciation, meaning, usage, example, example_meaning } =
    vocabulary;

  // Xử lý ví dụ và nghĩa của ví dụ
  const examples = example ? example.split("||") : [];
  const meanings = example_meaning ? example_meaning.split("||") : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
    >
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-2xl font-bold text-gray-900">{word}</h2>
        <span className="text-sm text-gray-500 font-medium">
          {index + 1}/{total}
        </span>
      </div>
      <p className="text-gray-500 mb-4">{pronunciation}</p>

      {/* Nghĩa */}
      <motion.div whileHover={{ scale: 1.01 }} className="mb-6">
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-3 text-indigo-800">Nghĩa</h3>
          <p className="text-gray-700">{meaning}</p>
        </div>
      </motion.div>

      {/* Cách dùng */}
      {usage && (
        <motion.div whileHover={{ scale: 1.01 }} className="mb-6">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-3 text-indigo-800">
              Cách dùng
            </h3>
            <p className="text-gray-700">{usage}</p>
          </div>
        </motion.div>
      )}

      {/* Ví dụ */}
      {examples.length > 0 && (
        <motion.div whileHover={{ scale: 1.01 }}>
          <div className="bg-red-50 rounded-lg p-4 shadow-sm">
            <h3 className="text-lg font-semibold mb-3 text-indigo-800">
              Ví dụ
            </h3>
            {examples.map((ex, index) => (
              <div key={index} className="mb-4">
                <div className="rounded-lg">
                  <ul className="list-disc list-inside space-y-1.5">
                    <li className="text-gray-700">{ex.trim()}</li>
                    <p className="text-gray-600 text-sm ml-6">
                      {meanings[index]?.trim()}
                    </p>
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

const TopicDetail = () => {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const axios = useAxiosPrivate();
  const { addToast } = useToast();

  const [topic, setTopic] = useState(null);
  const [vocabularies, setVocabularies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVocabulary, setSelectedVocabulary] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showFlashcardConfirm, setShowFlashcardConfirm] = useState(false);

  useEffect(() => {
    const fetchTopicData = async () => {
      try {
        setLoading(true);
        // Trong thực tế, bạn sẽ gọi API ở đây
        // const response = await axios.get(`/api/vocabulary/topic/${topicId}`);
        // setTopic(response.data.topic);
        // setVocabularies(response.data.vocabularies);

        // Sử dụng mock data tạm thời
        setTimeout(() => {
          setTopic(mockTopic);
          setVocabularies(mockVocabularies);
          setLoading(false);
          // Mặc định chọn từ vựng đầu tiên
          if (mockVocabularies.length > 0) {
            setSelectedVocabulary(mockVocabularies[0]);
            setSelectedIndex(0);
          }
        }, 500);
      } catch (error) {
        console.error("Error fetching topic data:", error);
        addToast("Không thể tải dữ liệu chủ đề", TOAST_TYPES.ERROR);
        setLoading(false);
      }
    };

    fetchTopicData();
  }, [topicId]);

  const handleSelectVocabulary = (vocab, index) => {
    setSelectedVocabulary(vocab);
    setSelectedIndex(index);
  };

  const handleToggleBookmark = (vocabId) => {
    setVocabularies((prev) =>
      prev.map((vocab) =>
        vocab.vocab_id === vocabId
          ? { ...vocab, isBookmarked: !vocab.isBookmarked }
          : vocab
      )
    );

    const vocab = vocabularies.find((v) => v.vocab_id === vocabId);
    if (vocab) {
      addToast(
        vocab.isBookmarked
          ? `Đã xóa "${vocab.word}" khỏi bookmark`
          : `Đã thêm "${vocab.word}" vào bookmark`,
        TOAST_TYPES.SUCCESS
      );
    }
  };

  const handleCreateFlashcards = () => {
    // Trong thực tế, bạn sẽ lưu trạng thái này vào store và chuyển hướng
    addToast("Đã tạo bộ flashcard thành công", TOAST_TYPES.SUCCESS);
    // navigate(`/flashcards/${topicId}`);
    setShowFlashcardConfirm(false);
  };

  if (loading) {
    return (
      <main className="flex flex-col items-center flex-grow">
        <DefaultHeader />
        <div className="w-full max-w-6xl px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-col items-center flex-grow">
      <DefaultHeader />

      <div className="w-full max-w-full px-12 py-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/vocabulary")}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <IoArrowBack className="w-5 h-5 text-gray-700" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg overflow-hidden border border-gray-200">
                <img
                  src={topic?.image_url}
                  alt={topic?.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src =
                      "https://placehold.co/64x64/indigo/white/png?text=IT";
                  }}
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {topic?.name}
                </h1>
                <p className="text-gray-600">{topic?.description}</p>
              </div>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowFlashcardConfirm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors"
          >
            <TbCards className="w-5 h-5" />
            Tạo Flashcard
          </motion.button>
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Vocabulary list */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <div className="bg-white rounded-lg h-full shadow-sm border border-gray-200 p-4 sticky top-4">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-indigo-800">
                <IoSchool className="w-5 h-5" />
                Danh sách từ vựng ({vocabularies.length})
              </h2>
              <div className="space-y-3 overflow-y-auto overflow-x-hidden h-full max-h-[calc(100vh-170px)] pr-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                <AnimatePresence>
                  {vocabularies.map((vocab, index) => (
                    <VocabularyItem
                      key={vocab.vocab_id}
                      vocabulary={vocab}
                      isSelected={
                        selectedVocabulary?.vocab_id === vocab.vocab_id
                      }
                      onClick={() => handleSelectVocabulary(vocab, index)}
                      onToggleBookmark={handleToggleBookmark}
                      index={index}
                      total={vocabularies.length}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Vocabulary detail */}
          <div className="lg:col-span-2 order-1 lg:order-2">
            {selectedVocabulary ? (
              <VocabularyDetail
                vocabulary={selectedVocabulary}
                index={selectedIndex}
                total={vocabularies.length}
              />
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col items-center justify-center h-64">
                <TbCards className="w-16 h-16 text-gray-300 mb-4" />
                <p className="text-gray-500 text-center">
                  Chọn một từ vựng từ danh sách để xem chi tiết
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Flashcard confirmation modal */}
      <AnimatePresence>
        {showFlashcardConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full"
            >
              <h3 className="text-xl font-bold mb-4">Tạo bộ Flashcard</h3>
              <p className="text-gray-700 mb-6">
                Bạn có muốn tạo bộ flashcard từ {vocabularies.length} từ vựng
                trong chủ đề "{topic?.name}" không?
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowFlashcardConfirm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={handleCreateFlashcards}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                >
                  Tạo Flashcard
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
};

export default TopicDetail;
