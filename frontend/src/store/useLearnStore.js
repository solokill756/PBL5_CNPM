import { getForgetCard } from "@/api/getForgetCard";
import { postForgetCard } from "@/api/postForgetCard";
import { postRememberCard } from "@/api/postRememberCard";
import { resetForgetCard } from "@/api/resetForgetCard";
import { shuffleArray } from "@/utils/array";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useLearnStore = create(
  persist(
    (set, get) => ({
      fullDeck: [],
      flashcards: [],
      rememberedCards: [], // Cards marked as remembered in the current session
      forgottenCards: [], // Cards marked as forgotten in the current session
      lastActionTime: Date.now(),
      currentIndex: 0,
      learned: [], // Learning history for all cards
      reviewMode: false,
      reviewList: [],
      round: 1, // Learning round counter
      lastAction: "", // Debug state
      cardOrder: [],
      isShuffled: false, // Thêm state để track shuffle status

      // Initialize flashcards
      setFlashcards: (cards) => {
        // Khởi tạo card order theo thứ tự ban đầu (không shuffle)
        const initialOrder = Array.from({ length: cards.length }, (_, i) => i);

        set({
          fullDeck: cards,
          flashcards: cards,
          cardOrder: initialOrder,
          currentIndex: 0,
          learned: [],
          reviewMode: false,
          reviewList: [],
          round: 1,
          lastAction: "setFlashcards",
          isShuffled: false, // Reset shuffle status
        });
      },

      currentCard: () => {
        const { flashcards, currentIndex, cardOrder } = get();
        if (!flashcards || flashcards.length === 0) return null;

        const actualIndex = cardOrder[currentIndex];
        return actualIndex < flashcards.length ? flashcards[actualIndex] : null;
      },

      // Hàm để trộn thẻ (chỉ gọi khi người dùng yêu cầu)
      shuffleCards: () => {
        const { fullDeck, isShuffled } = get();

        // Chỉ shuffle nếu chưa shuffle
        if (!isShuffled) {
          const newOrder = Array.from({ length: fullDeck.length }, (_, i) => i);
          shuffleArray(newOrder);

          set({
            cardOrder: newOrder,
            currentIndex: 0,
            lastAction: "shuffleCards",
            isShuffled: true,
          });
        }
      },

      updateLastActionTime: () => {
        set({ lastActionTime: Date.now() });
      },

      pendingProgress: {
        known: [],
        unknown: [],
      },

      // Hàm mới để thêm card vào pending progress
      addToPendingProgress: (cardId, isKnown) => {
        set((state) => ({
          pendingProgress: {
            known: isKnown
              ? [...state.pendingProgress.known, cardId]
              : state.pendingProgress.known,
            unknown: !isKnown
              ? [...state.pendingProgress.unknown, cardId]
              : state.pendingProgress.unknown,
          },
        }));
      },

      // Hàm mới để gửi progress và reset pending
      isSendingProgress: false, // Thêm state này

      // Sửa lại hàm sendPendingProgress
      sendPendingProgress: async (axios, list_id) => {
        const { pendingProgress, isSendingProgress } = get();

        // Nếu đang gửi request hoặc không có progress để gửi thì return
        if (
          isSendingProgress ||
          (pendingProgress.known.length === 0 &&
            pendingProgress.unknown.length === 0)
        ) {
          return;
        }

        try {
          set({ isSendingProgress: true }); // Set flag đang gửi

          if (!axios.defaults.headers.common["Authorization"]) {
            console.error("No authorization token found");
            return;
          }

          if (pendingProgress.known.length > 0) {
            await postRememberCard(axios, pendingProgress.known, list_id);
          }
          if (pendingProgress.unknown.length > 0) {
            await postForgetCard(axios, pendingProgress.unknown, list_id);
          }

          // Reset pending progress sau khi gửi thành công
          set({
            pendingProgress: { known: [], unknown: [] },
            isSendingProgress: false,
          });
        } catch (error) {
          console.error("Error sending pending progress:", error);
          set({ isSendingProgress: false }); // Reset flag nếu có lỗi
        }
      },

      // Hàm mới để kiểm tra và xử lý khi học xong
      handleLearningComplete: async (axios, list_id) => {
        const { isAllKnown, resetLearning } = get();

        if (isAllKnown()) {
          try {
            // Reset learning state
            await resetLearning(axios, list_id);
          } catch (error) {
            console.error("Error handling learning complete:", error);
          }
        }
      },

      // Thêm state này trong useLearnStore.js
      flashcardsInGroup: 3, // Giá trị mặc định
      totalGroups: 1, // Giá trị mặc định

      handleKnow: async (axios, list_id) => {
        const {
          flashcards,
          currentIndex,
          learned,
          reviewMode,
          fullDeck,
          flashcardsInGroup,
          cardOrder,
          round,
        } = get();
      
        // Skip if in review mode or no valid card
        if (reviewMode || !flashcards || currentIndex >= cardOrder.length)
          return;
      
        const actualIndex = cardOrder[currentIndex];
        const currentCard = flashcards[actualIndex];
        if (!currentCard) return;
      
        try {
          // Add to remembered cards batch
          set((state) => ({
            rememberedCards: [
              ...state.rememberedCards,
              currentCard.flashcard_id,
            ],
            lastActionTime: Date.now(),
          }));
      
          // Find existing learned item for this card
          const existingLearnedItem = learned.find(
            (item) => item.flashcard_id === currentCard.flashcard_id
          );
      
          // Only count this card for review if it's being learned for first time
          const isFirstTimeInRound = !existingLearnedItem ||
                                    !existingLearnedItem.isKnown;
      
          // Update learned status for this card
          const newLearned = [
            ...learned.filter(
              (item) => item.flashcard_id !== currentCard.flashcard_id
            ),
            {
              flashcard_id: currentCard.flashcard_id,
              isKnown: true,
              learnedInRound: round,
              isFirstTimeInRound: isFirstTimeInRound,
            },
          ];
      
          // Count ALL known cards (not just current round)
          const totalKnownCount = newLearned.filter(item => item.isKnown).length;

          const shouldEnterReview = totalKnownCount > 0 &&
                                    totalKnownCount % flashcardsInGroup === 0 &&
                                    !reviewMode &&
                                    totalKnownCount < fullDeck.length;
      
          if (shouldEnterReview) {
            const justFinishedReview = get().lastAction === "handleReviewNext";
      
            if (!justFinishedReview) {
              // Get the last batch of cards for review
              const startIndex = Math.floor(totalKnownCount / flashcardsInGroup - 1) * flashcardsInGroup;
              const reviewCards = [];
              
              // Get all known cards sorted by when they were learned
              const knownCards = fullDeck.filter((card) => {
                const learnedItem = newLearned.find(
                  (item) => item.flashcard_id === card.flashcard_id && item.isKnown
                );
                return !!learnedItem;
              });
              
              // Take the last batch
              for (let i = startIndex; i < totalKnownCount && i < knownCards.length; i++) {
                reviewCards.push(knownCards[i]);
              }
      
              set({
                learned: newLearned,
                reviewMode: true,
                reviewList: reviewCards,
                lastAction: "handleKnow-reviewMode",
              });
              return;
            }
          }
      
          // Move to next card
          set({
            learned: newLearned,
            currentIndex: currentIndex + 1,
            lastAction: "handleKnow-nextCard",
          });
        } catch (error) {
          console.error("Error in handleKnow:", error);
        }
      },
      

      // Handle when user marks a card as not known
      handleDontKnow: async (axios, list_id) => {
        const {
          flashcards,
          currentIndex,
          learned,
          reviewMode,
          cardOrder,
          round,
        } = get();

        // Skip if in review mode or no valid card
        if (reviewMode || !flashcards || currentIndex >= cardOrder.length)
          return;

        const actualIndex = cardOrder[currentIndex];
        const currentCard = flashcards[actualIndex];
        if (!currentCard) return;

        try {
          // Add to forgotten cards batch
          set((state) => ({
            forgottenCards: [...state.forgottenCards, currentCard.flashcard_id],
            lastActionTime: Date.now(),
          }));

          // Update learned status for this card với round hiện tại
          const newLearned = [
            ...learned.filter(
              (item) => item.flashcard_id !== currentCard.flashcard_id
            ),
            {
              flashcard_id: currentCard.flashcard_id,
              isKnown: false,
              learnedInRound: round, // Luôn sử dụng round hiện tại
            },
          ];

          // Move to next card
          set({
            learned: newLearned,
            currentIndex: currentIndex + 1,
            lastAction: "handleDontKnow",
          });
        } catch (error) {
          console.error("Error in handleDontKnow:", error);
        }
      },

      // Reset learning session
      resetLearning: async (axios, list_id) => {
        try {
          await resetForgetCard(axios, list_id);
          // Reset all related state
          set({
            rememberedCards: [],
            forgottenCards: [],
            lastActionTime: Date.now(),
            learned: [],
            currentIndex: 0,
            reviewMode: false,
            reviewList: [],
            round: 1,
            lastAction: "resetLearning",
            isShuffled: false, // Reset shuffle status
          });
        } catch (error) {
          console.error("Error resetting learning:", error);
        }
      },

      // Handle finishing a review session
      handleReviewNext: async (axios, list_id) => {
        const {
          learned,
          flashcards,
          currentIndex,
          cardOrder,
        } = get();

        // Find the next card in order that hasn't been learned yet
        let nextIndex = currentIndex;
        while (
          nextIndex < cardOrder.length &&
          learned.find((item) => {
            const actualIndex = cardOrder[nextIndex];
            return (
              item.flashcard_id === flashcards[actualIndex].flashcard_id &&
              item.isKnown
            );
          })
        ) {
          nextIndex++;
        }

        // Exit review mode and continue with normal learning
        set({
          reviewMode: false,
          reviewList: [], // Clear review list sau khi review xong
          currentIndex: nextIndex,
          lastAction: "handleReviewNext",
        });
      },

      // Reset session with only the unlearned cards
      resetUnlearned: () => {
        const { fullDeck, learned, round } = get();

        // Get list of cards not yet learned
        const unlearned = fullDeck.filter((card) => {
          const found = learned.find(
            (item) => item.flashcard_id === card.flashcard_id
          );
          return !found || !found.isKnown;
        });

        // If all cards are learned, nothing to do
        if (unlearned.length === 0) {
          set({ lastAction: "resetUnlearned-allKnown" });
          return;
        }

        // Reset learned flags for next round - clear isFirstTimeInRound for all cards
        const updatedLearned = learned.map((item) => ({
          ...item,
          // Reset isFirstTimeInRound flag completely for new round
          isFirstTimeInRound: false,
        }));

        // Tạo cardOrder mới cho những card chưa học
        const newOrder = Array.from({ length: unlearned.length }, (_, i) => i);

        // Start a new round with unlearned cards
        set({
          flashcards: unlearned,
          cardOrder: newOrder,
          currentIndex: 0,
          reviewMode: false,
          reviewList: [],
          round: round + 1,
          learned: updatedLearned,
          lastAction: `resetUnlearned-round${round + 1}`,
        });
      },

      // Reset everything
      resetLearn: () =>
        set({
          flashcards: [],
          currentIndex: 0,
          learned: [],
          reviewMode: false,
          reviewList: [],
          round: 1,
          lastAction: "resetLearn",
          isShuffled: false,
        }),

      // Count known cards
      knownCount: () => get().learned.filter((item) => item.isKnown).length,

      currentRoundKnownCount: () => {
        const { learned, round } = get();
        return learned.filter(
          (item) =>
            item.isKnown &&
            item.learnedInRound === round &&
            item.isFirstTimeInRound === true
        ).length;
      },
      
      // Add a new selector for total known count
      totalKnownCount: () => {
        const { learned } = get();
        return learned.filter(item => item.isKnown).length;
      },

      // Get total number of cards
      total: () => get().fullDeck.length,

      // Check if learning is finished
      isFinished: () => {
        const { learned, fullDeck } = get();
        return fullDeck.every((card) =>
          learned.find(
            (item) => item.flashcard_id === card.flashcard_id && item.isKnown
          )
        );
      },

      // Get list of cards not yet learned
      unlearnedCards: () => {
        const { fullDeck, learned } = get();
        return fullDeck.filter((card) => {
          const learnedCard = learned.find(
            (item) => item.flashcard_id === card.flashcard_id
          );
          return !learnedCard || !learnedCard.isKnown;
        });
      },

      // Calculate next review threshold
      nextReviewThreshold: () => {
        const { currentRoundKnownCount, flashcardsInGroup } = get();
        const count = currentRoundKnownCount(); // Dùng count của round hiện tại

        // Tính threshold dựa trên flashcardsInGroup từ API
        return Math.ceil((count + 1) / flashcardsInGroup) * flashcardsInGroup;
      },

      // Check if all cards are known
      isAllKnown: () => {
        const { fullDeck, learned } = get();
        if (!fullDeck || fullDeck.length === 0) return false;
        if (!learned || !Array.isArray(learned)) return false;

        return fullDeck.every((card) =>
          learned.find(
            (item) => item.flashcard_id === card.flashcard_id && item.isKnown
          )
        );
      },

      // Check if at the end of a round
      isEndOfRound: () => {
        const { currentIndex, flashcards, cardOrder } = get();
        return (
          !flashcards ||
          flashcards.length === 0 ||
          currentIndex >= cardOrder.length
        );
      },

      restoreLearningState: async (axios, list_id) => {
        try {
          const response = await getForgetCard(axios, list_id);
          const { listStudyInfor, flashcards, flashcardInGroup, total_groups } = response;
      
          if (!flashcards || flashcards.length === 0) return false;
      
          // Properly restore learned state from API data
          const learned = flashcards.map((card) => {
            // Check if card is marked as learned in the API response
            const isLearned = card.is_learned || false; // Assuming API provides this
            
            return {
              flashcard_id: card.flashcard_id,
              isKnown: isLearned,
              learnedInRound: 1,
              isFirstTimeInRound: !isLearned, // Only new cards should be first time
            };
          });
      
          // Calculate how many cards are already known
          const knownCards = learned.filter(item => item.isKnown);
          const knownCount = knownCards.length;
          
          // Check if we should be in review mode based on known count
          const shouldBeInReviewMode = knownCount > 0 && 
                                       knownCount % flashcardInGroup === 0 &&
                                       knownCount < flashcards.length;
          
          // If we should be in review mode, prepare review list
          let reviewList = [];
          if (shouldBeInReviewMode) {
            // Get the last batch of learned cards for review
            const startIndex = Math.floor(knownCount / flashcardInGroup - 1) * flashcardInGroup;
            reviewList = flashcards.filter((card) => {
              const learnedItem = learned.find(
                item => item.flashcard_id === card.flashcard_id && item.isKnown
              );
              if (!learnedItem) return false;
              
              // Get the index of this card in the known cards list
              const knownIndex = knownCards.findIndex(
                item => item.flashcard_id === card.flashcard_id
              );
              
              return knownIndex >= startIndex && knownIndex < knownCount;
            });
          }
      
          // Find position of last reviewed card
          const lastReviewedCardId = listStudyInfor?.last_review_flashcard_id;
          let currentIndex = 0;
      
          if (lastReviewedCardId) {
            const foundIndex = flashcards.findIndex(
              (card) => card.flashcard_id === lastReviewedCardId
            );
      
            if (foundIndex >= 0) {
              currentIndex = foundIndex + 1;
              if (currentIndex >= flashcards.length) currentIndex = 0;
            }
          }
      
          // If in review mode, current index should be 0 for review
          if (shouldBeInReviewMode) {
            currentIndex = 0;
          }
      
          // Create card order (no shuffle when restoring)
          const cardOrder = Array.from(
            { length: flashcards.length },
            (_, i) => i
          );
      
          // Update state with proper review mode status
          set({
            fullDeck: flashcards,
            flashcards: flashcards,
            cardOrder: cardOrder,
            currentIndex: currentIndex,
            learned: learned,
            reviewMode: shouldBeInReviewMode,
            reviewList: reviewList,
            round: 1,
            flashcardsInGroup: flashcardInGroup > 0 ? flashcardInGroup : 3,
            totalGroups: total_groups > 0 ? total_groups : 1,
            lastAction: "restoreLearningState",
            isShuffled: false,
          });
      
          return true;
        } catch (error) {
          console.error("Error restoring learning state:", error);
          return false;
        }
      },
      

      // Get current round
      getRound: () => get().round,

      // Get last action (for debugging)
      getLastAction: () => get().lastAction,
    }),
    {
      name: "learn-flashcard-storage",
      partialize: (state) => ({
        fullDeck: state.fullDeck,
        flashcards: state.flashcards,
        currentIndex: state.currentIndex,
        learned: state.learned,
        reviewMode: state.reviewMode,
        reviewList: state.reviewList,
        round: state.round,
        lastAction: state.lastAction,
        pendingProgress: state.pendingProgress,
        cardOrder: state.cardOrder,
        isShuffled: state.isShuffled,
      }),
    }
  )
);
