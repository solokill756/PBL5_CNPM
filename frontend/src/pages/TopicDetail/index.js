import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import DefaultHeader from "@/layouts/DefaultHeader";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { useToast, TOAST_TYPES } from "@/context/ToastContext";

import { TbCards } from "react-icons/tb";
import useLevelStore from "@/store/useLevelStore";
import TopicHeader from "@/components/Topic/TopicHeader";
import VocabularyList from "@/components/Topic/VocabularyList";
import LevelUpModal from "@/components/Modal/LevelUpModal";
import FlashcardModal from "@/components/Modal/FlashcardModal";
import VocabularyDetail from "@/components/Topic/VocabularyDetail";
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

const TopicDetail = () => {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const axios = useAxiosPrivate();
  const { addToast } = useToast();

  const { addPoints, completeTopicProgress } = useLevelStore();

  const [topic, setTopic] = useState(null);
  const [topicProgress, setTopicProgress] = useState(0);
  const [showLevelUpModal, setShowLevelUpModal] = useState(false);
  const [levelUpResults, setLevelUpResults] = useState(null);
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
          // Thêm trường isKnown vào mỗi từ vựng
          const vocabulariesWithLearningStatus = mockVocabularies.map(
            (vocab) => ({
              ...vocab,
              isKnown: false, // Mặc định là chưa học
            })
          );

          setTopic(mockTopic);
          setVocabularies(vocabulariesWithLearningStatus);
          setLoading(false);

          // Mặc định chọn từ vựng đầu tiên
          if (vocabulariesWithLearningStatus.length > 0) {
            setSelectedVocabulary(vocabulariesWithLearningStatus[0]);
            setSelectedIndex(0);
          }

          // Tính toán tiến độ ban đầu
          calculateProgress(vocabulariesWithLearningStatus);
        }, 500);
      } catch (error) {
        console.error("Error fetching topic data:", error);
        addToast("Không thể tải dữ liệu chủ đề", TOAST_TYPES.ERROR);
        setLoading(false);
      }
    };

    fetchTopicData();
  }, [topicId]);

  // Hàm tính toán tiến độ học tập
  const calculateProgress = (vocabs) => {
    if (!vocabs || vocabs.length === 0) return;

    const masteredCount = vocabs.filter((v) => v.isKnown).length;
    const progressPercent = Math.round((masteredCount / vocabs.length) * 100);
    setTopicProgress(progressPercent);
  };

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

  const handleWordLearned = (vocabId) => {
    // Đánh dấu từ vựng là đã học
    const updatedVocabularies = vocabularies.map((vocab) =>
      vocab.vocab_id === vocabId ? { ...vocab, isKnown: true } : vocab
    );

    setVocabularies(updatedVocabularies);

    // Cập nhật từ vựng đang được chọn (nếu có)
    if (selectedVocabulary && selectedVocabulary.vocab_id === vocabId) {
      setSelectedVocabulary({ ...selectedVocabulary, isKnown: true });
    }

    // Tính toán lại tiến độ
    calculateProgress(updatedVocabularies);

    // Thêm điểm cho việc học từ mới
    addPoints(5);

    // Hiển thị thông báo
    addToast(
      `Đã đánh dấu "${
        vocabularies.find((v) => v.vocab_id === vocabId)?.word
      }" là đã học`,
      TOAST_TYPES.SUCCESS
    );

    // Kiểm tra xem đã hoàn thành chủ đề chưa
    const masteredCount = updatedVocabularies.filter((v) => v.isKnown).length;
    const progressPercent = Math.round(
      (masteredCount / updatedVocabularies.length) * 100
    );

    if (progressPercent === 100) {
      const result = completeTopicProgress(topicId, 100);

      if (result.leveledUp) {
        setLevelUpResults(result);
        setShowLevelUpModal(true);
      }
    }
  };

  if (loading) {
    return (
      <main className="flex flex-col items-center flex-grow">
        {/* <DefaultHeader /> */}
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
      {/* <DefaultHeader /> */}

      <div className="w-full max-w-full px-12 py-4">
        {/* Header - modify to include progress */}
        <TopicHeader
          topic={topic}
          onBack={() => navigate("/vocabulary")}
          onCreateFlashcard={() => setShowFlashcardConfirm(true)}
          topicProgress={topicProgress}
          learnedCount={vocabularies.filter((v) => v.isKnown).length}
          totalCount={vocabularies.length}
        />

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Vocabulary list */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <VocabularyList
              vocabularies={vocabularies}
              selectedVocabulary={selectedVocabulary}
              onSelectVocabulary={handleSelectVocabulary}
              onToggleBookmark={handleToggleBookmark}
              onMarkLearned={handleWordLearned}
            />
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
        {/* Level up modal */}
        {showLevelUpModal && (
          <LevelUpModal
            levelUpResults={levelUpResults}
            onClose={() => setShowLevelUpModal(false)}
          />
        )}

        {/* Flashcard confirmation modal */}
        <FlashcardModal
          isOpen={showFlashcardConfirm}
          onClose={() => setShowFlashcardConfirm(false)}
          onConfirm={handleCreateFlashcards}
          topicName={topic?.name}
          vocabulariesCount={vocabularies.length}
        />
      </AnimatePresence>
    </main>
  );
};

export default TopicDetail;
