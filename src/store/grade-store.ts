import {grade} from "@prisma/client";
import {create} from "zustand";

export const gradeStore = create((set => ({
    grades: <grade[]>[],
    setGrades: (newGrades: grade[]) => set((state: any) => ({
        grades: [...newGrades],
    })),
})));