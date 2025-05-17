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

  // Thêm vào cuối file useVocabularyStore.js

  // Bookmark states and actions
  bookmarkedVocabularies: [],
  
  toggleBookmark: async (axios, vocabId) => {
    try {
      const currentBookmarks = get().bookmarkedVocabularies;
      const isCurrentlyBookmarked = currentBookmarks.includes(vocabId);
      
      // Optimistically update UI
      if (isCurrentlyBookmarked) {
        set({ 
          bookmarkedVocabularies: currentBookmarks.filter(id => id !== vocabId) 
        });
      } else {
        set({ 
          bookmarkedVocabularies: [...currentBookmarks, vocabId] 
        });
      }
      
      // In a real app, you would call the API here
      // await axios.post('/api/vocabulary/toggleBookmark', { vocabId });
      
      return !isCurrentlyBookmarked; // Return new bookmark state
    } catch (error) {
      // Revert on error
      console.error('Error toggling bookmark:', error);
      set({ error: 'Không thể cập nhật bookmark' });
      throw error;
    }
  },
  
  // Topic vocabulary states and actions
  currentTopic: null,
  topicVocabularies: [],
  
  fetchVocabularyByTopic: async (axios, topicId) => {
    try {
      set({ loading: true, error: null });
      
      // In a real app, you would call the API here
      // const response = await axios.get(`/api/vocabulary/topic/${topicId}`);
      // const { topic, vocabularies } = response.data;
      
      // For now, we'll use mock data
      // This would be replaced with actual API call
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock topic data
      const topic = {
        topic_id: topicId,
        name: 'Công nghệ thông tin',
        description: 'Từ vựng liên quan đến CNTT và lập trình',
        image_url: 'https://placehold.co/64x64/indigo/white/png?text=IT'
      };
      
      // Mock vocabularies data
      const vocabularies = [
        {
          vocab_id: 1,
          word: '仕事',
          pronunciation: 'しごと',
          meaning: 'Công việc',
          usage: 'Danh từ chỉ công việc, nghề nghiệp',
          example: '私は毎日仕事に行きます。||仕事が忙しいです。',
          example_meaning: 'Tôi đi làm mỗi ngày.||Công việc rất bận rộn.',
          level: 'N5'
        },
        {
          vocab_id: 2,
          word: '勉強',
          pronunciation: 'べんきょう',
          meaning: 'Học tập',
          usage: 'Danh từ và động từ chỉ việc học',
          example: '日本語を勉強しています。||勉強が好きです。',
          example_meaning: 'Tôi đang học tiếng Nhật.||Tôi thích học tập.',
          level: 'N5'
        },
        // More vocabulary items...
      ];
      
      // Add isBookmarked property based on bookmarkedVocabularies
      const bookmarkedIds = get().bookmarkedVocabularies;
      const vocabsWithBookmarkStatus = vocabularies.map(vocab => ({
        ...vocab,
        isBookmarked: bookmarkedIds.includes(vocab.vocab_id)
      }));
      
      set({ 
        currentTopic: topic,
        topicVocabularies: vocabsWithBookmarkStatus,
        loading: false
      });
      
      return { topic, vocabularies: vocabsWithBookmarkStatus };
    } catch (error) {
      console.error('Error fetching topic vocabularies:', error);
      set({ 
        error: 'Không thể tải danh sách từ vựng cho chủ đề này',
        loading: false
      });
      throw error;
    }
  },
  
  // Flashcard related states and actions
  flashcardSets: [],
  
  createFlashcardSet: async (axios, { topicId, name, vocabularyIds }) => {
    try {
      set({ loading: true, error: null });
      
      // In a real app, you would call the API here
      // const response = await axios.post('/api/flashcards/create', {
      //   topicId,
      //   name,
      //   vocabularyIds
      // });
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Create a mock flashcard set
      const newFlashcardSet = {
        id: Date.now(),
        name: name || `Flashcard set ${get().flashcardSets.length + 1}`,
        topicId,
        vocabularyIds,
        createdAt: new Date().toISOString()
      };
      
      set({
        flashcardSets: [...get().flashcardSets, newFlashcardSet],
        loading: false
      });
      
      return newFlashcardSet;
    } catch (error) {
      console.error('Error creating flashcard set:', error);
      set({
        error: 'Không thể tạo bộ flashcard',
        loading: false
      });
      throw error;
    }
  }
}));

export default useVocabularyStore;
