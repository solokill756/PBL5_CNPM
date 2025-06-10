import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { useToast, TOAST_TYPES } from "@/context/ToastContext";

import { TbCards } from "react-icons/tb";
import TopicHeader from "@/components/Topic/TopicHeader";
import VocabularyList from "@/components/Topic/VocabularyList";
import LevelUpModal from "@/components/Modal/LevelUpModal";
import FlashcardModal from "@/components/Modal/FlashcardModal";
import VocabularyDetail from "@/components/Topic/VocabularyDetail";
import useTopicStore from "@/store/useTopicStore";
import TopicCompletedModal from "@/components/Modal/TopicCompletedModal";

const TopicDetail = () => {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const axios = useAxiosPrivate();
  const { addToast } = useToast();

  const {
    fetchVocabularyByTopic,
    toggleBookmark,
    updateLearningStatus,
    currentTopic,
    topicVocabularies,
    loadingStates,
    refreshUserLevel,
    userLevel,
    hasTopicTestCompleted,
    initializeUserData,
    getNextLevelRewards,
  } = useTopicStore();

  const [selectedVocabulary, setSelectedVocabulary] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showLevelUpModal, setShowLevelUpModal] = useState(false);
  const [levelUpResults, setLevelUpResults] = useState(null);
  const [showFlashcardModal, setShowFlashcardModal] = useState(false);
  const [showTopicCompletedModal, setShowTopicCompletedModal] = useState(false);
  const [topicCompletedResults, setTopicCompletedResults] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Tracking refs
  const previousLearnedCount = useRef(null);
  const topicInitialized = useRef(false);
  const currentTopicIdRef = useRef(null);
  const initializationRef = useRef(false);

  const isLoading = loadingStates.topicVocabularies || 
                   loadingStates.initializing ||
                   (!userLevel.user_id && loadingStates.userLevel);

  // Reset tracking khi topic thay đổi
  useEffect(() => {
    if (currentTopicIdRef.current !== topicId) {
      previousLearnedCount.current = null;
      topicInitialized.current = false;
      currentTopicIdRef.current = topicId;
      setIsInitialized(false);
      initializationRef.current = false;
    }
  }, [topicId]);

  // Parallel initialization
  useEffect(() => {
    if (initializationRef.current) return;

    const initialize = async () => {
      try {
        initializationRef.current = true;
        
        // Parallel tasks
        const tasks = [];
        
        // Initialize user data if needed
        if (!userLevel.user_id) {
          tasks.push(initializeUserData(axios));
        }
        
        // Always fetch topic data
        tasks.push(fetchVocabularyByTopic(axios, topicId));

        await Promise.allSettled(tasks);
        setIsInitialized(true);
      } catch (error) {
        console.error("Error initializing topic detail:", error);
        addToast("Không thể tải dữ liệu chủ đề", TOAST_TYPES.ERROR);
        initializationRef.current = false;
      }
    };

    initialize();
  }, [topicId, userLevel.user_id, initializeUserData, fetchVocabularyByTopic, axios, addToast]);

  // Handle vocabulary selection
  useEffect(() => {
    if (topicVocabularies.length > 0 && !selectedVocabulary) {
      setSelectedVocabulary(topicVocabularies[0]);
      setSelectedIndex(0);
    } else if (selectedVocabulary) {
      const updatedVocab = topicVocabularies.find(
        (v) => v.vocab_id === selectedVocabulary.vocab_id
      );
      if (updatedVocab) {
        setSelectedVocabulary(updatedVocab);
      }
    }
  }, [topicVocabularies, selectedVocabulary]);

  // Initialize learned count tracking
  useEffect(() => {
    if (topicVocabularies.length > 0 && !topicInitialized.current) {
      const learnedCount = getLearnedCount();
      previousLearnedCount.current = learnedCount;
      topicInitialized.current = true;
    }
  }, [topicVocabularies, topicId]);

  useEffect(() => {
    if (
      topicVocabularies.length > 0 && 
      currentTopic && 
      userLevel.user_id && 
      topicInitialized.current
    ) {
      const currentLearnedCount = getLearnedCount();
      const totalWords = topicVocabularies.length;
      const hasAlreadyTakenTest = hasTopicTestCompleted(parseInt(topicId));
      
      if (
        previousLearnedCount.current !== null &&
        currentLearnedCount > previousLearnedCount.current &&
        currentLearnedCount === totalWords &&
        !hasAlreadyTakenTest
      ) {
        setTopicCompletedResults({
          topicName: currentTopic.name,
          totalWords: totalWords,
          topicId: topicId,
        });
        setShowTopicCompletedModal(true);
      }
      
      previousLearnedCount.current = currentLearnedCount;
    }
  }, [topicVocabularies, currentTopic, topicId, userLevel.user_id, hasTopicTestCompleted]);

  const calculateProgress = () => {
    if (!topicVocabularies || topicVocabularies.length === 0) return 0;
    const masteredCount = topicVocabularies.filter(
      (v) => v.VocabularyUsers?.[0]?.had_learned || v.isKnown
    ).length;
    return Math.round((masteredCount / topicVocabularies.length) * 100);
  };

  const getLearnedCount = () => {
    return topicVocabularies.filter(
      (v) => v.VocabularyUsers?.[0]?.had_learned || v.isKnown
    ).length;
  };

  const handleSelectVocabulary = (vocab, index) => {
    setSelectedVocabulary(vocab);
    setSelectedIndex(index);
  };

  const handleToggleBookmark = async (vocabId) => {
    try {
      const vocab = topicVocabularies.find((v) => v.vocab_id === vocabId);
      const newBookmarkStatus = await toggleBookmark(axios, vocabId, topicId);

      addToast(
        newBookmarkStatus
          ? `Đã lưu "${vocab.word}" vào từ vựng đã lưu`
          : `Đã xóa "${vocab.word}" khỏi từ vựng đã lưu`,
        TOAST_TYPES.SUCCESS
      );
    } catch (error) {
      addToast("Không thể cập nhật bookmark", TOAST_TYPES.ERROR);
    }
  };

  const handleWordLearned = async (vocabId) => {
    const isCurrentlyUpdating = loadingStates.learningUpdating.has(vocabId);
    if (isCurrentlyUpdating) {
      return;
    }

    try {
      const vocab = topicVocabularies.find((v) => v.vocab_id === vocabId);
      if (!vocab) return;

      const wasLearned = vocab.VocabularyUsers?.[0]?.had_learned || vocab.isKnown;

      const newLearningStatus = await updateLearningStatus(
        axios,
        vocabId,
        topicId
      );

      if (newLearningStatus !== undefined && newLearningStatus !== wasLearned) {
        addToast(
          newLearningStatus
            ? `Đã đánh dấu "${vocab.word}" là đã học`
            : `Đã đánh dấu "${vocab.word}" là chưa học`,
          TOAST_TYPES.SUCCESS
        );

        // Check level up khi word được học
        if (!wasLearned && newLearningStatus) {
          try {
            // Parallel level check và achievement fetch nếu level up
            const levelResult = await refreshUserLevel(axios);
            if (levelResult.leveledUp) {
              const achievements = await getNextLevelRewards(axios, levelResult.newLevel);

              setLevelUpResults({
                oldLevel: levelResult.oldLevel,
                newLevel: levelResult.newLevel,
                totalPoints: levelResult.totalPoints,
                wordsLearned: vocab.word,
                achievements: achievements,
              });
              setShowLevelUpModal(true);
            }
          } catch (levelError) {
            console.error("Error checking level:", levelError);
          }
        }
      }
    } catch (error) {
      addToast("Không thể cập nhật trạng thái học", TOAST_TYPES.ERROR);
    }
  };

  const handleTakeTest = () => {
    navigate(`/vocabulary/topic/${topicId}/Test`);
  };

  const handleCreateFlashcards = () => {
    setShowFlashcardModal(true);
  };

  const handleLevelUpAction = (action) => {
    setShowLevelUpModal(false);
    if (action === "test") {
      navigate(`/vocabulary/topic/${topicId}/Test`);
    }
  };

  const handleTopicCompletedAction = (action) => {
    setShowTopicCompletedModal(false);
    if (action === "test") {
      navigate(`/vocabulary/topic/${topicId}/Test`);
    }
  };

  if (isLoading || !isInitialized) {
    return (
      <main className="flex flex-col justify-center items-center flex-grow">
        <div className="w-full max-w-6xl px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent mx-auto mb-4"></div>
              <p className="text-gray-500">Đang tải chủ đề...</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-col items-center flex-grow">
      <div className="w-full max-w-full px-12 py-4">
        <TopicHeader
          topic={currentTopic}
          onBack={() => navigate("/vocabulary")}
          onTakeTest={handleTakeTest}
          onCreateFlashcard={handleCreateFlashcards}
          topicProgress={calculateProgress()}
          learnedCount={getLearnedCount()}
          totalCount={topicVocabularies.length}
          isTopicCompleted={getLearnedCount() === topicVocabularies.length}
          userLevel={userLevel}
          hasTestTaken={hasTopicTestCompleted(parseInt(topicId))}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 order-2 lg:order-1">
            <VocabularyList
              vocabularies={topicVocabularies}
              selectedVocabulary={selectedVocabulary}
              onSelectVocabulary={handleSelectVocabulary}
              onToggleBookmark={handleToggleBookmark}
              onMarkLearned={handleWordLearned}
            />
          </div>

          <div className="lg:col-span-2 order-1 lg:order-2">
            {selectedVocabulary ? (
              <VocabularyDetail
                vocabulary={selectedVocabulary}
                index={selectedIndex}
                total={topicVocabularies.length}
              />
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col items-center justify-center h-full">
                <TbCards className="w-16 h-16 text-gray-300 mb-4" />
                <p className="text-gray-500 text-center">
                  Chọn một từ vựng từ danh sách để xem chi tiết
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showLevelUpModal && (
          <LevelUpModal
            levelUpResults={levelUpResults}
            onClose={() => setShowLevelUpModal(false)}
            onAction={handleLevelUpAction}
          />
        )}

        {showTopicCompletedModal && (
          <TopicCompletedModal
            topicResults={topicCompletedResults}
            onClose={() => setShowTopicCompletedModal(false)}
            onAction={handleTopicCompletedAction}
          />
        )}

        {showFlashcardModal && (
          <FlashcardModal
            isOpen={showFlashcardModal}
            onClose={() => setShowFlashcardModal(false)}
            onConfirm={() => {
              addToast("Đã tạo bộ flashcard thành công", TOAST_TYPES.SUCCESS);
              setShowFlashcardModal(false);
            }}
            topicName={currentTopic?.name}
            vocabulariesCount={topicVocabularies.length}
          />
        )}
      </AnimatePresence>
    </main>
  );
};

export default TopicDetail;