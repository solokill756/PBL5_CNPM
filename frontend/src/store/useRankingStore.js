// import { create } from "zustand";

// const useRankingStore = create((set, get) => ({
//   // Ranking data
//   rankings: [],
//   currentUserRank: null,
  
//   // Filters
//   timeFilter: 'all', // 'all', 'weekly', 'monthly'
  
//   // Loading states
//   loadingStates: {
//     rankings: false,
//     refreshing: false,
//   },
  
//   error: null,
//   lastFetchTime: 0,

//   // Actions
//   setLoadingState: (key, value) =>
//     set((state) => ({
//       loadingStates: {
//         ...state.loadingStates,
//         [key]: value,
//       },
//     })),

//   setError: (error) => set({ error }),
//   clearError: () => set({ error: null }),

//   setTimeFilter: (filter) => {
//     set({ timeFilter: filter });
//     // Auto refresh when filter changes
//     const { fetchRankings } = get();
//     const axios = get().lastAxiosInstance;
//     if (axios) {
//       fetchRankings(axios);
//     }
//   },

//   // Store axios instance for auto-refresh
//   lastAxiosInstance: null,
//   setAxiosInstance: (axios) => set({ lastAxiosInstance: axios }),

//   // Fetch rankings
//   fetchRankings: async (axios, forceRefresh = false) => {
//     const now = Date.now();
//     const { lastFetchTime, timeFilter } = get();
    
//     // Skip if fetched recently (unless forced)
//     if (!forceRefresh && now - lastFetchTime < 30000) {
//       return;
//     }

//     try {
//       set({ lastAxiosInstance: axios });
//       get().setLoadingState('rankings', true);
//       get().clearError();

//       // Mock API call - replace with actual endpoint
//       const response = await axios.get(`/api/ranking?period=${timeFilter}`);
//       const data = response.data.data;

//       // Process ranking data
//       const processedRankings = data.rankings.map((user, index) => ({
//         rank: index + 1,
//         user_id: user.user_id,
//         username: user.username,
//         full_name: user.full_name,
//         profile_picture: user.profile_picture,
//         total_points: parseInt(user.total_points) || 0,
//         level: parseInt(user.current_level) || 1,
//         words_mastered: parseInt(user.total_words_mastered) || 0,
//         topics_completed: parseInt(user.total_topics_completed) || 0,
//         is_current_user: user.user_id === data.current_user_id,
//       }));

//       // Find current user rank
//       const currentUserRank = processedRankings.find(user => user.is_current_user);

//       set({
//         rankings: processedRankings,
//         currentUserRank: currentUserRank || null,
//         lastFetchTime: now,
//       });

//       return processedRankings;
//     } catch (error) {
//       console.error('Error fetching rankings:', error);
//       get().setError('Không thể tải bảng xếp hạng');
//       throw error;
//     } finally {
//       get().setLoadingState('rankings', false);
//     }
//   },

//   // Refresh rankings
//   refreshRankings: async (axios) => {
//     try {
//       get().setLoadingState('refreshing', true);
//       await get().fetchRankings(axios, true);
//     } finally {
//       get().setLoadingState('refreshing', false);
//     }
//   },

//   // Initialize rankings
//   initializeRankings: async (axios) => {
//     await get().fetchRankings(axios);
//   },
// }));

// export default useRankingStore;

import { create } from "zustand";

