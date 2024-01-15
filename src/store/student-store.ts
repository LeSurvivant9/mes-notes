import {create} from "zustand";
import {student} from "@prisma/client";


export const studentStore = create((set => ({
    students: <student[]>[],
    setStudents: (newStudents: student[]) => set((state: any) => ({
        students: [...newStudents]
    })),
})))