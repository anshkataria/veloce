import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,

      login: (user, token) => {
        localStorage.setItem("veloce_admin_token", token);
        set({ user, token });
      },

      logout: () => {
        localStorage.removeItem("veloce_admin_token");
        set({ user: null, token: null });
      },

      isAdmin: (user) => user?.role === "ADMIN",
    }),
    { name: "admin-auth" },
  ),
);

export default useAuthStore;
