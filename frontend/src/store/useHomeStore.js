import { create } from 'zustand';
import { fetchRecentClasses } from "@/api/recentClass";
import { fetchRecentFlashcards } from "@/api/recentFlashcard";
import { fetchTopAuthor } from "@/api/topAuthor";
import { fetchSuggessVocabs } from "@/api/suggestVocab";

export const useHomeStore = create((set, get) => ({
  classes: [],
  flashcards: [],
  topAuthors: [],
  vocabs: [],
  loading: {
    classes: false,
    flashcards: false,
    authors: false,
    vocabs: false,
  },
  error: null,

  fetchClasses: async (axios) => {
    set({ loading: { ...get().loading, classes: true } });
    try {
      const { data } = await fetchRecentClasses(axios);
      set({ classes: data || [] });
    } catch (err) {
      set({ error: err });
    } finally {
      set({ loading: { ...get().loading, classes: false } });
    }
  },
  fetchFlashcards: async (axios) => {
    set({ loading: { ...get().loading, flashcards: true } });
    try {
      const { data } = await fetchRecentFlashcards(axios);
      set({ flashcards: data || [] });
    } catch (err) {
      set({ error: err });
    } finally {
      set({ loading: { ...get().loading, flashcards: false } });
    }
  },
  fetchAuthors: async (axios) => {
    set({ loading: { ...get().loading, authors: true } });
    try {
      const { data } = await fetchTopAuthor(axios);
      set({ topAuthors: data || [] });
    } catch (err) {
      set({ error: err });
    } finally {
      set({ loading: { ...get().loading, authors: false } });
    }
  },
  fetchVocabs: async (axios) => {
    set({ loading: { ...get().loading, vocabs: true } });
    try {
      const { data } = await fetchSuggessVocabs(axios);
      set({ vocabs: data || [] });
    } catch (err) {
      set({ error: err });
    } finally {
      set({ loading: { ...get().loading, vocabs: false } });
    }
  },

  // Combined loader nhận axios từ component
  init: (axios) => {
    get().fetchClasses(axios);
    get().fetchFlashcards(axios);
    get().fetchAuthors(axios);
    get().fetchVocabs(axios);
  },
}));