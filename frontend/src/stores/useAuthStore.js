import { create } from "zustand";
import axios from "../lib/axios";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
  user: null,
  isSigningUp: false,
  isSigningOut: false,
  isLoggingin: false,
  isLoggingout: false,
  isCheckingAuth: true,
  setUser: (user) => {
    set({ user });
  },
  signup: async ({ email, password, confirmPassword, nickname }) => {
    try {
      set({ isSigningUp: true });
      const response = await axios.post("/auth/signup", {
        email,
        password,
        nickname,
      });
      const user = response.data;
      set({ user, isSigningUp: false });
      toast.success("signup success");
    } catch (error) {
      set({ user: null, isSigningUp: false });
      toast.error(error.response.data.error);
    }
  },
  signout: async () => {
    try {
      set({ isSigningOut: true });
      await axios.delete("/auth/signout");
      set({ user: null, isSigningOut: false });
      toast.success("signout success");
    } catch (error) {
      set({ user: null, isSigningOut: false });
      toast.error("signout failed");
    }
  },
  login: async ({ email, password }) => {
    try {
      set({ isLoggingin: true });
      const response = await axios.post("/auth/login", { email, password });
      const user = response.data;
      set({ user, isLoggingIn: false });
      toast.success("login success");
    } catch (error) {
      set({ user: null, isLoggingIn: false });
      toast.error(error.response.data.error);
    }
  },
  logout: async () => {
    try {
      set({ isLoggingout: true });
      await axios.get("/auth/logout");
      set({ isLoggingout: true, user: null });
      toast.success("logout success");
    } catch (error) {
      set({ isLoggingout: false, user: null });
      toast.error("logout failed");
    }
  },
  checkAuth: async () => {
    try {
      set({ isCheckingAuth: true });
      const response = await axios.get("/auth/getMe");
      const user = response.data;
      set({ user, isCheckingAuth: false });
    } catch (error) {
      set({ isCheckingAuth: false, user: null });
    }
  },
}));

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const response = error.response;
    if (
      response &&
      response.status === 401 &&
      response.data?.error === "you need to log in first"
    ) {
      useAuthStore.getState().setUser(null);
    }

    return Promise.reject(error);
  }
);
