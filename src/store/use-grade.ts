import { create } from "zustand";
import { GradeSchema } from "@/schemas";
import { z } from "zod";

type GradeStore = {
  grades: z.infer<typeof GradeSchema>[];
  setGrades: (grades: z.infer<typeof GradeSchema>[]) => void;
};

export const useGradeStore = create<GradeStore>((set) => ({
  grades: [] as z.infer<typeof GradeSchema>[],
  setGrades: (grades: z.infer<typeof GradeSchema>[]) => {
    set({ grades });
  },
}));
