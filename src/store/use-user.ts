import { create } from "zustand";
import { z } from "zod";
import { UserSchema } from "@/schemas";

type UserStore = {
  user: z.infer<typeof UserSchema> | null;
  setUser: (user: z.infer<typeof UserSchema> | null) => void;
  initializeUser: (user: z.infer<typeof UserSchema> | null) => void;
};

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  initializeUser: (user) => {
    set({ user });
  },
}));
