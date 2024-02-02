import { create } from "zustand";
import { z } from "zod";
import { SubjectSchema } from "@/schemas";

type SubjectStore = {
  subjects: z.infer<typeof SubjectSchema>[];
  setSubjects: (subjects: z.infer<typeof SubjectSchema>[]) => void;
};

export const useSubjectStore = create<SubjectStore>((set) => ({
  subjects: [] as z.infer<typeof SubjectSchema>[],
  setSubjects: (subjects: z.infer<typeof SubjectSchema>[]) => {
    set({ subjects });
  },
}));
