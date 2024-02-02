import { create } from "zustand";
import { AssessmentSchema } from "@/schemas";
import { z } from "zod";

type AssessmentStore = {
  assessments: z.infer<typeof AssessmentSchema>[];
  setAssessments: (assessments: z.infer<typeof AssessmentSchema>[]) => void;
};

export const useAssessmentStore = create<AssessmentStore>((set) => ({
  assessments: [] as z.infer<typeof AssessmentSchema>[],
  setAssessments: (assessments: z.infer<typeof AssessmentSchema>[]) => {
    set({ assessments });
  },
}));
