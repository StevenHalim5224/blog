import { user } from "@/types/user";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type Store = {
  user: user | null;
  onAuthSuccess: ({ user }: { user: user }) => void;
  clearAuth: () => void;
};

export const useAuth = create<Store>()(
  persist(
    (set) => ({
      user: null,
      onAuthSuccess: ({ user }) => set(() => ({ user: user })),
      clearAuth: () => set(() => ({ user: null })),
    }),
    {
      name: "blog-storage",
    },
  ),
);
