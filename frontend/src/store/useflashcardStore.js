import { create } from "zustand";
import { shuffleArray } from "../utils/array";
import { persist } from "zustand/middleware";
import { fetchFlashcardList } from "@/api/getFlashcardList";
import { fetchIsRated } from "@/api/getIsRated";
import { starOnFlashcard } from "@/api/starOnFlashcard";
import { unStarOnFlashcard } from "@/api/unStarOnFlashcard";
import { fetchAIExplain } from "@/api/getAIExplain";

const getValidIndex = (deck, currentId) => {
  if (!deck.length) return 0;
  if (!currentId) return 0;
  const index = deck.findIndex((card) => card.flashcard_id === currentId);
  return index >= 0 ? index : 0;
};

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
      // Loading/Error
      loading: false,
      error: null,

      isDataLoaded: false,
      lastLoadedId: null, // Lưu ID của flashcard đã load gần nhất

      // Data
      originalDeck: [],
      shuffledDeck: [],
      displayDeck: [],
      flashcardMetadata: [],
      authorInfor: [],

      // State
      isShuffled: false,
      isRated: false,
      currentIndex: 1,
      showShuffleStatus: false,
      starredMap: {},
      showFrontFirst: true,
      showOnlyStarred: false,

      fetchFlashcardList: async (axios, id) => {
        const store = get();

        // Kiểm tra nếu đã load data cho flashcard này rồi
        if (store.isDataLoaded && store.lastLoadedId === id) {
          return;
        }

        set({ loading: true, error: null });
        try {
          const response = await fetchFlashcardList(axios, id);
          const cards = response.flashcard || []; // Lấy mảng Flashcard từ response

          const newStarredMap = {};
          cards.forEach((item) => {
            newStarredMap[item.flashcard_id] =
              item.FlashCardUsers?.[0]?.like_status || false;
          });

          // Lưu thông tin metadata của flashcard list
          set({
            originalDeck: cards,
            displayDeck: cards,
            currentIndex: 1,
            isShuffled: false,
            isRated: false,
            starredMap: newStarredMap,
            showOnlyStarred: false,
            // Thêm metadata
            flashcardMetadata: response.inforListFlashcard,
            authorInfor: response.userInfor,
            isDataLoaded: true,
            lastLoadedId: id,
          });
        } catch (err) {
          set({ error: err });
        } finally {
          set({ loading: false });
        }
      },

      resetFlashcardState: () => {
        set({
          isDataLoaded: false,
          lastLoadedId: null,
          originalDeck: [],
          displayDeck: [],
          currentIndex: 1,
          isShuffled: false,
          isRated: false,
          starredMap: {},
          showOnlyStarred: false,
          flashcardMetadata: [],
          authorInfor: [],
          error: null,
        });
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

      updateFlashcardMetadata: (newRate, newNumberRate) => {
        set((state) => ({
          flashcardMetadata: {
            ...state.flashcardMetadata,
            rate: newRate,
            number_rate: newNumberRate,
          },
        }));
      },

      setIsRated: (value) => set({ isRated: value }),

      // Actions
      shuffle: () => {
        const {
          isShuffled,
          originalDeck,
          showOnlyStarred,
          starredMap,
          displayDeck,
          currentIndex,
        } = get();

        // Get current card ID before shuffling
        const currentCardId = displayDeck[currentIndex]?.flashcard_id;

        // Toggle shuffle state
        const nextShuffled = !isShuffled;

        // Filter deck based on showOnlyStarred setting
        const filteredDeck = showOnlyStarred
          ? originalDeck.filter((card) => starredMap[card.flashcard_id])
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

      // Track saved classes for flashcards
      savedClassesMap: {},

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

      // Queue cho các ID flashcard cần gửi star request
      starQueue: {},

      // Đánh dấu nếu đang có quá trình xử lý star đang diễn ra
      processingStars: false,

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

      // Check if there are any starred flashcards
      hasStarredFlashcards: () => {
        const starredMap = get().starredMap;
        return Object.values(starredMap).some((isStarred) => isStarred);
      },

      // Modal
      isModalOpen: false,
      modalType: null,
      rating: null,
      selectedTags: "",

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
          ? originalDeck.filter((card) => starredMap[card.flashcard_id])
          : originalDeck;

        // Get valid index for the filtered deck
        const newIndex = getValidIndex(filteredDeck, currentCardId);

        set({
          showOnlyStarred: value,
          displayDeck: filteredDeck,
          currentIndex: newIndex,
          // Reset shuffle state when filtering
          isShuffled: false,
          shuffledDeck: [],
        });
      },

      // restart currentIndex
      restartKey: 0,
      incrementRestartKey: () =>
        set((state) => ({ restartKey: state.restartKey + 1 })),

      // Thêm axios vào store để sử dụng trong các hàm
      setAxios: (axios) => set({ axios }),

      aiExplainCache: {}, // Cache để lưu trữ dữ liệu đã lấy
      aiExplainLoading: {}, // Loading state cho từng flashcard
      aiExplainError: {}, // Error state cho từng flashcard

      // Thêm actions mới
      fetchAIExplain: async (flashcardId, text) => {
        const store = get();

        // Kiểm tra cache trước
        if (store.aiExplainCache[flashcardId]) {
          return store.aiExplainCache[flashcardId];
        }

        // Kiểm tra nếu đang loading
        if (store.aiExplainLoading[flashcardId]) {
          return null;
        }

        // Set loading state
        set((state) => ({
          aiExplainLoading: {
            ...state.aiExplainLoading,
            [flashcardId]: true,
          },
        }));

        try {
          const data = await fetchAIExplain(store.axios, flashcardId, text);

          // Lưu vào cache
          set((state) => ({
            aiExplainCache: {
              ...state.aiExplainCache,
              [flashcardId]: data,
            },
            aiExplainLoading: {
              ...state.aiExplainLoading,
              [flashcardId]: false,
            },
          }));

          return data;
        } catch (error) {
          set((state) => ({
            aiExplainError: {
              ...state.aiExplainError,
              [flashcardId]: error,
            },
            aiExplainLoading: {
              ...state.aiExplainLoading,
              [flashcardId]: false,
            },
          }));
          throw error;
        }
      },

      // Clear cache khi cần
      clearAIExplainCache: (flashcardId) => {
        set((state) => {
          const newCache = { ...state.aiExplainCache };
          const newLoading = { ...state.aiExplainLoading };
          const newError = { ...state.aiExplainError };

          if (flashcardId) {
            delete newCache[flashcardId];
            delete newLoading[flashcardId];
            delete newError[flashcardId];
          } else {
            return {
              aiExplainCache: {},
              aiExplainLoading: {},
              aiExplainError: {},
            };
          }

          return {
            aiExplainCache: newCache,
            aiExplainLoading: newLoading,
            aiExplainError: newError,
          };
        });
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
