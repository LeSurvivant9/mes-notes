import {create} from "zustand";
import {department, grade, student, teaching_unit} from "@prisma/client";


export const departmentStore = create((set => ({
    departments: <department[]>[],
    setDepartments: (newDepartments: department[]) => set((state: any) => ({
        departments: [...newDepartments],
    })),
})));


type GradeStateType = {
    grades: grade[];
    setGrades: (grades: grade[]) => void;
};

export const gradeStore = create<GradeStateType>((set => ({
    grades: [],
    setGrades: (grades: grade[]) => set({grades}),
})));

export const studentStore = create((set => ({
    students: <student[]>[],
    setStudents: (newStudents: student[]) => set((state: any) => ({
        students: [...newStudents],
    })),
})));