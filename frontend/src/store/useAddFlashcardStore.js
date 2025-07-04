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
        { id: 2, front: "", back: "", note: "" },
      ],

      // UI states
      loading: false,
      saving: false,
      error: null,
      successMessage: "",
      hasDraft: false,
      lastSavedAt: null,
      isAutoSaving: false,

      // Settings
      isPublic: true,
      allowStudyFromClass: true,

      // Drag & Drop state
      draggedItem: null,
      draggedOverIndex: null,

      // Actions
      setLoading: (loading) => set({ loading }),

      setCheckForDraft: (checkForDraft) => set({ checkForDraft }),

      setTitle: (title) => {
        set({ title });
        get().autoSave();
      },

      setDescription: (description) => {
        set({ description });
        get().autoSave();
      },

      setIsPublic: (isPublic) => set({ isPublic }),
      setAllowStudyFromClass: (allowStudyFromClass) =>
        set({ allowStudyFromClass }),

      // Drag & Drop actions
      setDraggedItem: (item) => set({ draggedItem: item }),
      setDraggedOverIndex: (index) => set({ draggedOverIndex: index }),
      clearDragState: () => set({ draggedItem: null, draggedOverIndex: null }),

      getNextId: () => {
        const state = get();
        if (state.flashcards.length === 0) return 1;
        return Math.max(...state.flashcards.map((c) => c.id || 0)) + 1;
      },

      updateFlashcard: (id, field, value) => {
        set((state) => ({
          flashcards: state.flashcards.map((card) =>
            card.id === id ? { ...card, [field]: value } : card
          ),
        }));
        get().autoSave();
      },

      addFlashcard: () => {
        set((state) => {
          const newId = get().getNextId();
          return {
            flashcards: [
              ...state.flashcards,
              { id: newId, front: "", back: "", note: "" },
            ],
          };
        });
        get().autoSave();
      },

      addFlashcardAt: (afterIndex) => {
        set((state) => {
          const newId = get().getNextId();
          const newFlashcard = { id: newId, front: "", back: "", note: "" };
          const newFlashcards = [...state.flashcards];
          newFlashcards.splice(afterIndex + 1, 0, newFlashcard);

          return { flashcards: newFlashcards };
        });
        get().autoSave();
      },

      removeFlashcard: (id) => {
        set((state) => ({
          flashcards: state.flashcards.filter((card) => card.id !== id),
        }));
        get().autoSave();
      },

      duplicateFlashcard: (index) => {
        set((state) => {
          const cardToDuplicate = state.flashcards[index];
          if (!cardToDuplicate) return state;

          const newId = get().getNextId();
          const newFlashcards = [...state.flashcards];
          newFlashcards.splice(index + 1, 0, {
            ...cardToDuplicate,
            id: newId,
          });

          return { flashcards: newFlashcards };
        });
        get().autoSave();
      },

      // Custom drag and drop reorder
      reorderFlashcards: (fromIndex, toIndex) => {
        set((state) => {
          if (fromIndex === toIndex) return state;

          const newFlashcards = [...state.flashcards];
          const [movedCard] = newFlashcards.splice(fromIndex, 1);
          newFlashcards.splice(toIndex, 0, movedCard);

          return { flashcards: newFlashcards };
        });
        get().autoSave();
      },

      // Auto save functionality
      autoSave: () => {
        const state = get();
        if (state.isAutoSaving) return;

        set({ isAutoSaving: true });

        setTimeout(() => {
          set({
            hasDraft: true,
            lastSavedAt: new Date().toISOString(),
            isAutoSaving: false,
          });
        }, 500);
      },

      // Draft management
      clearDraft: () => {
        set({ hasDraft: false, lastSavedAt: null });
      },

      checkForDraft: () => {
        const state = get();
        return (
          state.hasDraft &&
          (state.title.trim() ||
            state.description.trim() ||
            state.flashcards.some(
              (card) => card.front.trim() || card.back.trim()
            ))
        );
      },

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
          })),
          loading: false, // Make sure to clear loading state
        });

        get().autoSave();
      },

      // Load from forgotten words
      loadFromForgottenWords: async (axios, length) => {
        set({ loading: true });
        try {
          const response = await axios.get(
            `/api/listFlashcard/get-list-foget-flashcard?length=${length}`
          );
          const words = response.data.data || [];

          set({
            title: "Từ hay quên",
            description: "Bộ flashcard được tạo từ những từ bạn hay quên",
            flashcards: words.map((word, index) => ({
              id: index + 1,
              front: word.Flashcard.front_text || word.term || "",
              back: word.Flashcard.back_text || word.definition || "",
            })),
          });

          get().autoSave();
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
          (card) => card.front.trim() && card.back.trim()
        );

        if (validFlashcards.length < 2) {
          errors.push("Cần ít nhất 2 thẻ flashcard hợp lệ");
        }

        return {
          isValid: errors.length === 0,
          errors,
        };
      },

      // Reset form
      resetForm: () => {
        set({
          title: "",
          description: "",
          flashcards: [
            { id: 1, front: "", back: "", note: "" },
            { id: 2, front: "", back: "", note: "" },
          ],
          loading: false,
          saving: false,
          error: null,
          successMessage: "",
          isPublic: true,
          allowStudyFromClass: true,
          hasDraft: false,
          lastSavedAt: null,
          draggedItem: null,
          draggedOverIndex: null,
        });

        // Thêm để clear localStorage ngay lập tức
        get().clearDraft();
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
            (card) => card.front.trim() && card.back.trim()
          );

          const payload = {
            title: state.title.trim(),
            description: state.description.trim(),
            flashcards: validFlashcards.map((card) => ({
              front_text: card.front.trim(),
              back_text: card.back.trim(),
            })),
          };

          const response = await axios.post(
            "/api/listFlashcard/add-list-flashcard",
            payload
          );

          set({
            successMessage: "Tạo bộ flashcard thành công!",
            saving: false,
          });

          return response.data;
        } catch (error) {
          set({
            error:
              error.response?.data?.message ||
              "Có lỗi xảy ra khi tạo flashcard",
            saving: false,
          });
          return false;
        }
      },

      // Clear messages
      clearMessages: () => {
        set({ error: null, successMessage: "" });
      },
    }),
    {
      name: "add-flashcard-storage",
      getStorage: () => localStorage,
      partialize: (state) => ({
        title: state.title,
        description: state.description,
        flashcards: state.flashcards,
        isPublic: state.isPublic,
        allowStudyFromClass: state.allowStudyFromClass,
        hasDraft: state.hasDraft,
        lastSavedAt: state.lastSavedAt,
      }),
    }
  )
);
