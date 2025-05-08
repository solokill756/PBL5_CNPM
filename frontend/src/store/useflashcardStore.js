import { create } from "zustand";
import { shuffleArray } from "../utils/array";
import { persist } from "zustand/middleware";
import { fetchFlashcardList } from "@/api/getFlashcardList";
import { fetchIsRated } from "@/api/getIsRated";
import { starOnFlashcard } from "@/api/starOnFlashcard";
import { unStarOnFlashcard } from "@/api/unStarOnFlashcard";

const getValidIndex = (deck, currentId) => {
  if (!deck.length) return 0;
  if (!currentId) return 0;
  const index = deck.findIndex(card => card.flashcard_id === currentId);
  return index >= 0 ? index : 0;
};

// Debounce function để hạn chế gửi request liên tục
const debounce = (func, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
};

export const useFlashcardStore = create(
  persist(
    (set, get) => ({
      // Data
      originalDeck: [],
      shuffledDeck: [],
      displayDeck: [],

      // NEW: Cache for flashcard metadata from homepage
      flashcardCache: {}, // Map of id -> flashcard metadata

      // State
      isShuffled: false,
      isRated: false,
      currentIndex: 0,
      showShuffleStatus: false,
      starredMap: {},
      showFrontFirst: true,
      showOnlyStarred: false,

      // Track saved classes for flashcards
      savedClassesMap: {},

      // Queue cho các ID flashcard cần gửi star request
      starQueue: {},

      // Đánh dấu nếu đang có quá trình xử lý star đang diễn ra
      processingStars: false,

      // Modal
      isModalOpen: false,
      modalType: null,
      rating: null,
      selectedTags: "",

      // Loading/Error
      loading: false,
      error: null,

      // NEW: Methods for handling flashcard metadata cache

      // Add multiple flashcards to cache (used when coming from homepage)
      cacheFlashcards: (flashcards) => {
        const newCache = { ...get().flashcardCache };

        flashcards.forEach((flashcard) => {
          newCache[flashcard.list_id] = {
            ...flashcard,
            lastUpdated: new Date().getTime(),
          };
        });

        set({ flashcardCache: newCache });
      },

      // Update a single flashcard in cache
      updateFlashcardCache: (id, data) => {
        set((state) => ({
          flashcardCache: {
            ...state.flashcardCache,
            [id]: {
              ...state.flashcardCache[id],
              ...data,
              lastUpdated: new Date().getTime(),
            },
          },
        }));
      },

      // Get cached flashcard or null if not found or expired
      getCachedFlashcard: (id, maxAgeMs = 5 * 60 * 1000) => {
        // Default 5 min expiry
        const cached = get().flashcardCache[id];

        if (!cached) return null;

        const now = new Date().getTime();
        const isExpired =
          cached.lastUpdated && now - cached.lastUpdated > maxAgeMs;

        return isExpired ? null : cached;
      },

      // Clear cache for specific flashcard
      clearFlashcardCache: (id) => {
        const newCache = { ...get().flashcardCache };
        delete newCache[id];
        set({ flashcardCache: newCache });
      },

      // Clear entire cache
      clearAllFlashcardCache: () => {
        set({ flashcardCache: {} });
      },

      // Update saved classes map for a flashcard
      updateSavedClasses: (flashcardId, classIds) => {
        set((state) => ({
          savedClassesMap: {
            ...state.savedClassesMap,
            [flashcardId]: classIds,
          },
        }));
      },

      // Check if a flashcard is saved to any class
      isFlashcardSaved: (flashcardId) => {
        const classes = get().savedClassesMap[flashcardId] || [];
        return classes.length > 0;
      },

      fetchFlashcardList: async (axios, id) => {
        set({ loading: true, error: null });
        try {
          const cards = await fetchFlashcardList(axios, id);

          const newStarredMap = {};
          cards.forEach((item) => {
            newStarredMap[item.flashcard_id] =
              item.FlashCardUsers?.[0]?.like_status || false;
          });

          set({
            originalDeck: cards,
            displayDeck: cards,
            currentIndex: 0,
            isShuffled: false,
            isRated: false,
            starredMap: newStarredMap,
            showOnlyStarred: false,
          });
        } catch (err) {
          set({ error: err });
        } finally {
          set({ loading: false });
        }
      },

      fetchIsRated: async (axios, id) => {
        set({ loading: true, error: null });
        try {
          const isRated = await fetchIsRated(axios, id);
          set({ isRated: isRated });
        } catch (err) {
          set({ error: err });
        } finally {
          set({ loading: false });
        }
      },

      setIsRated: (value) => set({ isRated: value }),

      // Actions
      shuffle: () => {
        const { isShuffled, originalDeck, showOnlyStarred, starredMap, displayDeck, currentIndex } = get();
        
        // Get current card ID before shuffling
        const currentCardId = displayDeck[currentIndex]?.flashcard_id;
        
        // Toggle shuffle state
        const nextShuffled = !isShuffled;
        
        // Filter deck based on showOnlyStarred setting
        const filteredDeck = showOnlyStarred 
          ? originalDeck.filter(card => starredMap[card.flashcard_id])
          : originalDeck;

        if (nextShuffled) {
          // Generate a fresh shuffle each time
          const newShuffled = shuffleArray(filteredDeck);
          const newIndex = getValidIndex(newShuffled, currentCardId);
          
          set({
            isShuffled: true,
            shuffledDeck: newShuffled,
            displayDeck: newShuffled,
            currentIndex: newIndex,
            showShuffleStatus: true,
          });
        } else {
          // Revert to original order
          const newIndex = getValidIndex(filteredDeck, currentCardId);
          
          set({
            isShuffled: false,
            displayDeck: filteredDeck,
            currentIndex: newIndex,
            showShuffleStatus: true,
          });
        }
        // Hide status after 2s
        setTimeout(() => set({ showShuffleStatus: false }), 2000);
      },

      setCurrentIndex: (idx) => set({ currentIndex: idx }),

      // Hàm xử lý thay đổi star trên UI và thêm vào queue
      toggleStar: (id) => {
        const store = get();
        const newStarredState = !store.starredMap[id];

        // Cập nhật UI ngay lập tức
        set((state) => ({
          starredMap: { ...state.starredMap, [id]: newStarredState },
        }));

        // Thêm vào queue và set thời gian để xử lý
        set((state) => ({
          starQueue: { ...state.starQueue, [id]: newStarredState },
        }));

        // Gọi hàm xử lý queue sau delay
        store.processStarQueue();
      },

      // Hàm debounce để xử lý queue star sau một khoảng thời gian
      processStarQueue: debounce(async () => {
        const store = get();
        const { starQueue, processingStars } = store;

        // Nếu không có gì trong queue hoặc đang xử lý, bỏ qua
        if (Object.keys(starQueue).length === 0 || processingStars) {
          return;
        }

        // Đánh dấu đang xử lý
        set({ processingStars: true });

        try {
          // Lấy một bản sao của queue hiện tại
          const currentQueue = { ...starQueue };

          // Xóa các item đã xử lý khỏi queue
          set({ starQueue: {} });

          // Gửi request cho từng flashcard trong queue
          for (const [id, isStarred] of Object.entries(currentQueue)) {
            try {
              if (isStarred) {
                // Gọi API star nếu trạng thái là true
                await starOnFlashcard(get().axios, id);
              } else {
                // Gọi API unstar nếu trạng thái là false
                await unStarOnFlashcard(get().axios, id);
              }
              console.log(
                `Star status for flashcard ${id} updated to: ${isStarred}`
              );
            } catch (error) {
              console.error(
                `Failed to update star for flashcard ${id}:`,
                error
              );

              // Khôi phục trạng thái UI nếu request thất bại
              set((state) => ({
                starredMap: {
                  ...state.starredMap,
                  [id]: !isStarred,
                },
              }));
            }
          }
        } finally {
          // Đánh dấu đã xử lý xong
          set({ processingStars: false });

          // Kiểm tra nếu có thêm items được thêm vào queue trong quá trình xử lý
          const remainingQueue = get().starQueue;
          if (Object.keys(remainingQueue).length > 0) {
            // Gọi lại hàm xử lý cho các item còn lại sau một delay ngắn
            setTimeout(() => get().processStarQueue(), 100);
          }
        }
      }, 1500), // Delay 1.5 giây trước khi xử lý queue

      openModal: (type) => set({ isModalOpen: true, modalType: type }),
      closeModal: () =>
        set({
          isModalOpen: false,
          modalType: null,
          rating: null,
          selectedTags: "",
        }),
      setRating: (index) => set({ rating: index }),

      toggleTag: (tag) =>
        set((state) => ({
          selectedTags: state.selectedTags === tag ? "" : tag,
        })),

      // New action: set which side shows first
      setShowFrontFirst: (value) => set({ showFrontFirst: value }),
      toggleShowFrontFirst: () =>
        set((state) => ({ showFrontFirst: !state.showFrontFirst })),

      setShowOnlyStarred: (value) => {
        const { originalDeck, starredMap, currentIndex, displayDeck } = get();
        
        // Get current card ID before filtering
        const currentCardId = displayDeck[currentIndex]?.flashcard_id;
        
        // Filter the deck based on starred status
        const filteredDeck = value 
          ? originalDeck.filter(card => starredMap[card.flashcard_id])
          : originalDeck;

        // Get valid index for the filtered deck
        const newIndex = getValidIndex(filteredDeck, currentCardId);

        set({ 
          showOnlyStarred: value,
          displayDeck: filteredDeck,
          currentIndex: newIndex,
          // Reset shuffle state when filtering
          isShuffled: false,
          shuffledDeck: []
        });
      },

      // restart currentIndex
      restartKey: 0,
      incrementRestartKey: () =>
        set((state) => ({ restartKey: state.restartKey + 1 })),

      // Thêm axios vào store để sử dụng trong các hàm
      setAxios: (axios) => set({ axios }),

      // Thêm state mới
      currentFlashcard: null,
      flashcardLoading: false,
      flashcardError: null,

      // Thêm method mới để fetch và cache flashcard
      fetchAndCacheFlashcard: async (axios, list_id) => {
        const store = get();

        // Kiểm tra cache trước
        const cached = store.getCachedFlashcard(list_id);
        if (cached) {
          set({ currentFlashcard: cached });
          return cached;
        }

        set({ flashcardLoading: true, flashcardError: null });
        try {
          const response = await fetchFlashcardList(axios, list_id);
          const flashcardData = response.data;

          // Cache flashcard
          store.updateFlashcardCache(list_id, flashcardData);

          // Cập nhật state
          set({
            currentFlashcard: flashcardData,
            flashcardLoading: false,
          });

          return flashcardData;
        } catch (error) {
          set({
            flashcardError: error,
            flashcardLoading: false,
          });
          throw error;
        }
      },
    }),
    {
      name: "flashcard-storage", // key trong localStorage
      getStorage: () => localStorage, // bắt buộc chỉ rõ nếu env hỗn hợp (SSR/CSR)
      partialize: (state) => ({
        // Chỉ lưu những state cần thiết
        isShuffled: state.isShuffled,
        displayDeck: state.displayDeck,
        currentIndex: state.currentIndex,
        starredMap: state.starredMap,
        showFrontFirst: state.showFrontFirst,
        savedClassesMap: state.savedClassesMap,
        flashcardCache: state.flashcardCache, // NEW: Save cache to localStorage
      }),
      onRehydrateStorage: () => (state) => {
        console.log("Rehydrated flashcard-store:", state);
      },
    }
  )
);
