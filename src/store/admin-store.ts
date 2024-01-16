import {create} from "zustand";
import {assessment, department, grade, student, subject, teaching_unit} from "@prisma/client";

export const assessmentStore = create((set => ({
    assessments: <assessment[]>[],
    setAssessments: (newAssessments: assessment[]) => set((state: any) => ({
        assessments: [...newAssessments],
    })),
})));
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
export const subjectStore = create((set => ({
    subjects: <subject[]>[],
    setSubjects: (newSubjects: subject[]) => set((state: any) => ({
        subjects: [...newSubjects],
    })),
})));
export const teachingUnitStore = create((set => ({
    teaching_units: <teaching_unit[]>[],
    setTeachingUnits: (newTeachingUnits: teaching_unit[]) => set((state: any) => ({
        teaching_units: [...newTeachingUnits],
    })),
})));