import { create } from "zustand";

const useAdminStore = create((set, get) => ({
  // Loading states
  loading: {
    users: false,
    topics: false,
    vocabularies: false,
    userAction: false,
    topicAction: false,
    vocabularyAction: false,
  },

  // Data states
  users: [],
  topics: [],
  vocabularies: [],
  
  // Selected items for editing
  selectedUser: null,
  selectedTopic: null,
  selectedVocabulary: null,

  // Pagination & filters
  pagination: {
    users: { page: 1, limit: 10, total: 0 },
    topics: { page: 1, limit: 10, total: 0 },
    vocabularies: { page: 1, limit: 10, total: 0 },
  },
  
  filters: {
    users: { search: "", status: "all" },
    topics: { search: "", category: "all" },
    vocabularies: { search: "", topic: "all" },
  },

  // Set loading state
  setLoading: (type, loading) => {
    set((state) => ({
      loading: { ...state.loading, [type]: loading }
    }));
  },

  // User Management Actions
  fetchUsers: async (axios, options = {}) => {
    const { setLoading } = get();
    try {
      setLoading('users', true);
      
      const response = await axios.get('/api/admin/user/all');
      const users = response.data.data || [];
      
      set((state) => ({
        users,
        pagination: {
          ...state.pagination,
          users: {
            page: options.page || 1,
            limit: options.limit || 10,
            total: users.length
          }
        }
      }));
      
      return users;
    } catch (error) {
      console.error('Error fetching users:', error);
      set({ users: [] });
      throw error;
    } finally {
      setLoading('users', false);
    }
  },

  blockUser: async (axios, userId) => {
    const { setLoading, fetchUsers } = get();
    try {
      setLoading('userAction', true);
      
      await axios.post(`/api/admin/user/block/${userId}`);
      
      // Refresh users list
      await fetchUsers(axios);
      
      return true;
    } catch (error) {
      console.error('Error blocking user:', error);
      throw error;
    } finally {
      setLoading('userAction', false);
    }
  },

  unblockUser: async (axios, userId) => {
    const { setLoading, fetchUsers } = get();
    try {
      setLoading('userAction', true);
      
      await axios.post(`/api/admin/user/unblock/${userId}`);
      
      // Refresh users list
      await fetchUsers(axios);
      
      return true;
    } catch (error) {
      console.error('Error unblocking user:', error);
      throw error;
    } finally {
      setLoading('userAction', false);
    }
  },

  getUserById: async (axios, userId) => {
    try {
      const response = await axios.get(`/api/admin/user/${userId}`);
      const user = response.data.data;
      
      set({ selectedUser: user });
      return user;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  },

  // Topic Management Actions
  fetchTopics: async (axios, options = {}) => {
    const { setLoading } = get();
    try {
      setLoading('topics', true);
      
      const response = await axios.get('/api/admin/topic/all');
      const topics = response.data.data || [];
      
      set({ topics });
      return topics;
    } catch (error) {
      console.error('Error fetching topics:', error);
      set({ topics: [] });
      throw error;
    } finally {
      setLoading('topics', false);
    }
  },

  addTopic: async (axios, topicData) => {
    const { setLoading, fetchTopics } = get();
    try {
      setLoading('topicAction', true);
      
      const response = await axios.post('/api/admin/topic/add', topicData);
      
      // Refresh topics list
      await fetchTopics(axios);
      
      return response.data.data;
    } catch (error) {
      console.error('Error adding topic:', error);
      throw error;
    } finally {
      setLoading('topicAction', false);
    }
  },

  updateTopic: async (axios, topicId, updateData) => {
    const { setLoading, fetchTopics } = get();
    try {
      setLoading('topicAction', true);
      
      await axios.post(`/api/admin/topic/update/${topicId}`, updateData);
      
      // Refresh topics list
      await fetchTopics(axios);
      
      return true;
    } catch (error) {
      console.error('Error updating topic:', error);
      throw error;
    } finally {
      setLoading('topicAction', false);
    }
  },

  deleteTopic: async (axios, topicId) => {
    const { setLoading, fetchTopics } = get();
    try {
      setLoading('topicAction', true);
      
      await axios.delete(`/api/admin/topic/delete/${topicId}`);
      
      // Refresh topics list
      await fetchTopics(axios);
      
      return true;
    } catch (error) {
      console.error('Error deleting topic:', error);
      throw error;
    } finally {
      setLoading('topicAction', false);
    }
  },

  getTopicById: async (axios, topicId) => {
    try {
      const response = await axios.get(`/api/admin/topic/${topicId}`);
      const topic = response.data.data;
      
      set({ selectedTopic: topic });
      return topic;
    } catch (error) {
      console.error('Error fetching topic:', error);
      throw error;
    }
  },

  // Vocabulary Management Actions
  fetchVocabularies: async (axios, options = {}) => {
    const { setLoading } = get();
    try {
      setLoading('vocabularies', true);
      
      const response = await axios.get('/api/admin/vocabulary/all');
      const vocabularies = response.data.data || [];
      
      set({ vocabularies });
      return vocabularies;
    } catch (error) {
      console.error('Error fetching vocabularies:', error);
      set({ vocabularies: [] });
      throw error;
    } finally {
      setLoading('vocabularies', false);
    }
  },

  addVocabulary: async (axios, vocabularyData) => {
    const { setLoading, fetchVocabularies } = get();
    try {
      setLoading('vocabularyAction', true);
      
      // Backend expects array format for bulk operations
      const dataToSend = Array.isArray(vocabularyData) ? vocabularyData : [vocabularyData];
      
      await axios.post('/api/admin/vocabulary/add', dataToSend);
      
      // Refresh vocabularies list
      await fetchVocabularies(axios);
      
      return true;
    } catch (error) {
      console.error('Error adding vocabulary:', error);
      throw error;
    } finally {
      setLoading('vocabularyAction', false);
    }
  },

  updateVocabulary: async (axios, vocabularyId, updateData) => {
    const { setLoading, fetchVocabularies } = get();
    try {
      setLoading('vocabularyAction', true);
      
      await axios.post(`/api/admin/vocabulary/update/${vocabularyId}`, updateData);
      
      // Refresh vocabularies list
      await fetchVocabularies(axios);
      
      return true;
    } catch (error) {
      console.error('Error updating vocabulary:', error);
      throw error;
    } finally {
      setLoading('vocabularyAction', false);
    }
  },

  deleteVocabulary: async (axios, vocabularyId) => {
    const { setLoading, fetchVocabularies } = get();
    try {
      setLoading('vocabularyAction', true);
      
      await axios.delete(`/api/admin/vocabulary/delete/${vocabularyId}`);
      
      // Refresh vocabularies list
      await fetchVocabularies(axios);
      
      return true;
    } catch (error) {
      console.error('Error deleting vocabulary:', error);
      throw error;
    } finally {
      setLoading('vocabularyAction', false);
    }
  },

  getVocabularyById: async (axios, vocabularyId) => {
    try {
      const response = await axios.get(`/api/admin/vocabulary/${vocabularyId}`);
      const vocabulary = response.data.data;
      
      set({ selectedVocabulary: vocabulary });
      return vocabulary;
    } catch (error) {
      console.error('Error fetching vocabulary:', error);
      throw error;
    }
  },

  // Optimized parallel operations for dashboard
  fetchDashboardData: async (axios) => {
    const { setLoading } = get();
    
    try {
      // Set all loading states
      setLoading('users', true);
      setLoading('topics', true);
      setLoading('vocabularies', true);
      
      // Fetch all data in parallel using Promise.allSettled for error handling
      const [usersResult, topicsResult, vocabulariesResult] = await Promise.allSettled([
        axios.get('/api/admin/user/all'),
        axios.get('/api/admin/topic/all'),
        axios.get('/api/admin/vocabulary/all')
      ]);

      // Process results safely
      const users = usersResult.status === 'fulfilled' ? (usersResult.value.data.data || []) : [];
      const topics = topicsResult.status === 'fulfilled' ? (topicsResult.value.data.data || []) : [];
      const vocabularies = vocabulariesResult.status === 'fulfilled' ? (vocabulariesResult.value.data.data || []) : [];

      // Update state with all data
      set({
        users,
        topics,
        vocabularies
      });

      return { users, topics, vocabularies };
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Set empty arrays in case of error
      set({
        users: [],
        topics: [],
        vocabularies: []
      });
      throw error;
    } finally {
      // Reset all loading states
      setLoading('users', false);
      setLoading('topics', false);
      setLoading('vocabularies', false);
    }
  },

  // Batch operations
  batchDeleteUsers: async (axios, userIds) => {
    const { setLoading, fetchUsers } = get();
    try {
      setLoading('userAction', true);
      
      // Process deletions in parallel
      await Promise.all(
        userIds.map(userId => axios.post(`/api/admin/user/block/${userId}`))
      );
      
      await fetchUsers(axios);
      return true;
    } catch (error) {
      console.error('Error batch deleting users:', error);
      throw error;
    } finally {
      setLoading('userAction', false);
    }
  },

  batchDeleteTopics: async (axios, topicIds) => {
    const { setLoading, fetchTopics } = get();
    try {
      setLoading('topicAction', true);
      
      await Promise.all(
        topicIds.map(topicId => axios.delete(`/api/admin/topic/delete/${topicId}`))
      );
      
      await fetchTopics(axios);
      return true;
    } catch (error) {
      console.error('Error batch deleting topics:', error);
      throw error;
    } finally {
      setLoading('topicAction', false);
    }
  },

  batchDeleteVocabularies: async (axios, vocabularyIds) => {
    const { setLoading, fetchVocabularies } = get();
    try {
      setLoading('vocabularyAction', true);
      
      await Promise.all(
        vocabularyIds.map(vocabId => axios.delete(`/api/admin/vocabulary/delete/${vocabId}`))
      );
      
      await fetchVocabularies(axios);
      return true;
    } catch (error) {
      console.error('Error batch deleting vocabularies:', error);
      throw error;
    } finally {
      setLoading('vocabularyAction', false);
    }
  },

  // Reset states
  resetSelectedUser: () => set({ selectedUser: null }),
  resetSelectedTopic: () => set({ selectedTopic: null }),
  resetSelectedVocabulary: () => set({ selectedVocabulary: null }),
  resetAllSelected: () => set({
    selectedUser: null,
    selectedTopic: null,
    selectedVocabulary: null
  }),

  // Update filters
  updateFilter: (type, filterData) => {
    set((state) => ({
      filters: {
        ...state.filters,
        [type]: { ...state.filters[type], ...filterData }
      }
    }));
  },

  // Clear all data
  clearAllData: () => set({
    users: [],
    topics: [],
    vocabularies: [],
    selectedUser: null,
    selectedTopic: null,
    selectedVocabulary: null
  }),
}));

export default useAdminStore;