// Mock data for rankings
const mockRankingData = {
  all: [
    {
      user_id: "user-001",
      username: "tanaka_hiroshi",
      full_name: "Tanaka Hiroshi",
      profile_picture: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      total_points: 15750,
      current_level: 8,
      total_words_mastered: 1250,
      total_topics_completed: 12,
    },
    {
      user_id: "user-002",
      username: "nguyen_minh",
      full_name: "Nguyễn Văn Minh",
      profile_picture: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      total_points: 14200,
      current_level: 7,
      total_words_mastered: 1180,
      total_topics_completed: 11,
    },
    {
      user_id: "user-003",
      username: "sakura_yuki",
      full_name: "Sakura Yuki",
      profile_picture: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      total_points: 13890,
      current_level: 7,
      total_words_mastered: 1150,
      total_topics_completed: 10,
    },
    {
      user_id: "user-004",
      username: "le_thanh_long",
      full_name: "Lê Thành Long",
      profile_picture: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
      total_points: 12650,
      current_level: 6,
      total_words_mastered: 980,
      total_topics_completed: 9,
    },
    {
      user_id: "current-user",
      username: "you",
      full_name: "Bạn",
      profile_picture: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face",
      total_points: 11420,
      current_level: 6,
      total_words_mastered: 890,
      total_topics_completed: 8,
    },
    {
      user_id: "user-006",
      username: "kim_sato",
      full_name: "Kim Sato",
      profile_picture: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      total_points: 10980,
      current_level: 5,
      total_words_mastered: 850,
      total_topics_completed: 7,
    },
    {
      user_id: "user-007",
      username: "pham_duc_anh",
      full_name: "Phạm Đức Anh",
      profile_picture: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&h=150&fit=crop&crop=face",
      total_points: 9750,
      current_level: 5,
      total_words_mastered: 780,
      total_topics_completed: 6,
    },
    {
      user_id: "user-008",
      username: "yamada_mei",
      full_name: "Yamada Mei",
      profile_picture: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
      total_points: 8920,
      current_level: 4,
      total_words_mastered: 720,
      total_topics_completed: 6,
    },
    {
      user_id: "user-009",
      username: "tran_hai_dang",
      full_name: "Trần Hải Đăng",
      profile_picture: "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=150&h=150&fit=crop&crop=face",
      total_points: 7650,
      current_level: 4,
      total_words_mastered: 650,
      total_topics_completed: 5,
    },
    {
      user_id: "user-010",
      username: "lisa_watanabe",
      full_name: "Lisa Watanabe",
      profile_picture: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face",
      total_points: 6890,
      current_level: 3,
      total_words_mastered: 580,
      total_topics_completed: 4,
    },
  ],
  monthly: [
    {
      user_id: "user-002",
      username: "nguyen_minh",
      full_name: "Nguyễn Văn Minh",
      profile_picture: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      total_points: 2840,
      current_level: 7,
      total_words_mastered: 320,
      total_topics_completed: 3,
    },
    {
      user_id: "user-003",
      username: "sakura_yuki",
      full_name: "Sakura Yuki",
      profile_picture: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      total_points: 2650,
      current_level: 7,
      total_words_mastered: 290,
      total_topics_completed: 2,
    },
    {
      user_id: "current-user",
      username: "you",
      full_name: "Bạn",
      profile_picture: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face",
      total_points: 2420,
      current_level: 6,
      total_words_mastered: 280,
      total_topics_completed: 2,
    },
    {
      user_id: "user-001",
      username: "tanaka_hiroshi",
      full_name: "Tanaka Hiroshi",
      profile_picture: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      total_points: 2180,
      current_level: 8,
      total_words_mastered: 250,
      total_topics_completed: 2,
    },
    {
      user_id: "user-007",
      username: "pham_duc_anh",
      full_name: "Phạm Đức Anh",
      profile_picture: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&h=150&fit=crop&crop=face",
      total_points: 1950,
      current_level: 5,
      total_words_mastered: 220,
      total_topics_completed: 2,
    },
  ],
  weekly: [
    {
      user_id: "current-user",
      username: "you",
      full_name: "Bạn",
      profile_picture: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face",
      total_points: 680,
      current_level: 6,
      total_words_mastered: 85,
      total_topics_completed: 1,
    },
    {
      user_id: "user-003",
      username: "sakura_yuki",
      full_name: "Sakura Yuki",
      profile_picture: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      total_points: 620,
      current_level: 7,
      total_words_mastered: 78,
      total_topics_completed: 1,
    },
    {
      user_id: "user-007",
      username: "pham_duc_anh",
      full_name: "Phạm Đức Anh",
      profile_picture: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&h=150&fit=crop&crop=face",
      total_points: 580,
      current_level: 5,
      total_words_mastered: 72,
      total_topics_completed: 1,
    },
    {
      user_id: "user-002",
      username: "nguyen_minh",
      full_name: "Nguyễn Văn Minh",
      profile_picture: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      total_points: 520,
      current_level: 7,
      total_words_mastered: 65,
      total_topics_completed: 1,
    },
    {
      user_id: "user-008",
      username: "yamada_mei",
      full_name: "Yamada Mei",
      profile_picture: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
      total_points: 450,
      current_level: 4,
      total_words_mastered: 58,
      total_topics_completed: 1,
    },
  ]
};

const useRankingStore = create((set, get) => ({
  // Ranking data
  rankings: [],
  currentUserRank: null,
  
  // Filters
  timeFilter: 'all', // 'all', 'weekly', 'monthly'
  
  // Loading states
  loadingStates: {
    rankings: false,
    refreshing: false,
  },
  
  error: null,
  lastFetchTime: 0,

  // Actions
  setLoadingState: (key, value) =>
    set((state) => ({
      loadingStates: {
        ...state.loadingStates,
        [key]: value,
      },
    })),

  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),

  setTimeFilter: (filter) => {
    set({ timeFilter: filter });
    // Auto refresh when filter changes
    const { fetchRankings } = get();
    fetchRankings();
  },

  // Fetch rankings (now using mock data)
  fetchRankings: async (forceRefresh = false) => {
    const now = Date.now();
    const { lastFetchTime, timeFilter } = get();
    
    // Skip if fetched recently (unless forced)
    if (!forceRefresh && now - lastFetchTime < 5000) {
      return;
    }

    try {
      get().setLoadingState('rankings', true);
      get().clearError();

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));

      // Get mock data based on time filter
      const rawData = mockRankingData[timeFilter] || mockRankingData.all;

      // Process ranking data
      const processedRankings = rawData.map((user, index) => ({
        rank: index + 1,
        user_id: user.user_id,
        username: user.username,
        full_name: user.full_name,
        profile_picture: user.profile_picture,
        total_points: parseInt(user.total_points) || 0,
        level: parseInt(user.current_level) || 1,
        words_mastered: parseInt(user.total_words_mastered) || 0,
        topics_completed: parseInt(user.total_topics_completed) || 0,
        is_current_user: user.user_id === "current-user",
      }));

      // Find current user rank
      const currentUserRank = processedRankings.find(user => user.is_current_user);

      set({
        rankings: processedRankings,
        currentUserRank: currentUserRank || null,
        lastFetchTime: now,
      });

      return processedRankings;
    } catch (error) {
      console.error('Error fetching rankings:', error);
      get().setError('Không thể tải bảng xếp hạng');
      throw error;
    } finally {
      get().setLoadingState('rankings', false);
    }
  },

  // Refresh rankings
  refreshRankings: async () => {
    try {
      get().setLoadingState('refreshing', true);
      await get().fetchRankings(true);
    } finally {
      get().setLoadingState('refreshing', false);
    }
  },

  // Initialize rankings
  initializeRankings: async () => {
    await get().fetchRankings();
  },
}));

export default useRankingStore;