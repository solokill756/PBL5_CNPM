// src/store/useLearnStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";

const REVIEW_THRESHOLD = 0.2; // 20% số từ hoặc bạn có thể dùng số lượng cụ thể

export const useLearnStore = create(
  persist(
    (set, get) => ({
      flashcards: [],
      currentIndex: 0,
      learned: [], 
      reviewMode: false,
      reviewList: [],
      setFlashcards: (cards) => {
        set({
          flashcards: cards,
          currentIndex: 0,
          learned: [],
          reviewMode: false,
          reviewList: [],
        });
      },
      handleKnow: () => {
        const { flashcards, currentIndex, learned, reviewMode } = get();
        if (reviewMode) return; // Không xử lý khi đang review
        if (currentIndex >= flashcards.length) return;
        const currentCard = flashcards[currentIndex];
        const newLearned = [
          ...learned,
          { id: currentCard.id, isKnown: true },
        ];
        // Kiểm tra điều kiện chuyển sang review
        const knownCount = newLearned.filter((item) => item.isKnown).length;
        const threshold = Math.max(1, Math.floor(REVIEW_THRESHOLD * flashcards.length));
        if (knownCount > 0 && knownCount % threshold === 0) {
          // Đủ điều kiện review
          set({
            learned: newLearned,
            reviewMode: true,
            reviewList: newLearned
              .filter((item) => item.isKnown)
              .map((item) => flashcards.find((c) => c.id === item.id)),
          });
        } else {
          set({
            learned: newLearned,
            currentIndex: currentIndex + 1,
          });
        }
      },
      handleDontKnow: () => {
        const { flashcards, currentIndex, learned, reviewMode } = get();
        if (reviewMode) return; // Không xử lý khi đang review
        if (currentIndex >= flashcards.length) return;
        const currentCard = flashcards[currentIndex];
        set({
          learned: [
            ...learned,
            { id: currentCard.id, isKnown: false },
          ],
          currentIndex: currentIndex + 1,
        });
      },
      handleReviewNext: () => {
        // Kết thúc review, tiếp tục học
        set({
          reviewMode: false,
          reviewList: [],
        });
      },
      resetLearn: () =>
        set({
          flashcards: [],
          currentIndex: 0,
          learned: [],
          reviewMode: false,
          reviewList: [],
        }),
      // Selectors
      knownCount: () => get().learned.filter((item) => item.isKnown).length,
      total: () => get().flashcards.length,
      isFinished: () => get().currentIndex >= get().flashcards.length,
      currentCard: () => get().flashcards[get().currentIndex],
      reviewMode: false,
      reviewList: [],
      // Lấy danh sách các từ chưa biết để học lại
      unlearnedCards: () => {
        const { flashcards, learned } = get();
        const learnedIds = learned.map((item) => item.id);
        return flashcards.filter((card) => !learnedIds.includes(card.id));
      },
    }),
    {
      name: "learn-flashcard-storage", // key localStorage
      partialize: (state) => ({
        flashcards: state.flashcards,
        currentIndex: state.currentIndex,
        learned: state.learned,
        reviewMode: state.reviewMode,
        reviewList: state.reviewList,
      }),
    }
  )
);