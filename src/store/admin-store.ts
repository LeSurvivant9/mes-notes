import {create} from "zustand";
import {department, grade, student, teaching_unit} from "@prisma/client";


export const departmentStore = create((set => ({
    departments: <department[]>[],
    setDepartments: (newDepartments: department[]) => set((state: any) => ({
        departments: [...newDepartments],
    })),
})));


export const studentStore = create((set => ({
    students: <student[]>[],
    setStudents: (newStudents: student[]) => set((state: any) => ({
        students: [...newStudents],
    })),
})));