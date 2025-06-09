import { create } from "zustand";

const useTopicStore = create((set, get) => ({
  // Topic/Category data
  categories: [],
  currentTopic: null,
  topicVocabularies: [],
  // Thêm lastRefreshTime để track lần refresh gần nhất
  lastRefreshTime: 0,

  // Thêm flag để detect khi cần refresh
  needsRefresh: false,

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

  loadingStates: {
    categories: false,
    userLevel: false,
    topicVocabularies: false,
    flashcardCreate: false,
    // Thay đổi: track loading theo vocabulary ID
    bookmarkUpdating: new Set(), // Set chứa các vocab_id đang update bookmark
    learningUpdating: new Set(), // Set chứa các vocab_id đang update learning
  },
  error: null,

  // Bookmarks
  bookmarkedVocabularies: [],

  // Flashcard sets
  flashcardSets: [],

  markNeedsRefresh: () => {
    set({ needsRefresh: true });
  },

  setLoadingState: (key, value) =>
    set((state) => ({
      loadingStates: {
        ...state.loadingStates,
        [key]: value,
      },
    })),

  hasTopicTestCompleted: (topicId) => {
    return get().completedTopicTests.has(topicId);
  },

  markTopicTestCompleted: (topicId) => {
    const currentCompleted = get().completedTopicTests;
    const newCompleted = new Set([...currentCompleted, topicId]);

    set({
      completedTopicTests: newCompleted,
    });

    // Lưu vào localStorage để persist với user-specific key
    const { userLevel } = get();
    if (userLevel.user_id) {
      localStorage.setItem(
        `topic_tests_completed_${userLevel.user_id}`,
        JSON.stringify([...newCompleted])
      );
    }
  },

  loadCompletedTopicTests: (userId) => {
    try {
      const completed = JSON.parse(
        localStorage.getItem(`topic_tests_completed_${userId}`) || "[]"
      );

      set({
        completedTopicTests: new Set(completed),
      });

      console.log(
        `📖 Loaded ${completed.length} completed tests for user ${userId}`
      );
    } catch (error) {
      console.error("Error loading completed topic tests:", error);
      set({
        completedTopicTests: new Set(),
      });
    }
  },

  refreshTestStatus: (userId) => {
    if (!userId) return;

    const { loadCompletedTopicTests } = get();
    loadCompletedTopicTests(userId);
  },

  // Thêm methods để quản lý loading theo vocabulary ID
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

  // Helper methods để check loading state
  isBookmarkUpdating: (vocabId) =>
    get().loadingStates.bookmarkUpdating.has(vocabId),
  isLearningUpdating: (vocabId) =>
    get().loadingStates.learningUpdating.has(vocabId),

  // Actions
  fetchCategories: async (axios) => {
    try {
      get().setLoadingState("categories", true);
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
      });
    } catch (error) {
      console.error("Error fetching categories:", error);
      set({
        error: "Không thể tải danh sách chủ đề",
      });
    } finally {
      get().setLoadingState("categories", false);
    }
  },

  checkLevel: async (axios, points = 0) => {
    try {
      get().setLoadingState("userLevel", true);

      const params = points > 0 ? { new_points: points } : { new_points: 0 };

      const response = await axios.post(
        "/api/vocabulary/checkLevelUser",
        params
      );
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
        total_words_mastered: 0,
        total_topics_completed: 0,
      };

      set({
        userLevel: updatedUserLevel,
      });

      // Load completed topic tests
      get().loadCompletedTopicTests(data.user_id);

      get().updateCategoriesUnlockStatus(updatedUserLevel.current_level);

      return updatedUserLevel;
    } catch (error) {
      console.error("Error checking user level:", error);
      set({
        error: "Không thể tải thông tin cấp độ người dùng",
      });
      throw error;
    } finally {
      get().setLoadingState("userLevel", false);
    }
  },

  getNextLevelRewards: async (axios, nextLevel) => {
    try {
      const response = await axios.get(`/api/achievement/level/${nextLevel}`);
      const data = response.data.data;

      return data;
    } catch (error) {
      console.error("Error fetching next level rewards:", error);
      set({
        error: "Không thể tải thông tin cấp độ tiếp theo",
        loading: false,
      });
      throw error;
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

    // Tự động tính lại user stats sau khi update category
    get().calculateUserStats();
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

    // Cập nhật userLevel với stats mới
    set({
      userLevel: {
        ...userLevel,
        total_words_mastered: totalWordsMastered,
        total_topics_completed: totalTopicsCompleted,
      },
    });

    return {
      totalWordsMastered,
      totalTopicsCompleted,
    };
  },

  refreshUserStats: async (axios) => {
    try {
      await get().fetchCategories(axios);
      get().calculateUserStats();
    } catch (error) {
      console.error("Error refreshing user stats:", error);
    }
  },

  toggleBookmark: async (axios, vocabulary_id, topic_id) => {
    try {
      // Set loading cho vocabulary cụ thể
      get().setVocabLoadingState("bookmarkUpdating", vocabulary_id, true);

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
    } finally {
      // Clear loading cho vocabulary cụ thể
      get().setVocabLoadingState("bookmarkUpdating", vocabulary_id, false);
    }
  },

  updateLearningStatus: async (axios, vocabulary_id, topic_id) => {
    // Check nếu đang process vocabulary này rồi thì skip
    if (get().loadingStates.learningUpdating.has(vocabulary_id)) {
      console.log(
        `Already processing vocabulary ${vocabulary_id}, skipping...`
      );
      return;
    }

    try {
      // Set loading cho vocabulary cụ thể
      get().setVocabLoadingState("learningUpdating", vocabulary_id, true);

      const currentVocabs = get().topicVocabularies;
      const vocab = currentVocabs.find((v) => v.vocab_id === vocabulary_id);

      if (!vocab) {
        throw new Error("Vocabulary not found");
      }

      const isCurrentlyLearned =
        vocab?.VocabularyUsers?.[0]?.had_learned || vocab?.isKnown || false;

      const param = isCurrentlyLearned ? 0 : 1;

      // Optimistic update - cập nhật UI ngay lập tức
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

      // Cập nhật category progress ngay lập tức (sẽ trigger calculateUserStats)
      const newMasteredCount = updatedVocabs.filter(
        (v) => v.VocabularyUsers?.[0]?.had_learned || v.isKnown
      ).length;

      get().updateCategoryProgress(topic_id, newMasteredCount);

      // Gọi API để sync với server
      const apiCall = async () => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);

        try {
          const response = await axios.post(
            "/api/vocabulary/updateVocabularyUser",
            {
              vocabulary_id,
              had_learned: param,
              topic_id,
            },
            {
              signal: controller.signal,
            }
          );
          clearTimeout(timeoutId);
          return response;
        } catch (error) {
          clearTimeout(timeoutId);
          throw error;
        }
      };

      await apiCall();

      if (typeof window !== "undefined") {
        localStorage.setItem("user_data_updated", Date.now().toString());
        // Remove sau 1 giây để cleanup
        setTimeout(() => {
          localStorage.removeItem("user_data_updated");
        }, 1000);
      }

      return !isCurrentlyLearned;
    } catch (error) {
      console.error("Error updating learning status:", error);

      // Rollback optimistic update nếu API fail
      const currentVocabs = get().topicVocabularies;
      const originalVocab = currentVocabs.find(
        (v) => v.vocab_id === vocabulary_id
      );

      if (originalVocab) {
        const revertedVocabs = currentVocabs.map((v) =>
          v.vocab_id === vocabulary_id
            ? {
                ...v,
                VocabularyUsers: [
                  {
                    ...(v.VocabularyUsers?.[0] || {}),
                    had_learned: !v.isKnown, // Revert lại
                  },
                ],
                isKnown: !v.isKnown, // Revert lại
              }
            : v
        );

        set({ topicVocabularies: revertedVocabs });

        // Revert category progress (sẽ trigger calculateUserStats)
        const revertedMasteredCount = revertedVocabs.filter(
          (v) => v.VocabularyUsers?.[0]?.had_learned || v.isKnown
        ).length;

        get().updateCategoryProgress(topic_id, revertedMasteredCount);
      }

      throw error;
    } finally {
      // Clear loading cho vocabulary cụ thể với delay để tránh rapid clicks
      setTimeout(() => {
        get().setVocabLoadingState("learningUpdating", vocabulary_id, false);
      }, 300);
    }
  },

  // Thêm method để sync categories khi cần thiết
  syncCategoryProgress: async (axios, topicId) => {
    try {
      const currentTopic = get().currentTopic;
      if (currentTopic && currentTopic.topic_id === topicId) {
        const masteredWords = get().topicVocabularies.filter(
          (v) => v.VocabularyUsers?.[0]?.had_learned || v.isKnown
        ).length;

        get().updateCategoryProgress(topicId, masteredWords);
      }
    } catch (error) {
      console.error("Error syncing category progress:", error);
    }
  },

  fetchVocabularyByTopic: async (axios, topicId) => {
    try {
      get().setLoadingState("topicVocabularies", true);

      // Fetch vocabularies và topic info song song để tối ưu performance
      const [vocabResponse, topicInfoResponse] = await Promise.allSettled([
        axios.get(`/api/vocabulary/topic/${topicId}`),
        axios.get(`/api/vocabulary/topicDetails/${topicId}`),
      ]);

      // Xử lý vocabularies
      if (vocabResponse.status === "rejected") {
        throw new Error("Failed to fetch vocabularies");
      }
      const vocabularies = vocabResponse.value.data.data;

      // Xử lý topic info
      let currentTopic = null;

      // Thử tìm trong categories trước (nếu đã load)
      const categoriesLoaded = get().categories.length > 0;
      if (categoriesLoaded) {
        currentTopic = get().categories.find(
          (category) => category.topic_id === topicId
        );
      }

      // Nếu không tìm thấy trong categories hoặc categories chưa load, dùng API
      if (!currentTopic) {
        if (topicInfoResponse.status === "fulfilled") {
          const topicData = topicInfoResponse.value.data.data;
          currentTopic = {
            topic_id: topicId,
            name: topicData.name,
            description: topicData.description,
            image_url: topicData.image_url,
            require_level: topicData.require_level,
            total_words: topicData.total_words,
            points: topicData.points,
            mastered_words: 0, // Sẽ được tính từ vocabularies
            progress_percent: 0, // Sẽ được tính từ vocabularies
          };
        } else {
          // Fallback: tạo topic info từ vocabulary data
          if (vocabularies.length > 0) {
            const firstVocab = vocabularies[0];
            currentTopic = {
              topic_id: topicId,
              name: firstVocab.VocabularyTopic?.name || "Chủ đề",
              description: firstVocab.VocabularyTopic?.description || "",
              image_url: firstVocab.VocabularyTopic?.image_url || "",
              total_words: vocabularies.length,
              require_level: firstVocab.VocabularyTopic?.require_level || 1,
              points: firstVocab.VocabularyTopic?.points || 0,
              mastered_words: 0,
              progress_percent: 0,
            };
          } else {
            // Fallback cuối cùng
            currentTopic = {
              topic_id: topicId,
              name: "Chủ đề",
              description: "Đang tải thông tin chủ đề...",
              image_url: "",
              total_words: 0,
              require_level: 1,
              points: 0,
              mastered_words: 0,
              progress_percent: 0,
            };
          }
        }
      }

      // Process vocabularies với status
      const vocabsWithStatus = vocabularies.map((vocab) => ({
        ...vocab,
        isBookmarked: vocab.VocabularyUsers?.[0]?.is_saved || false,
        isKnown: vocab.VocabularyUsers?.[0]?.had_learned || false,
      }));

      // Tính toán lại mastered_words và progress_percent
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

      // Nếu categories chưa load và chúng ta có topic info, thêm vào categories
      if (!categoriesLoaded && currentTopic) {
        set({
          categories: [currentTopic],
        });
      }

      return { vocabularies: vocabsWithStatus, topic: currentTopic };
    } catch (error) {
      console.error("Error fetching topic vocabularies:", error);
      set({
        error: "Không thể tải danh sách từ vựng cho chủ đề này",
      });
      throw error;
    } finally {
      get().setLoadingState("topicVocabularies", false);
    }
  },

  createFlashcardSet: async (axios, { topicId, name, vocabularyIds }) => {
    try {
      get().setLoadingState("flashcardCreate", true);

      const response = await axios.post("/api/flashcards/create", {
        topicId,
        name,
        vocabularyIds,
      });

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

  initializeUserData: async (axios, forceRefresh = false) => {
    try {
      const state = get();
      const now = Date.now();
      const timeSinceLastRefresh = now - state.lastRefreshTime;
      const shouldRefresh =
        forceRefresh ||
        state.needsRefresh ||
        timeSinceLastRefresh > 60000 || // Refresh mỗi 1 phút
        !state.categories.length ||
        !state.userLevel.user_id;

      if (!shouldRefresh) {
        return;
      }

      console.log("🔄 Refreshing user data...");

      // Clear error và needsRefresh flag
      set({ error: null, needsRefresh: false });

      // Thực hiện fetch song song với timeout
      const fetchWithTimeout = (promise, timeout = 10000) => {
        return Promise.race([
          promise,
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Request timeout")), timeout)
          ),
        ]);
      };

      const promises = [
        fetchWithTimeout(get().fetchCategories(axios)),
        fetchWithTimeout(get().checkLevel(axios)),
      ];

      const results = await Promise.allSettled(promises);

      // Xử lý kết quả
      let hasError = false;
      let errorMessage = "";

      if (results[0].status === "rejected") {
        console.error("Failed to fetch categories:", results[0].reason);
        hasError = true;
        errorMessage = "Không thể tải danh sách chủ đề";
      }

      if (results[1].status === "rejected") {
        console.error("Failed to fetch user level:", results[1].reason);
        if (!hasError) {
          errorMessage = "Không thể tải thông tin cấp độ";
        } else {
          errorMessage = "Không thể tải dữ liệu người dùng";
        }
        hasError = true;
      }

      // Nếu có ít nhất 1 request thành công, tính toán stats
      if (
        !hasError ||
        results[0].status === "fulfilled" ||
        results[1].status === "fulfilled"
      ) {
        get().calculateUserStats();

        // Update lastRefreshTime
        set({ lastRefreshTime: now });
      }

      // Chỉ set error nếu cả 2 requests đều fail
      if (
        results[0].status === "rejected" &&
        results[1].status === "rejected"
      ) {
        set({ error: errorMessage });
      }
    } catch (error) {
      console.error("Error initializing user data:", error);
      set({
        error: "Không thể tải dữ liệu người dùng",
      });
    }
  },

  refreshUserLevel: async (axios) => {
    try {
      const oldLevel = get().userLevel.current_level;

      // Gọi API với error handling tốt hơn
      const updatedLevel = await get().checkLevel(axios, 0);

      // Trả về thông tin level up nếu có
      if (updatedLevel.current_level > oldLevel) {
        // Refresh categories sau khi level up để unlock topics mới
        setTimeout(() => {
          get().fetchCategories(axios);
        }, 100);

        return {
          leveledUp: true,
          oldLevel,
          newLevel: updatedLevel.current_level,
          totalPoints: updatedLevel.total_points,
        };
      }

      return { leveledUp: false };
    } catch (error) {
      console.error("Error refreshing user level:", error);

      // Nếu lỗi level check, chỉ log và không throw để không break UI
      return { leveledUp: false, error: true };
    }
  },

  reset: () => {
    set({
      categories: [],
      topicVocabularies: [],
      completedTopicTests: new Set(),
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
      loadingStates: {
        categories: false,
        userLevel: false,
        topicVocabularies: false,
        flashcardCreate: false,
        bookmarkUpdating: new Set(),
        learningUpdating: new Set(),
      },
      error: null,
      bookmarkedVocabularies: [],
      flashcardSets: [],
    });
  },

  // Clear error
  clearError: () => set({ error: null }),
}));

if (typeof window !== "undefined") {
  window.addEventListener("focus", () => {
    const { markNeedsRefresh } = useTopicStore.getState();
    markNeedsRefresh();
  });

  // Listen for browser back/forward navigation
  window.addEventListener("popstate", () => {
    const { markNeedsRefresh } = useTopicStore.getState();
    markNeedsRefresh();
  });
}

export default useTopicStore;
