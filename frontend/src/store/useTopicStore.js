import { create } from "zustand";

const useTopicStore = create((set, get) => ({
  // Topic/Category data
  categories: [],
  currentTopic: null,
  topicVocabularies: [],
  currentUserId: null,

  // User level data
  userLevel: {
    current_level: 1,
    total_points: 0,
    levelThreshold: 0,
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

  completedTopicTests: new Set(),
  completedTopicsThisSession: new Set(),

  flashcardSets: [],

  // Thêm session tracking để detect navigation changes
  lastRefreshTime: 0,
  needsRefresh: false,

  loadingStates: {
    categories: false,
    userLevel: false,
    topicVocabularies: false,
    flashcardCreate: false,
    initializing: false,
    refreshing: false,
    bookmarkUpdating: new Set(),
    learningUpdating: new Set(),
  },
  error: null,

  setLoadingState: (key, value) =>
    set((state) => ({
      loadingStates: {
        ...state.loadingStates,
        [key]: value,
      },
    })),

  // Thêm method để mark cần refresh từ trang khác
  markNeedsRefresh: () => {
    console.log("🔄 Marking store for refresh");
    set({ needsRefresh: true });
  },

  // Thêm method để force refresh user data
  forceRefreshUserData: async (axios) => {
    try {
      console.log("🔄 Force refreshing user data...");
      set((state) => ({
        loadingStates: { ...state.loadingStates, refreshing: true },
        needsRefresh: false,
      }));

      // Parallel refresh user level và categories
      const [levelResult, categoriesResult] = await Promise.allSettled([
        axios.post("/api/vocabulary/checkLevelUser", { new_points: 0 }),
        axios.get("/api/vocabulary/allTopic"),
      ]);

      // Process level data
      if (levelResult.status === "fulfilled") {
        const levelData = levelResult.value.data.data;

        const progressPercent = Math.round(
          (parseInt(levelData.total_points) /
            parseInt(levelData.levelThreshold)) *
            100
        );

        const updatedUserLevel = {
          current_level: parseInt(levelData.current_level),
          total_points: parseInt(levelData.total_points),
          levelThreshold: parseInt(levelData.levelThreshold),
          progress_percent: Math.min(progressPercent, 100),
          full_name: levelData.full_name,
          email: levelData.email,
          profile_picture: levelData.profile_picture,
          username: levelData.username,
          user_id: levelData.user_id,
          is_active: levelData.is_active,
          total_words_mastered: 0,
          total_topics_completed: 0,
        };

        set({ userLevel: updatedUserLevel });
        console.log(
          "✅ User level refreshed:",
          updatedUserLevel.total_points,
          "points"
        );
      }

      // Process categories data
      if (categoriesResult.status === "fulfilled") {
        const categoriesData = categoriesResult.value.data.data;
        const processedCategories = categoriesData.map((category) => ({
          ...category,
          progress_percent: category.VocabularyTopicUsers[0]
            ? Math.round(
                (category.VocabularyTopicUsers[0]?.mastered_words /
                  category.total_words) *
                  100
              )
            : 0,
          mastered_words: category.VocabularyTopicUsers[0]?.mastered_words || 0,
          is_unlocked: true,
        }));

        set({ categories: processedCategories });
        console.log("✅ Categories refreshed");
      }

      set({ lastRefreshTime: Date.now() });
      return true;
    } catch (error) {
      console.error("❌ Error force refreshing user data:", error);
      return false;
    } finally {
      set((state) => ({
        loadingStates: { ...state.loadingStates, refreshing: false },
      }));
    }
  },

  clearUserData: () => {
    set({
      categories: [],
      currentTopic: null,
      topicVocabularies: [],
      completedTopicTests: new Set(),
      completedTopicsThisSession: new Set(),
      userLevel: {
        current_level: 1,
        total_points: 0,
        levelThreshold: 0,
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
      currentUserId: null,
      error: null,
      lastRefreshTime: 0,
      needsRefresh: false,
    });
  },

  setVocabLoadingState: (type, vocabId, isLoading) =>
    set((state) => {
      const newSet = new Set(state.loadingStates[type]);
      if (isLoading) {
        newSet.add(vocabId);
      } else {
        newSet.delete(vocabId);
      }
      return {
        loadingStates: {
          ...state.loadingStates,
          [type]: newSet,
        },
      };
    }),

  // Session completion tracking
  markTopicCompletedThisSession: (topicId) => {
    const sessionCompleted = get().completedTopicsThisSession;
    set({
      completedTopicsThisSession: new Set([...sessionCompleted, topicId]),
    });
  },

  hasTopicCompletedThisSession: (topicId) => {
    return get().completedTopicsThisSession.has(topicId);
  },

  // Test completion tracking
  hasTopicTestCompleted: (topicId) => {
    const userId = get().userLevel.user_id;
    if (!userId) return false;

    try {
      const completed = JSON.parse(
        localStorage.getItem(`topic_tests_completed_${userId}`) || "[]"
      );
      return completed.includes(topicId);
    } catch (error) {
      return false;
    }
  },

  markTopicTestCompleted: (topicId) => {
    const { userLevel } = get();
    if (!userLevel.user_id) return;

    try {
      const completed = JSON.parse(
        localStorage.getItem(`topic_tests_completed_${userLevel.user_id}`) ||
          "[]"
      );

      if (!completed.includes(topicId)) {
        const newCompleted = [...completed, topicId];
        localStorage.setItem(
          `topic_tests_completed_${userLevel.user_id}`,
          JSON.stringify(newCompleted)
        );

        set({ completedTopicTests: new Set(newCompleted) });
      }
    } catch (error) {
      console.error("Error marking test completed:", error);
    }
  },

  loadCompletedTopicTests: (userId) => {
    try {
      const completed = JSON.parse(
        localStorage.getItem(`topic_tests_completed_${userId}`) || "[]"
      );
      set({ completedTopicTests: new Set(completed) });
    } catch (error) {
      console.error("Error loading completed topic tests:", error);
      set({ completedTopicTests: new Set() });
    }
  },

  // PARALLEL OPTIMIZED: Initialize user data với smart refresh
  initializeUserData: async (axios) => {
    try {
      const state = get();

      // Avoid duplicate initialization
      if (state.loadingStates.initializing) {
        return;
      }

      // Check if need refresh từ trang khác
      if (state.needsRefresh && state.userLevel.user_id) {
        return await get().forceRefreshUserData(axios);
      }

      set({ loadingStates: { ...state.loadingStates, initializing: true } });

      // Parallel API calls
      const apiCalls = [];

      // Always fetch user level first để có userId
      if (!state.userLevel.user_id) {
        apiCalls.push(
          axios
            .post("/api/vocabulary/checkLevelUser", { new_points: 0 })
            .then((response) => ({
              type: "userLevel",
              data: response.data.data,
            }))
            .catch((error) => ({ type: "userLevel", error }))
        );
      }

      // Fetch categories nếu chưa có
      if (!state.categories.length) {
        apiCalls.push(
          axios
            .get("/api/vocabulary/allTopic")
            .then((response) => ({
              type: "categories",
              data: response.data.data,
            }))
            .catch((error) => ({ type: "categories", error }))
        );
      }

      if (apiCalls.length === 0) {
        return; // Already initialized
      }

      const results = await Promise.allSettled(apiCalls);

      let userLevelData = null;
      let categoriesData = null;
      let hasError = false;

      results.forEach((result) => {
        if (result.status === "fulfilled") {
          const { type, data, error } = result.value;

          if (error) {
            console.error(`Error in ${type}:`, error);
            hasError = true;
            return;
          }

          if (type === "userLevel") {
            userLevelData = data;
          } else if (type === "categories") {
            categoriesData = data;
          }
        } else {
          hasError = true;
          console.error("API call failed:", result.reason);
        }
      });

      // Process user level data
      if (userLevelData) {
        // Check user change
        const currentUserId = get().currentUserId;
        if (currentUserId && currentUserId !== userLevelData.user_id) {
          get().clearUserData();
        }

        const progressPercent = Math.round(
          (parseInt(userLevelData.total_points) /
            parseInt(userLevelData.levelThreshold)) *
            100
        );

        const updatedUserLevel = {
          current_level: parseInt(userLevelData.current_level),
          total_points: parseInt(userLevelData.total_points),
          levelThreshold: parseInt(userLevelData.levelThreshold),
          progress_percent: Math.min(progressPercent, 100),
          full_name: userLevelData.full_name,
          email: userLevelData.email,
          profile_picture: userLevelData.profile_picture,
          username: userLevelData.username,
          user_id: userLevelData.user_id,
          is_active: userLevelData.is_active,
          total_words_mastered: 0,
          total_topics_completed: 0,
        };

        set({
          userLevel: updatedUserLevel,
          currentUserId: userLevelData.user_id,
        });

        // Load completed tests
        get().loadCompletedTopicTests(userLevelData.user_id);
      }

      // Process categories data
      if (categoriesData) {
        const processedCategories = categoriesData.map((category) => ({
          ...category,
          progress_percent: category.VocabularyTopicUsers[0]
            ? Math.round(
                (category.VocabularyTopicUsers[0]?.mastered_words /
                  category.total_words) *
                  100
              )
            : 0,
          mastered_words: category.VocabularyTopicUsers[0]?.mastered_words || 0,
          is_unlocked: true,
        }));

        set({ categories: processedCategories });
      }

      if (hasError) {
        set({ error: "Một số dữ liệu không thể tải được" });
      }

      set({ lastRefreshTime: Date.now() });
    } catch (error) {
      console.error("Error initializing user data:", error);
      set({ error: "Không thể tải dữ liệu người dùng" });
    } finally {
      set((state) => ({
        loadingStates: {
          ...state.loadingStates,
          initializing: false,
          categories: false,
          userLevel: false,
        },
      }));
    }
  },

  // Rest của methods giữ nguyên...
  fetchVocabularyByTopic: async (axios, topicId) => {
    try {
      get().setLoadingState("topicVocabularies", true);

      // Parallel fetch vocabularies và topic details
      const [vocabResult, topicResult] = await Promise.allSettled([
        axios.get(`/api/vocabulary/topic/${topicId}`),
        axios.get(`/api/vocabulary/topicDetails/${topicId}`),
      ]);

      // Process vocabulary data
      if (vocabResult.status === "rejected") {
        throw new Error("Failed to fetch vocabularies");
      }

      const vocabularies = vocabResult.value.data.data;

      // Process topic data with fallbacks
      let currentTopic = get().categories.find(
        (category) => category.topic_id === topicId
      );

      // Use API response if available and no cached topic
      if (!currentTopic && topicResult.status === "fulfilled") {
        const topicData = topicResult.value.data.data;
        currentTopic = {
          topic_id: parseInt(topicId),
          name: topicData.name,
          description: topicData.description,
          image_url: topicData.image_url,
          require_level: topicData.require_level,
          total_words: vocabularies.length,
          points: topicData.points,
          mastered_words: 0,
          progress_percent: 0,
        };
      }

      // Final fallback
      if (!currentTopic && vocabularies.length > 0) {
        const firstVocab = vocabularies[0];
        currentTopic = {
          topic_id: parseInt(topicId),
          name: firstVocab.VocabularyTopic?.name || "Chủ đề",
          description: firstVocab.VocabularyTopic?.description || "",
          image_url: firstVocab.VocabularyTopic?.image_url || "",
          total_words: vocabularies.length,
          require_level: firstVocab.VocabularyTopic?.require_level || 1,
          points: firstVocab.VocabularyTopic?.points || 0,
          mastered_words: 0,
          progress_percent: 0,
        };
      }

      const vocabsWithStatus = vocabularies.map((vocab) => ({
        ...vocab,
        isBookmarked: vocab.VocabularyUsers?.[0]?.is_saved || false,
        isKnown: vocab.VocabularyUsers?.[0]?.had_learned || false,
      }));

      // Update topic progress
      if (currentTopic && vocabsWithStatus.length > 0) {
        const masteredWords = vocabsWithStatus.filter((v) => v.isKnown).length;
        currentTopic = {
          ...currentTopic,
          total_words: vocabsWithStatus.length,
          mastered_words: masteredWords,
          progress_percent: Math.round(
            (masteredWords / vocabsWithStatus.length) * 100
          ),
        };
      }

      set({
        currentTopic: currentTopic,
        topicVocabularies: vocabsWithStatus,
      });

      return { vocabularies: vocabsWithStatus, topic: currentTopic };
    } catch (error) {
      console.error("Error fetching topic vocabularies:", error);
      set({ error: "Không thể tải danh sách từ vựng cho chủ đề này" });
      throw error;
    } finally {
      get().setLoadingState("topicVocabularies", false);
    }
  },

  // PARALLEL OPTIMIZED: Level check với achievement fetch
  refreshUserLevel: async (axios) => {
    try {
      const oldLevel = get().userLevel.current_level;

      // Check level with current points
      const response = await axios.post("/api/vocabulary/checkLevelUser", {
        new_points: 0,
      });
      const levelData = response.data.data;

      const progressPercent = Math.round(
        (parseInt(levelData.total_points) /
          parseInt(levelData.levelThreshold)) *
          100
      );

      const updatedUserLevel = {
        current_level: parseInt(levelData.current_level),
        total_points: parseInt(levelData.total_points),
        levelThreshold: parseInt(levelData.levelThreshold),
        progress_percent: Math.min(progressPercent, 100),
        full_name: levelData.full_name,
        email: levelData.email,
        profile_picture: levelData.profile_picture,
        username: levelData.username,
        user_id: levelData.user_id,
        is_active: levelData.is_active,
        total_words_mastered: 0,
        total_topics_completed: 0,
      };

      set({ userLevel: updatedUserLevel });

      // Check if leveled up and fetch achievements parallel
      if (updatedUserLevel.current_level > oldLevel) {
        return {
          leveledUp: true,
          oldLevel,
          newLevel: updatedUserLevel.current_level,
          totalPoints: updatedUserLevel.total_points,
        };
      }

      return { leveledUp: false };
    } catch (error) {
      console.error("Error refreshing user level:", error);
      return { leveledUp: false, error: true };
    }
  },

  getNextLevelRewards: async (axios, nextLevel) => {
    try {
      const response = await axios.get(`/api/achievement/level/${nextLevel}`);
      const data = response.data.data;

      if (Array.isArray(data)) {
        return data.map((achievement) => ({
          type: "achievement",
          achievement_id: achievement.achievement_id,
          title: achievement.title,
          description: achievement.description,
          icon: achievement.icon,
          required_level: achievement.required_level,
        }));
      } else if (data && typeof data === "object") {
        return [
          {
            type: "achievement",
            achievement_id: data.achievement_id,
            title: data.title,
            description: data.description,
            icon: data.icon,
            required_level: data.required_level,
          },
        ];
      }

      return [];
    } catch (error) {
      console.error("Error fetching next level rewards:", error);
      return [
        {
          type: "achievement",
          name: `Level ${nextLevel} Achievement`,
          description: `Chúc mừng bạn đã đạt Level ${nextLevel}!`,
          icon: "https://cdn-icons-png.flaticon.com/512/3064/3064197.png",
        },
      ];
    }
  },

  updateCategoryProgress: (topicId, masteredWords) => {
    const currentCategories = get().categories;
    const updatedCategories = currentCategories.map((category) =>
      category.topic_id === topicId
        ? {
            ...category,
            mastered_words: masteredWords,
            progress_percent: Math.round(
              (masteredWords / category.total_words) * 100
            ),
          }
        : category
    );

    set({ categories: updatedCategories });
  },

  // OPTIMIZED: Batch operations
  toggleBookmark: async (axios, vocabulary_id, topic_id) => {
    if (get().loadingStates.bookmarkUpdating.has(vocabulary_id)) return;

    try {
      get().setVocabLoadingState("bookmarkUpdating", vocabulary_id, true);

      const currentVocabs = get().topicVocabularies;
      const vocab = currentVocabs.find((v) => v.vocab_id === vocabulary_id);
      const isCurrentlyBookmarked =
        vocab?.VocabularyUsers?.[0]?.is_saved || vocab?.isBookmarked || false;

      const param = isCurrentlyBookmarked ? 0 : 1;

      // Optimistic update
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

      // API call
      await axios.post("/api/vocabulary/updateVocabularyUser", {
        vocabulary_id,
        is_saved: param,
        topic_id,
      });

      return !isCurrentlyBookmarked;
    } catch (error) {
      console.error("Error toggling bookmark:", error);
      // Rollback optimistic update
      const currentVocabs = get().topicVocabularies;
      const revertedVocabs = currentVocabs.map((v) =>
        v.vocab_id === vocabulary_id
          ? {
              ...v,
              VocabularyUsers: [
                {
                  ...(v.VocabularyUsers?.[0] || {}),
                  is_saved: !v.isBookmarked ? 1 : 0,
                },
              ],
              isBookmarked: !v.isBookmarked,
            }
          : v
      );
      set({ topicVocabularies: revertedVocabs });
      throw error;
    } finally {
      get().setVocabLoadingState("bookmarkUpdating", vocabulary_id, false);
    }
  },

  createFlashcardSet: async (axios, topic_id) => {
    try {
      get().setLoadingState("flashcardCreate", true);

      const response = await axios.get(`/api/vocabulary/flashcard/${topic_id}`);

      const newFlashcardSet = response.data.data;

      set({
        flashcardSets: [...get().flashcardSets, newFlashcardSet],
      });

      return newFlashcardSet;
    } catch (error) {
      console.error("Error creating flashcard set:", error);
      set({
        error: "Không thể tạo bộ flashcard",
      });
      throw error;
    } finally {
      get().setLoadingState("flashcardCreate", false);
    }
  },

  updateLearningStatus: async (axios, vocabulary_id, topic_id) => {
    if (get().loadingStates.learningUpdating.has(vocabulary_id)) {
      return;
    }

    try {
      get().setVocabLoadingState("learningUpdating", vocabulary_id, true);

      const currentVocabs = get().topicVocabularies;
      const vocab = currentVocabs.find((v) => v.vocab_id === vocabulary_id);

      if (!vocab) throw new Error("Vocabulary not found");

      const isCurrentlyLearned =
        vocab?.VocabularyUsers?.[0]?.had_learned || vocab?.isKnown || false;
      const param = isCurrentlyLearned ? 0 : 1;

      // Optimistic update
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

      // Update category progress
      const newMasteredCount = updatedVocabs.filter(
        (v) => v.VocabularyUsers?.[0]?.had_learned || v.isKnown
      ).length;

      get().updateCategoryProgress(topic_id, newMasteredCount);

      // API call
      await axios.post("/api/vocabulary/updateVocabularyUser", {
        vocabulary_id,
        had_learned: param,
        topic_id,
      });

      return !isCurrentlyLearned;
    } catch (error) {
      console.error("Error updating learning status:", error);
      // Rollback optimistic update
      const currentVocabs = get().topicVocabularies;
      const revertedVocabs = currentVocabs.map((v) =>
        v.vocab_id === vocabulary_id
          ? {
              ...v,
              VocabularyUsers: [
                {
                  ...(v.VocabularyUsers?.[0] || {}),
                  had_learned: !v.isKnown,
                },
              ],
              isKnown: !v.isKnown,
            }
          : v
      );

      set({ topicVocabularies: revertedVocabs });
      throw error;
    } finally {
      setTimeout(() => {
        get().setVocabLoadingState("learningUpdating", vocabulary_id, false);
      }, 300);
    }
  },

  clearError: () => set({ error: null }),
}));

export default useTopicStore;
