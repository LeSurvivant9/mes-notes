import { create } from "zustand";
import { z } from "zod";
import { TeachingUnitSchema } from "@/schemas";

type TeachingUnitStore = {
  teachingUnits: z.infer<typeof TeachingUnitSchema>[];
  setTeachingUnits: (
    teachingUnits: z.infer<typeof TeachingUnitSchema>[],
  ) => void;
};

export const useTeachingUnitStore = create<TeachingUnitStore>((set) => ({
  teachingUnits: [] as z.infer<typeof TeachingUnitSchema>[],
  setTeachingUnits: (teachingUnits: z.infer<typeof TeachingUnitSchema>[]) => {
    set({ teachingUnits });
  },
}));
