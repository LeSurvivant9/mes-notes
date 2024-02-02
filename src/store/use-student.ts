import { create } from "zustand";
import { z } from "zod";
import { StudentSchema } from "@/schemas";

type StudentStore = {
  students: z.infer<typeof StudentSchema>[];
  setStudents: (students: z.infer<typeof StudentSchema>[]) => void;
};

export const useStudentStore = create<StudentStore>((set) => ({
  students: [] as z.infer<typeof StudentSchema>[],
  setStudents: (students: z.infer<typeof StudentSchema>[]) => {
    set({ students });
  },
}));
