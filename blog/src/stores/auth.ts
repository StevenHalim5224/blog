import { User } from "@/types/user";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type Store = {
  user: User | null;
  token: string | null;
  onAuthSuccess: (user: User, token: string) => void;
  clearAuth: () => void;
};

export const useAuth = create<Store>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      onAuthSuccess: (user, token) =>{
        if(typeof window !== "undefined"){
          localStorage.setItem("token", token);
        }
        set(() => ({user, token}));
      },
      clearAuth: () => {
        if(typeof window !== "undefined"){
          localStorage.removeItem("token");
        }
        set({ user: null, token: null});
      }
    }),
    {
      name: "blog-storage",
    },
  ),
);
