import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,

      login: (userData, token) => {
        localStorage.setItem("veloce_token", token);
        set({ user: userData, token });
      },

      logout: () => {
        localStorage.removeItem("veloce_token");
        set({ user: null, token: null });
      },

      isAuthenticated: () => !!localStorage.getItem("veloce_token"),
    }),
    { name: "auth-storage" },
  ),
);

export default useAuthStore;
