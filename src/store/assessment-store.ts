import {create} from "zustand";
import {assessment} from "@prisma/client";


export const assessmentStore = create((set => ({
    assessments: <assessment[]>[],
    setAssessments: (newAssessments: assessment[]) => set((state: any) => ({
        assessments: [...newAssessments],
    })),
})));