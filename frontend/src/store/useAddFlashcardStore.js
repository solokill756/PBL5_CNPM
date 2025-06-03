import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAddFlashcardStore = create(
  persist(
    (set, get) => ({
      // Form data
      title: "",
      description: "",
      flashcards: [
        { id: 1, front: "", back: "", note: "" },
        { id: 2, front: "", back: "", note: "" }
      ],
      
      // UI states
      loading: false,
      saving: false,
      error: null,
      successMessage: "",
      
      // Settings
      isPublic: true,
      allowStudyFromClass: true,
      
      // Actions
      setTitle: (title) => set({ title }),
      setDescription: (description) => set({ description }),
      
      setIsPublic: (isPublic) => set({ isPublic }),
      setAllowStudyFromClass: (allowStudyFromClass) => set({ allowStudyFromClass }),
      
      // Flashcard operations
      updateFlashcard: (id, field, value) => {
        set((state) => ({
          flashcards: state.flashcards.map((card) =>
            card.id === id ? { ...card, [field]: value } : card
          ),
        }));
      },
      
      addFlashcard: () => {
        set((state) => {
          const newId = Math.max(...state.flashcards.map(c => c.id)) + 1;
          return {
            flashcards: [
              ...state.flashcards,
              { id: newId, front: "", back: "", note: "" }
            ],
          };
        });
      },

      addFlashcardAt: (afterId) => {
        set((state) => {
          const newId = Math.max(...state.flashcards.map(c => c.id)) + 1;
          const targetIndex = state.flashcards.findIndex(card => card.id === afterId);
          
          const newFlashcard = { id: newId, front: "", back: "", note: "" };
          const newFlashcards = [...state.flashcards];
          newFlashcards.splice(targetIndex + 1, 0, newFlashcard);
          
          return { flashcards: newFlashcards };
        });
      },
      
      removeFlashcard: (id) => {
        set((state) => ({
          flashcards: state.flashcards.filter((card) => card.id !== id),
        }));
      },
      
      duplicateFlashcard: (id) => {
        set((state) => {
          const cardToDuplicate = state.flashcards.find(card => card.id === id);
          if (!cardToDuplicate) return state;
          
          const newId = Math.max(...state.flashcards.map(c => c.id)) + 1;
          const cardIndex = state.flashcards.findIndex(card => card.id === id);
          
          const newFlashcards = [...state.flashcards];
          newFlashcards.splice(cardIndex + 1, 0, {
            ...cardToDuplicate,
            id: newId
          });
          
          return { flashcards: newFlashcards };
        });
      },
      
      // Drag and drop - tự implement arrayMove
      reorderFlashcards: (activeId, overId) => {
        set((state) => {
          const oldIndex = state.flashcards.findIndex(card => card.id === activeId);
          const newIndex = state.flashcards.findIndex(card => card.id === overId);
          
          const newFlashcards = [...state.flashcards];
          const [movedCard] = newFlashcards.splice(oldIndex, 1);
          newFlashcards.splice(newIndex, 0, movedCard);
          
          return { flashcards: newFlashcards };
        });
      },
      
      // Load flashcard from existing (for copy functionality)
      loadFromExisting: (flashcardData) => {
        const { originalDeck, flashcardMetadata } = flashcardData;
        
        if (!originalDeck || !Array.isArray(originalDeck)) {
          console.error("Invalid flashcard data provided");
          return;
        }
        
        set({
          title: `Bản sao của ${flashcardMetadata?.title || "Untitled"}`,
          description: flashcardMetadata?.description || "",
          flashcards: originalDeck.map((card, index) => ({
            id: index + 1,
            front: card.front_text || "",
            back: card.back_text || "",
            note: card.custom_note || ""
          })),
          isPublic: flashcardMetadata?.is_public !== false,
          allowStudyFromClass: flashcardMetadata?.allow_study_from_class !== false
        });
      },
      
      // Load from forgotten words
      loadFromForgottenWords: async (axios) => {
        set({ loading: true });
        try {
          const response = await axios.get("/api/flashcards/forgotten-words");
          const words = response.data.data || [];
          
          set({
            title: "Từ hay quên",
            description: "Bộ flashcard được tạo từ những từ bạn hay quên",
            flashcards: words.map((word, index) => ({
              id: index + 1,
              front: word.front_text || word.term || "",
              back: word.back_text || word.definition || "",
              note: word.note || ""
            }))
          });
        } catch (error) {
          console.error("Error loading forgotten words:", error);
          set({ error: "Không thể tải từ hay quên" });
        } finally {
          set({ loading: false });
        }
      },
      
      // Validation
      validateForm: () => {
        const state = get();
        const errors = [];
        
        if (!state.title.trim()) {
          errors.push("Tiêu đề không được để trống");
        }
        
        const validFlashcards = state.flashcards.filter(
          card => card.front.trim() && card.back.trim()
        );
        
        if (validFlashcards.length < 2) {
          errors.push("Cần ít nhất 2 thẻ flashcard hợp lệ");
        }
        
        return {
          isValid: errors.length === 0,
          errors
        };
      },
      
      // Reset form
      resetForm: () => {
        set({
          title: "",
          description: "",
          flashcards: [
            { id: 1, front: "", back: "", note: "" },
            { id: 2, front: "", back: "", note: "" }
          ],
          loading: false,
          saving: false,
          error: null,
          successMessage: "",
          isPublic: true,
          allowStudyFromClass: true
        });
      },
      
      // Save flashcard set
      saveFlashcardSet: async (axios) => {
        const state = get();
        const validation = state.validateForm();
        
        if (!validation.isValid) {
          set({ error: validation.errors.join(", ") });
          return false;
        }
        
        set({ saving: true, error: null });
        
        try {
          const validFlashcards = state.flashcards.filter(
            card => card.front.trim() && card.back.trim()
          );
          
          const payload = {
            title: state.title.trim(),
            description: state.description.trim(),
            is_public: state.isPublic,
            allow_study_from_class: state.allowStudyFromClass,
            flashcards: validFlashcards.map(card => ({
              front_text: card.front.trim(),
              back_text: card.back.trim(),
              custom_note: card.note.trim()
            }))
          };
          
          const response = await axios.post("/api/flashcards/create", payload);
          
          set({ 
            successMessage: "Tạo bộ flashcard thành công!",
            saving: false 
          });
          
          return response.data;
        } catch (error) {
          set({ 
            error: error.response?.data?.message || "Có lỗi xảy ra khi tạo flashcard",
            saving: false 
          });
          return false;
        }
      },
      
      // Clear messages
      clearMessages: () => {
        set({ error: null, successMessage: "" });
      }
    }),
    {
      name: "add-flashcard-storage",
      getStorage: () => localStorage,
      partialize: (state) => ({
        title: state.title,
        description: state.description,
        flashcards: state.flashcards,
        isPublic: state.isPublic,
        allowStudyFromClass: state.allowStudyFromClass
      }),
    }
  )
);