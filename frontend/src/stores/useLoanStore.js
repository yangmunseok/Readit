import { create } from "zustand";
import axios from "../lib/axios";

export const useLoanStore = create((set) => ({
  books: [],
  isSearchingBooks: false,
  searchBooks: async (params = null) => {
    try {
      set({ isSearchingBooks: true });
      const response = await axios.get("/book/getPopularBooks", { params });
      set({ books: response.data, isSearchingBooks: false });
    } catch (error) {
      set({ books: [], isSearchingBooks: false });
    }
  },
}));
