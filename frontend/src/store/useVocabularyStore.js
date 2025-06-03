import { create } from "zustand";

const useVocabularyStore = create((set, get) => ({
  categories: [],
  vocabularySets: [], // Will store currently displayed vocabularies
  searchTerm: "",
  translationType: "Japanese",
  loading: false,
  error: null,

  // Modal state
  isSearchModalOpen: false,
  searchResults: [], // Will store search results

  currentWord: null,
  selectedWord: null,
  relatedWords: [],
  aiExplain: null,

  // Basic actions
  setSearchTerm: (term) => set({ searchTerm: term }),

  // Clear results (used when changing modes or resetting)
  clearResults: () =>
    set({
      searchResults: [],
      vocabularySets: [],
      isSearchModalOpen: false,
    }),

  setTranslationType: (type) => set({ translationType: type }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setCategories: (categories) => set({ categories }),

  // This function handles both setVocabularySets and setSearchResults together
  updateResults: (results) => {
    if (!results || !Array.isArray(results)) {
      set({ searchResults: [], vocabularySets: [] });
      return;
    }

    const normalizedResults = results.map((result) =>
      get().normalizeVocabularyData(result)
    );

    set({
      searchResults: normalizedResults,
      vocabularySets: normalizedResults,
    });
  },

  // Modal actions
  openSearchModal: () => set({ isSearchModalOpen: true }),
  closeSearchModal: () => set({ isSearchModalOpen: false }),

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
        ai_suggested: data?.ai_suggested === true ? true : false,
        // Thêm các trường mới
        displayWord: data.Vocabulary.displayWord,
        displayMeaning: data.Vocabulary.displayMeaning
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
      ai_suggested: data?.ai_suggested === true ? true : false,
      // Thêm các trường mới
      displayWord: data.displayWord,
      displayMeaning: data.displayMeaning
    };
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
      const response = await axios.get("/api/vocabulary/allTopic");
      const data = response.data.data;
      set({ categories: data });
    } catch (error) {
      set({ error: "Không thể tải danh sách chủ đề" });
    }
  },

  addHistorySearch: async (axios, vocabulary_id) => {
    try {
      await axios.post("api/vocabulary/addHistorySearch", {
        vocabulary_id: vocabulary_id,
      });
    } catch (error) {
      set({ error: "Không thể thêm vào lịch sử tìm kiếm" });
    }
  },

  getHistorySearch: async (axios) => {
    try {
      const response = await axios.get("api/vocabulary/historySearch");

      // Normalize history data
      const normalizedData = response.data.data.map((item) => ({
        ...item,
        Vocabulary: item.Vocabulary, // Keep the original structure for compatibility
      }));

      set({ relatedWords: normalizedData });
    } catch (error) {
      set({ error: "Không thể lấy lịch sử tìm kiếm" });
    }
  },

  // Add this to the store state
  lastSearchWasAI: false,

  fetchAIExplain: async (axios, word) => {
    try {
      const response = await axios.post('/api/vocabulary/al', {
        word: word,
        language: get().translationType,
      });
      
      const aiData = response.data.data;
      
      // Tạo một bản sao của dữ liệu AI
      let processedAiData = {...aiData, ai_suggested: true};
      
      // Điều chỉnh hiển thị khi ngôn ngữ là tiếng Việt (hiển thị meaning trước)
      if (get().translationType === 'Vietnamese') {
        // Đặt searchTerm là word gốc (tiếng Việt)
        // Nhưng hiển thị meaning (tiếng Nhật) ở vị trí nổi bật
        processedAiData = {
          ...processedAiData,
          displayWord: processedAiData.meaning,  // Hiển thị tiếng Nhật là từ chính
          displayMeaning: processedAiData.word   // Hiển thị tiếng Việt là nghĩa
        };
      } else {
        processedAiData = {
          ...processedAiData,
          displayWord: processedAiData.word,     // Giữ nguyên
          displayMeaning: processedAiData.meaning // Giữ nguyên
        };
      }
      
      const normalizedResult = get().normalizeVocabularyData(processedAiData);
      
      set({ 
        lastSearchWasAI: true,
        selectedWord: normalizedResult,
        vocabularySets: [normalizedResult],
        searchResults: [normalizedResult],
        aiExplain: {
          ...processedAiData,
          ai_suggested: true
        }
      });
      
      return normalizedResult;
    } catch (error) {
      set({ error: 'Không thể lấy giải thích từ AI' });
      throw error;
    }
  },

  requestNewVocabulary: async (axios, word) => {
    try {
      const response = await axios.post("api/vocabulary/requestNewVocabulary", {
        word: word,
      });

      return response.data.data;
    } catch (error) {
      set({ error: "Không thể gửi yêu cầu từ vựng mới" });
      throw error;
    }
  },

  // Search vocabulary with normalized responses
  searchVocabulary: async (axios, term = "", addToHistory = false) => {
    const { translationType } = get();
    if (!term?.trim()) {
      get().clearResults();
      return;
    }

    try {
      set({ loading: true, error: null, lastSearchWasAI: false });

      const response = await axios.post("api/vocabulary/similar", {
        word: term,
        language: translationType,
      });

      const results = response.data.data;

      // Normalize and update both arrays
      const normalizedResults = results.map((result) =>
        get().normalizeVocabularyData(result)
      );

      get().updateResults(normalizedResults);
      set({ isSearchModalOpen: true });

      if (addToHistory && results.length > 0) {
        await get().addHistorySearch(axios, results[0].vocab_id);
      }

      return normalizedResults;
    } catch (error) {
      set({ error: "Có lỗi xảy ra khi tìm kiếm" });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  // Action để thay đổi kiểu dịch
  setTranslationType: (axios, type) => {
    set({ translationType: type });
    // get().clearResults();

    // Tự động tìm kiếm lại với kiểu dịch mới nếu có từ
    const { searchTerm } = get();
    if (searchTerm.trim()) {
      // Use setTimeout to allow UI to update first
      setTimeout(() => {
        get().searchVocabulary(axios, searchTerm);
      }, 100);
    }
  },
}));

export default useVocabularyStore;
