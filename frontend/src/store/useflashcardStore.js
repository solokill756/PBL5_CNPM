import { create } from "zustand";
import { shuffleArray } from "../utils/array";
import { persist } from "zustand/middleware";

const rawCards = [
  { id: 1, front: "勉強", back: "Học tập" },
  { id: 2, front: "学校", back: "Trường học" },
  { id: 3, front: "先生", back: "Giáo viên" },
  { id: 4, front: "学生", back: "Học sinh" },
  { id: 5, front: "図書館", back: "Thư viện" },
  { id: 6, front: "病院", back: "Bệnh viện" },
  { id: 7, front: "映画", back: "Phim" },
  { id: 8, front: "天気", back: "Thời tiết" },
  { id: 9, front: "雨", back: "Mưa" },
  { id: 10, front: "晴れ", back: "Trời nắng" },
  { id: 11, front: "風", back: "Gió" },
  { id: 12, front: "時間", back: "Thời gian" },
  { id: 13, front: "今日", back: "Hôm nay" },
  { id: 14, front: "明日", back: "Ngày mai" },
  { id: 15, front: "昨日", back: "Hôm qua" },
  { id: 16, front: "食べる", back: "Ăn" },
  { id: 17, front: "飲む", back: "Uống" },
  { id: 18, front: "行く", back: "Đi" },
  { id: 19, front: "来る", back: "Đến" },
  { id: 20, front: "見る", back: "Xem" },
  { id: 21, front: "聞く", back: "Nghe" },
  { id: 22, front: "書く", back: "Viết" },
  { id: 23, front: "読む", back: "Đọc" },
  { id: 24, front: "話す", back: "Nói chuyện" },
  { id: 25, front: "友達", back: "Bạn bè" },
  { id: 26, front: "家族", back: "Gia đình" },
  { id: 27, front: "父", back: "Bố" },
  { id: 28, front: "母", back: "Mẹ" },
  { id: 29, front: "兄", back: "Anh trai" },
  { id: 30, front: "姉", back: "Chị gái" },
  { id: 31, front: "弟", back: "Em trai" },
  { id: 32, front: "妹", back: "Em gái" },
  { id: 33, front: "猫", back: "Mèo" },
  { id: 34, front: "犬", back: "Chó" },
  { id: 35, front: "車", back: "Xe hơi" },
  { id: 36, front: "自転車", back: "Xe đạp" },
  { id: 37, front: "駅", back: "Nhà ga" },
  { id: 38, front: "店", back: "Cửa hàng" },
  { id: 39, front: "会社", back: "Công ty" },
  { id: 40, front: "仕事", back: "Công việc" },
  { id: 41, front: "料理", back: "Nấu ăn" },
  { id: 42, front: "音楽", back: "Âm nhạc" },
  { id: 43, front: "歌", back: "Bài hát" },
  { id: 44, front: "運動", back: "Vận động" },
  { id: 45, front: "買い物", back: "Mua sắm" },
  { id: 46, front: "旅行", back: "Du lịch" },
  { id: 47, front: "朝", back: "Buổi sáng" },
  { id: 48, front: "昼", back: "Buổi trưa" },
  { id: 49, front: "晩", back: "Buổi tối" },
  { id: 50, front: "夜", back: "Đêm" },
];

export const useFlashcardStore = create(
  persist(
    (set, get) => ({
      // Data
      originalDeck: rawCards,
      shuffledDeck: [],

      // State
      isShuffled: false,
      displayDeck: rawCards,
      currentIndex: 0,
      showShuffleStatus: false,
      starredMap: {},
      // User preference: which side shows first
      showFrontFirst: true,

      // Modal
      isModalOpen: false,
      modalType: null,
      rating: null,
      selectedTags: [],

      // Actions
      shuffle: () => {
        const { isShuffled, originalDeck } = get();
        // Toggle shuffle state
        const nextShuffled = !isShuffled;
        if (nextShuffled) {
          // Generate a fresh shuffle each time
          const newShuffled = shuffleArray(originalDeck);
          const currentId = get().displayDeck[get().currentIndex]?.id;
          const newIndex = newShuffled.findIndex((c) => c.id === currentId);
          set({
            isShuffled: true,
            shuffledDeck: newShuffled,
            displayDeck: newShuffled,
            currentIndex: newIndex >= 0 ? newIndex : 0,
            showShuffleStatus: true,
          });
        } else {
          // Revert to original order
          const currentId = get().displayDeck[get().currentIndex]?.id;
          const newIndex = originalDeck.findIndex((c) => c.id === currentId);
          set({
            isShuffled: false,
            displayDeck: originalDeck,
            currentIndex: newIndex >= 0 ? newIndex : 0,
            showShuffleStatus: true,
          });
        }
        // Hide status after 2s
        setTimeout(() => set({ showShuffleStatus: false }), 2000);
      },

      setCurrentIndex: (idx) => set({ currentIndex: idx }),
      toggleStar: (id) =>
        set((state) => ({
          starredMap: { ...state.starredMap, [id]: !state.starredMap[id] },
        })),

      openModal: (type) => set({ isModalOpen: true, modalType: type }),
      closeModal: () =>
        set({
          isModalOpen: false,
          modalType: null,
          rating: null,
          selectedTags: [],
        }),
      setRating: (index) => set({ rating: index }),

      toggleTag: (tag) =>
        set((state) => ({
          selectedTags: state.selectedTags.includes(tag)
            ? state.selectedTags.filter((t) => t !== tag)
            : [...state.selectedTags, tag],
        })),

      // New action: set which side shows first
      setShowFrontFirst: (value) => set({ showFrontFirst: value }),
      toggleShowFrontFirst: () =>
        set((state) => ({ showFrontFirst: !state.showFrontFirst })),
    }),
    // {
    //   name: 'flashcard-storage',        // key trong localStorage
    //   getStorage: () => localStorage,   // bắt buộc chỉ rõ nếu env hỗn hợp (SSR/CSR)
    //   partialize: state => ({
    //     // Chỉ lưu những state cần thiết
    //     isShuffled: state.isShuffled,
    //     displayDeck: state.displayDeck,
    //     currentIndex: state.currentIndex,
    //     starredMap: state.starredMap,
    //     showFrontFirst: state.showFrontFirst,
    //   }),
    //   onRehydrateStorage: () => state => {
    //     console.log('Rehydrated flashcard-store:', state);
    //   },
    // }
  )
);
