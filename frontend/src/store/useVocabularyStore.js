import { create } from 'zustand';

const useVocabularyStore = create((set, get) => ({
  categories: [],
  vocabularySets: [],
  searchTerm: '',
  translationType: 'Japanese',
  loading: false,
  error: null,
  
  // Modal state
  isSearchModalOpen: false,
  searchResults: [],

  currentWord: null,
  selectedWord: null,
  relatedWords: [],
  aiExplain: null,
  
  // Basic actions
  setSearchTerm: (term) => set({ searchTerm: term }),
  setTranslationType: (type) => set({ translationType: type }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setCategories: (categories) => set({ categories }),
  setVocabularySets: (sets) => set({ vocabularySets: sets }),
  
  // Modal actions
  openSearchModal: () => set({ isSearchModalOpen: true }),
  closeSearchModal: () => set({ isSearchModalOpen: false }),
  
  // Normalize vocabulary data to ensure consistent structure
  normalizeVocabularyData: (data) => {
    if (!data) return null;
    
    // If data has Vocabulary property, extract it
    if (data.Vocabulary) {
      return {
        vocab_id: data.vocab_id || data.Vocabulary.vocab_id,
        word: data.Vocabulary.word,
        pronunciation: data.Vocabulary.pronunciation,
        meaning: data.Vocabulary.meaning,
        usage: data.Vocabulary.usage,
        example: data.Vocabulary.example,
        example_meaning: data.Vocabulary.example_meaning,
        level: data.Vocabulary.level || data.level,
        searched_at: data.searched_at,
        ai_suggested: data?.ai_suggested === true ? true : false
      };
    }
    
    // If data is already in the expected format
    return {
      vocab_id: data.vocab_id,
      word: data.word,
      pronunciation: data.pronunciation,
      meaning: data.meaning,
      usage: data.usage,
      example: data.example,
      example_meaning: data.example_meaning,
      level: data.level,
      searched_at: data.searched_at,
      ai_suggested: data?.ai_suggested === true ? true : false
    };
  },
  
  // Set search results with normalized data
  setSearchResults: (results) => {
    const normalizedResults = results.map(result => 
      get().normalizeVocabularyData(result)
    );
    set({ searchResults: normalizedResults });
  },
  
  // Set selected word with normalized data
  setSelectedWord: (word) => {
    if (!word) {
      set({ selectedWord: null });
      return;
    }
    
    const normalizedWord = get().normalizeVocabularyData(word);
    set({ selectedWord: normalizedWord });
  },
  
  fetchCategories: async (axios) => {
    try {
      const response = await axios.get('/api/vocabulary/allTopic');
      const data = response.data.data;
      set({ categories: data });
    } catch (error) {
      set({ error: 'Không thể tải danh sách chủ đề' });
    }
  },

  addHistorySearch: async (axios, vocabulary_id) => {
    try {
      await axios.post('api/vocabulary/addHistorySearch', {
        vocabulary_id: vocabulary_id,
      }); 
    } catch (error) {
      set({ error: 'Không thể thêm vào lịch sử tìm kiếm' });
    }
  },

  getHistorySearch: async (axios) => {
    try {
      const response = await axios.get('api/vocabulary/historySearch');
      
      // Normalize history data
      const normalizedData = response.data.data.map(item => ({
        ...item,
        Vocabulary: item.Vocabulary // Keep the original structure for compatibility
      }));
      
      set({ relatedWords: normalizedData });
    } catch (error) {
      set({ error: 'Không thể lấy lịch sử tìm kiếm' }); 
    }
  },

  fetchAIExplain: async (axios, word) => {
    try {
      const response = await axios.post('/api/vocabulary/al', {
        word: word,
        language: get().translationType,
      });
      
      const aiData = response.data.data;
      set({ 
        aiExplain: {
          ...aiData,
          ai_suggested: true
        } 
      });
      
      return aiData;
    } catch (error) {
      set({ error: 'Không thể lấy giải thích từ AI' });
      throw error;
    }
  },

  // Search vocabulary with normalized responses
  searchVocabulary: async (axios, term = '') => {
    const { translationType } = get();
    if (!term?.trim()) {
      set({ searchResults: [], vocabularySets: [], isSearchModalOpen: false });
      return;
    }

    try {
      set({ loading: true, error: null });
      
      const response = await axios.post('api/vocabulary/similar', {
        word: term,
        language: translationType
      });
      
      const results = response.data.data;
      
      // Normalize the data
      const normalizedResults = results.map(result => 
        get().normalizeVocabularyData(result)
      );

      set({ 
        searchResults: normalizedResults,
        vocabularySets: normalizedResults,
        isSearchModalOpen: true 
      });

      if (results.length > 0) {
        await get().addHistorySearch(axios, results[0].vocab_id);
      }
      
      return normalizedResults;
    } catch (error) {
      set({ error: 'Có lỗi xảy ra khi tìm kiếm' });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  // Action để thay đổi kiểu dịch
  setTranslationType: (axios, type) => {
    set({ translationType: type });
    // Tự động tìm kiếm lại với kiểu dịch mới
    const { searchTerm } = get();
    if (searchTerm) {
      get().searchVocabulary(axios, searchTerm);
    }
  }
}));

export default useVocabularyStore;