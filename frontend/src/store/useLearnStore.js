// src/store/useLearnStore.js
import { getForgetCard } from "@/api/getForgetCard";
import { postForgetCard } from "@/api/postForgetCard";
import { postRememberCard } from "@/api/postRememberCard";
import { resetForgetCard } from "@/api/resetForgetCard";
import { create } from "zustand";
import { persist } from "zustand/middleware";

const REVIEW_THRESHOLD = 0.2; // 20% of words or minimum 5 words

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

      // Initialize flashcards
      setFlashcards: (cards) => {
        set({
          fullDeck: cards,
          flashcards: cards,
          currentIndex: 0,
          learned: [],
          reviewMode: false,
          reviewList: [],
          round: 1,
          lastAction: "setFlashcards",
        });
      },

      updateLastActionTime: () => {
        set({ lastActionTime: Date.now() });
      },

      // Send learning progress to the API in batch
      sendLearningProgress: async (axios) => {
        const { rememberedCards, forgottenCards } = get();
        
        try {
          // Only send if there are cards to report
          if (rememberedCards.length > 0) {
            await postRememberCard(axios, rememberedCards);
          }
          if (forgottenCards.length > 0) {
            await postForgetCard(axios, forgottenCards);
          }
          
          // Reset lists after successful send
          set({ 
            rememberedCards: [], 
            forgottenCards: [],
            lastActionTime: Date.now()
          });
        } catch (error) {
          console.error('Error sending learning progress:', error);
        }
      },

      // Handle when user marks a card as known
      handleKnow: async (axios, list_id) => {
        const { flashcards, currentIndex, learned, reviewMode, fullDeck } = get();
        
        // Skip if in review mode or no valid card
        if (reviewMode || !flashcards || currentIndex >= flashcards.length) return;

        const currentCard = flashcards[currentIndex];
        if (!currentCard) return;

        try {
          // Add to remembered cards batch
          set(state => ({
            rememberedCards: [...state.rememberedCards, currentCard.flashcard_id],
            lastActionTime: Date.now()
          }));

          // Check if card was in review
          const wasInReview = get().reviewList.some(
            (card) => card.flashcard_id === currentCard.flashcard_id
          );

          // Update learned status for this card
          const newLearned = [
            ...learned.filter(item => item.flashcard_id !== currentCard.flashcard_id),
            { flashcard_id: currentCard.flashcard_id, isKnown: true }
          ];

          // Check if we should enter review mode
          const knownCount = newLearned.filter(item => item.isKnown).length;
          const threshold = Math.max(5, Math.floor(REVIEW_THRESHOLD * fullDeck.length));

          // Enter review mode if we hit the threshold and aren't already in review
          if (knownCount > 0 && 
              knownCount % threshold === 0 && 
              !reviewMode && 
              !wasInReview) {
            
            const justFinishedReview = get().lastAction === "handleReviewNext";

            if (!justFinishedReview) {
              set({
                learned: newLearned,
                reviewMode: true,
                reviewList: newLearned
                  .filter(item => item.isKnown)
                  .map(item => fullDeck.find(c => c.flashcard_id === item.flashcard_id)),
                lastAction: "handleKnow-reviewMode"
              });
              return;
            }
          }

          // Move to next card
          set({
            learned: newLearned,
            currentIndex: currentIndex + 1,
            lastAction: "handleKnow-nextCard"
          });
        } catch (error) {
          console.error("Error in handleKnow:", error);
        }
      },

      // Handle when user marks a card as not known
      handleDontKnow: async (axios, list_id) => {
        const { flashcards, currentIndex, learned, reviewMode } = get();
        
        // Skip if in review mode or no valid card
        if (reviewMode || !flashcards || currentIndex >= flashcards.length) return;
        
        const currentCard = flashcards[currentIndex];
        if (!currentCard) return;

        try {
          // Add to forgotten cards batch
          set(state => ({
            forgottenCards: [...state.forgottenCards, currentCard.flashcard_id],
            lastActionTime: Date.now()
          }));

          // Update learned status for this card
          const newLearned = [
            ...learned.filter(item => item.flashcard_id !== currentCard.flashcard_id),
            { flashcard_id: currentCard.flashcard_id, isKnown: false }
          ];

          // Move to next card
          set({
            learned: newLearned,
            currentIndex: currentIndex + 1,
            lastAction: "handleDontKnow"
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
                lastAction: "resetLearning"
            });
        } catch (error) {
            console.error('Error resetting learning:', error);
        }
      },

      // Handle finishing a review session
      handleReviewNext: async (axios, list_id) => {
        const { reviewList, learned, fullDeck, flashcards, currentIndex } = get();

        // Update learning status for all reviewed cards
        const newLearned = [...learned];
        reviewList.forEach(reviewCard => {
          if (!reviewCard) return;
          
          const existingIndex = newLearned.findIndex(
            item => item.flashcard_id === reviewCard.flashcard_id
          );
          
          if (existingIndex === -1) {
            newLearned.push({
              flashcard_id: reviewCard.flashcard_id,
              isKnown: true
            });
          } else {
            newLearned[existingIndex] = {
              ...newLearned[existingIndex],
              isKnown: true
            };
          }
        });

        // Find the next card that hasn't been learned yet
        let nextIndex = currentIndex;
        while (
          nextIndex < flashcards.length &&
          newLearned.find(
            item => 
              item.flashcard_id === flashcards[nextIndex].flashcard_id && 
              item.isKnown
          )
        ) {
          nextIndex++;
        }

        // Exit review mode and continue with normal learning
        set({
          reviewMode: false,
          reviewList: [],
          learned: newLearned,
          currentIndex: nextIndex,
          lastAction: "handleReviewNext"
        });
      },

      // Reset session with only the unlearned cards
      resetUnlearned: () => {
        const { fullDeck, learned, round } = get();

        // Get list of cards not yet learned
        const unlearned = fullDeck.filter(card => {
          const found = learned.find(item => item.flashcard_id === card.flashcard_id);
          return !found || !found.isKnown;
        });

        // If all cards are learned, nothing to do
        if (unlearned.length === 0) {
          set({ lastAction: "resetUnlearned-allKnown" });
          return;
        }

        // Start a new round with unlearned cards
        set({
          flashcards: unlearned,
          currentIndex: 0,
          reviewMode: false,
          reviewList: [],
          round: round + 1,
          lastAction: `resetUnlearned-round${round + 1}`
        });
      },

      // Reset everything
      resetLearn: () => set({
        flashcards: [],
        currentIndex: 0,
        learned: [],
        reviewMode: false,
        reviewList: [],
        round: 1,
        lastAction: "resetLearn"
      }),

      // SELECTORS

      // Count known cards
      knownCount: () => get().learned.filter(item => item.isKnown).length,

      // Get total number of cards
      total: () => get().fullDeck.length,

      // Check if learning is finished
      isFinished: () => {
        const { learned, fullDeck } = get();
        return fullDeck.every(card => 
          learned.find(
            item => item.flashcard_id === card.flashcard_id && item.isKnown
          )
        );
      },

      // Get current card
      currentCard: () => {
        const { flashcards, currentIndex } = get();
        if (!flashcards || flashcards.length === 0) return null;
        return currentIndex < flashcards.length ? flashcards[currentIndex] : null;
      },

      // Get list of cards not yet learned
      unlearnedCards: () => {
        const { fullDeck, learned } = get();
        return fullDeck.filter(card => {
          const learnedCard = learned.find(item => item.flashcard_id === card.flashcard_id);
          return !learnedCard || !learnedCard.isKnown;
        });
      },

      // Calculate next review threshold
      nextReviewThreshold: () => {
        const { fullDeck, learned } = get();
        const threshold = Math.max(5, Math.floor(REVIEW_THRESHOLD * fullDeck.length));
        const knownCount = learned.filter(item => item.isKnown).length;
        return Math.ceil((knownCount + 1) / threshold) * threshold;
      },

      // Check if all cards are known
      isAllKnown: () => {
        const { fullDeck, learned } = get();
        if (!fullDeck || fullDeck.length === 0) return false;

        return fullDeck.every(card => 
          learned.find(
            item => item.flashcard_id === card.flashcard_id && item.isKnown
          )
        );
      },

      // Check if at the end of a round
      isEndOfRound: () => {
        const { currentIndex, flashcards } = get();
        return !flashcards || flashcards.length === 0 || currentIndex >= flashcards.length;
      },

      // Restore previous learning state
      restoreLearningState: async (axios, list_id) => {
        try {
          const response = await getForgetCard(axios, list_id);
          const { listStudyInfor, flashcards } = response;

          if (!flashcards || flashcards.length === 0) return false;

          // Create learned list from FlashCardUsers data
          const learned = flashcards.map(card => ({
            flashcard_id: card.flashcard_id,
            isKnown: card.FlashCardUsers?.[0]?.remember_status || false
          }));

          // Find position of last reviewed card
          const lastReviewedCardId = listStudyInfor.last_review_flashcard_id;
          let currentIndex = 0;
          
          if (lastReviewedCardId) {
            currentIndex = flashcards.findIndex(
              card => card.flashcard_id === lastReviewedCardId
            ) + 1;
            
            if (currentIndex >= flashcards.length) currentIndex = 0;
          }

          // Update state
          set({
            fullDeck: flashcards,
            flashcards: flashcards,
            currentIndex: currentIndex,
            learned: learned,
            reviewMode: false,
            reviewList: [],
            round: 1,
            lastAction: "restoreLearningState"
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
      getLastAction: () => get().lastAction
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
        lastAction: state.lastAction
      })
    }
  )
);