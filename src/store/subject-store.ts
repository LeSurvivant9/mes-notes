import {create} from "zustand";
import {subject} from "@prisma/client";

export const subjectStore = create((set => ({
    subjects: <subject[]>[],
    setSubjects: (newSubjects: subject[]) => set((state: any) => ({
        subjects: [...newSubjects],
    })),
})));