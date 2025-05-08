import { fetchFlashcardList } from "@/api/getFlashcardList";
import { create } from "zustand";

export const useFlashcardDetailStore = create((set) => ({
    card: null,
    loading: false,
    error: null,
  
    fetchFlashcardDetail: async (axios, id) => {
      set({ loading: true, error: null });
      try {
        const data = await fetchFlashcardList(axios, id);
        set({ card: data });
      } catch (err) {
        set({ error: err });
      } finally {
        set({ loading: false });
      }
    },
  
    clear: () => set({ card: null, loading: false, error: null }),
  }));

