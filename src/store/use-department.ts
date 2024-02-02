import { create } from "zustand";
import { z } from "zod";
import { DepartmentSchema } from "@/schemas";

type DepartmentStore = {
  departments: z.infer<typeof DepartmentSchema>[];
  setDepartment: (department: z.infer<typeof DepartmentSchema>[]) => void;
};

export const useDepartmentStore = create<DepartmentStore>((set) => ({
  departments: [] as z.infer<typeof DepartmentSchema>[],
  setDepartment: (departments: z.infer<typeof DepartmentSchema>[]) => {
    set({ departments });
  },
}));
