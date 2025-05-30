import { create } from "zustand";

const useTopicStore = create((set, get) => ({
  // Topic/Category data
  categories: [],
  currentTopic: null,
  topicVocabularies: [],

  // User level data
  userLevel: {
    current_level: 1,
    total_points: 0,
    levelThreshold: 100,
    total_words_mastered: 0,
    total_topics_completed: 0,
    progress_percent: 0,
    full_name: "",
    email: "",
    profile_picture: "",
    username: "",
    user_id: "",
    is_active: false,
  },

  // UI states
  loading: false,
  error: null,

  // Bookmarks
  bookmarkedVocabularies: [],

  // Flashcard sets
  flashcardSets: [],

  // Actions
  fetchCategories: async (axios) => {
    try {
      set({ loading: true, error: null });
      const response = await axios.get("/api/vocabulary/allTopic");
      const data = response.data.data;

      const processedCategories = data.map((category) => ({
        ...category,
        progress_percent: category.VocabularyTopicUsers[0]
          ? Math.round(
              (category.VocabularyTopicUsers[0]?.mastered_words /
                category.total_words) *
                100
            )
          : 0,
        mastered_words: category.VocabularyTopicUsers[0]?.mastered_words,
        is_unlocked: true,
      }));

      set({
        categories: processedCategories,
        loading: false,
      });
    } catch (error) {
      console.error("Error fetching categories:", error);
      set({
        error: "Không thể tải danh sách chủ đề",
        loading: false,
      });
    }
  },

  checkLevel: async (axios, points = 0) => {
    try {
      set({ loading: true, error: null });

      const params = points > 0 ? { new_points: points } : {new_points: 0};

      const response = await axios.post("/api/vocabulary/checkLevelUser", params);
      const data = response.data.data;

      const progressPercent = Math.round(
        (parseInt(data.total_points) / parseInt(data.levelThreshold)) * 100
      );

      const updatedUserLevel = {
        current_level: parseInt(data.current_level),
        total_points: parseInt(data.total_points),
        levelThreshold: parseInt(data.levelThreshold),
        progress_percent: Math.min(progressPercent, 100),
        full_name: data.full_name,
        email: data.email,
        profile_picture: data.profile_picture,
        username: data.username,
        user_id: data.user_id,
        is_active: data.is_active,
        // These will be calculated from other endpoints or derived
        total_words_mastered: 0,
        total_topics_completed: 0,
      };

      set({
        userLevel: updatedUserLevel,
        loading: false,
      });

      get().updateCategoriesUnlockStatus(updatedUserLevel.current_level);

      return updatedUserLevel;
    } catch (error) {
      console.error("Error checking user level:", error);
      set({
        error: "Không thể tải thông tin cấp độ người dùng",
        loading: false,
      });
      throw error;
    }
  },

  updateCategoryProgress: (topicId, masteredWords) => {
    const currentCategories = get().categories;
    const updatedCategories = currentCategories.map(category => 
      category.topic_id === topicId 
        ? {
            ...category,
            mastered_words: masteredWords,
            progress_percent: Math.round((masteredWords / category.total_words) * 100)
          }
        : category
    );
    
    set({ categories: updatedCategories });
  },

  updateCategoriesUnlockStatus: (userLevel) => {
    const currentCategories = get().categories;
    const updatedCategories = currentCategories.map((category) => ({
      ...category,
      is_unlocked: userLevel >= (category.require_level || 1),
    }));

    set({ categories: updatedCategories });
  },

  calculateUserStats: () => {
    const categories = get().categories;
    const userLevel = get().userLevel;

    const totalWordsMastered = categories.reduce(
      (sum, category) => sum + (category.mastered_words || 0),
      0
    );

    const totalTopicsCompleted = categories.filter(
      (category) => category.mastered_words >= category.total_words
    ).length;

    set({
      userLevel: {
        ...userLevel,
        total_words_mastered: totalWordsMastered,
        total_topics_completed: totalTopicsCompleted,
      },
    });
  },

  toggleBookmark: async (axios, vocabulary_id, topic_id) => {
    try {
      const currentVocabs = get().topicVocabularies;
      const vocab = currentVocabs.find((v) => v.vocab_id === vocabulary_id);
      const isCurrentlyBookmarked =
        vocab?.VocabularyUsers?.[0]?.is_saved || vocab?.isBookmarked || false;

      const param = isCurrentlyBookmarked ? 0 : 1;

      await axios.post("/api/vocabulary/updateVocabularyUser", {
        vocabulary_id,
        is_saved: param,
        topic_id,
      });

      const updatedVocabs = currentVocabs.map((v) =>
        v.vocab_id === vocabulary_id
          ? {
              ...v,
              VocabularyUsers: [
                {
                  ...(v.VocabularyUsers?.[0] || {}),
                  is_saved: param,
                },
              ],
              isBookmarked: !isCurrentlyBookmarked,
            }
          : v
      );

      set({ topicVocabularies: updatedVocabs });

      return !isCurrentlyBookmarked;
    } catch (error) {
      console.error("Error toggling bookmark:", error);
      set({
        bookmarkedVocabularies: get().bookmarkedVocabularies,
        error: "Không thể cập nhật bookmark",
      });
      throw error;
    }
  },

  updateLearningStatus: async (axios, vocabulary_id, topic_id) => {
    try {
      const currentVocabs = get().topicVocabularies;
      const vocab = currentVocabs.find((v) => v.vocab_id === vocabulary_id);
      const isCurrentlyLearned =
        vocab?.VocabularyUsers?.[0]?.had_learned || vocab?.isKnown || false;

      const param = isCurrentlyLearned ? 0 : 1;

      await axios.post("/api/vocabulary/updateVocabularyUser", {
        vocabulary_id,
        had_learned: param,
        topic_id,
      });

      const updatedVocabs = currentVocabs.map((v) =>
        v.vocab_id === vocabulary_id
          ? {
              ...v,
              VocabularyUsers: [
                {
                  ...(v.VocabularyUsers?.[0] || {}),
                  had_learned: !isCurrentlyLearned,
                },
              ],
              isKnown: !isCurrentlyLearned,
            }
          : v
      );

      set({ topicVocabularies: updatedVocabs });

      return !isCurrentlyLearned;
    } catch (error) {
      console.error("Error updating learning status:", error);
      throw error;
    }
  },

  fetchVocabularyByTopic: async (axios, topicId) => {
    try {
      set({ loading: true, error: null });

      const response = await axios.get(`/api/vocabulary/topic/${topicId}`);
      const vocabularies = response.data.data;

      const currentTopic = get().categories.find(
        (category) => category.topic_id === topicId
      );

      const vocabsWithStatus = vocabularies.map((vocab) => ({
        ...vocab,
        isBookmarked: vocab.VocabularyUsers?.[0]?.is_saved || false,
        isKnown: vocab.VocabularyUsers?.[0]?.had_learned || false,
      }));

      set({
        currentTopic: currentTopic,
        topicVocabularies: vocabsWithStatus,
        loading: false,
      });

      return { vocabularies: vocabsWithStatus };
    } catch (error) {
      console.error("Error fetching topic vocabularies:", error);
      set({
        error: "Không thể tải danh sách từ vựng cho chủ đề này",
        loading: false,
      });
      throw error;
    }
  },

  createFlashcardSet: async (axios, { topicId, name, vocabularyIds }) => {
    try {
      set({ loading: true, error: null });

      const response = await axios.post("/api/flashcards/create", {
        topicId,
        name,
        vocabularyIds,
      });

      const newFlashcardSet = response.data.data;

      set({
        flashcardSets: [...get().flashcardSets, newFlashcardSet],
        loading: false,
      });

      return newFlashcardSet;
    } catch (error) {
      console.error("Error creating flashcard set:", error);
      set({
        error: "Không thể tạo bộ flashcard",
        loading: false,
      });
      throw error;
    }
  },

  initializeUserData: async (axios, forceRefresh = false) => {
    try {
      if (
        !forceRefresh &&
        get().categories.length > 0 &&
        get().userLevel.user_id
      ) {
        return;
      }

      set({ loading: true, error: null });

      // Fetch both categories and user level in parallel
      await Promise.all([
        get().fetchCategories(axios),
        get().checkLevel(axios),
      ]);

      // Calculate user stats after both are loaded
      get().calculateUserStats();
    } catch (error) {
      console.error("Error initializing user data:", error);
      set({
        error: "Không thể tải dữ liệu người dùng",
        loading: false,
      });
    }
  },

  refreshUserLevel: async (axios) => {
    try {
      const oldLevel = get().userLevel.current_level;
      const updatedLevel = await get().checkLevel(axios);
      
      // Trả về thông tin level up nếu có
      if (updatedLevel.current_level > oldLevel) {
        return {
          leveledUp: true,
          oldLevel,
          newLevel: updatedLevel.current_level,
          totalPoints: updatedLevel.total_points
        };
      }
      
      return { leveledUp: false };
    } catch (error) {
      console.error("Error refreshing user level:", error);
      throw error;
    }
  },

  // Reset store
  reset: () => {
    set({
      categories: [],
      topicVocabularies: [],
      userLevel: {
        current_level: 1,
        total_points: 0,
        levelThreshold: 100,
        total_words_mastered: 0,
        total_topics_completed: 0,
        progress_percent: 0,
        full_name: "",
        email: "",
        profile_picture: "",
        username: "",
        user_id: "",
        is_active: false,
      },
      loading: false,
      error: null,
      bookmarkedVocabularies: [],
      flashcardSets: [],
    });
  },

  // Clear error
  clearError: () => set({ error: null }),
}));

export default useTopicStore;
