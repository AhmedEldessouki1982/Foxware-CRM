import type { User } from "@/interfaces/User";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AuthState {
  token: string | null;
  setAuth: (token: string | null, user: User | null) => void;
  logout: () => void;
  user: User | null;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      setAuth: (token, user) => set({ token, user }),
      logout: () => set({ token: null, user: null }),
    }),

    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
