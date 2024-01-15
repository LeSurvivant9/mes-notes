import React, {createContext, ReactNode, useEffect, useMemo, useState} from 'react';
import {assessment, department, grade, student, subject, teaching_unit} from '@prisma/client';
import {getAssessments, getDepartments, getGrades, getStudents, getSubjects, getTeachingUnits} from "@/actions/admin";

type AdminContextType = {
    departments: department[];
    setDepartments: React.Dispatch<React.SetStateAction<department[]>>;
    fetchDepartments: () => Promise<void>;
    teachingUnits: teaching_unit[];
    setTeachingUnits: React.Dispatch<React.SetStateAction<teaching_unit[]>>;
    fetchTeachingUnits: () => Promise<void>;
    subjects: subject[];
    setSubjects: React.Dispatch<React.SetStateAction<subject[]>>;
    fetchSubjects: () => Promise<void>;
    students: student[];
    setStudents: React.Dispatch<React.SetStateAction<student[]>>;
    fetchStudents: () => Promise<void>;
    grades: grade[];
    setGrades: React.Dispatch<React.SetStateAction<grade[]>>;
    fetchGrades: () => Promise<void>;
    assessments: assessment[];
    setAssessments: React.Dispatch<React.SetStateAction<assessment[]>>;
    fetchAssessments: () => Promise<void>;
};

// Créer le contexte avec des valeurs par défaut
export const AdminContext = createContext<AdminContextType>({
    departments: [],
    setDepartments: () => {
    },
    fetchDepartments: async () => {
    },
    teachingUnits: [],
    setTeachingUnits: () => {
    },
    fetchTeachingUnits: async () => {
    },
    subjects: [],
    setSubjects: () => {
    },
    fetchSubjects: async () => {
    },
    students: [],
    setStudents: () => {
    },
    fetchStudents: async () => {
    },
    grades: [],
    setGrades: () => {
    },
    fetchGrades: async () => {
    },
    assessments: [],
    setAssessments: () => {
    },
    fetchAssessments: async () => {
    },
});

type AdminProviderProps = {
    children: ReactNode;
};

// Composant fournisseur
export const AdminProvider: React.FC<AdminProviderProps> = ({children}) => {
    const [departments, setDepartments] = useState<department[]>([]);
    const [teachingUnits, setTeachingUnits] = useState<teaching_unit[]>([]);
    const [subjects, setSubjects] = useState<subject[]>([]);
    const [students, setStudents] = useState<student[]>([]);
    const [grades, setGrades] = useState<grade[]>([]);
    const [assessments, setAssessments] = useState<assessment[]>([]);

    const fetchDepartments = async () => {
        const departments = await getDepartments();
        setDepartments(departments);
    };
    const fetchTeachingUnits = async () => {
        const teachingUnits = await getTeachingUnits();
        setTeachingUnits(teachingUnits);
    };
    const fetchSubjects = async () => {
        const subjects = await getSubjects();
        setSubjects(subjects);
    };
    const fetchStudents = async () => {
        const students = await getStudents();
        setStudents(students);
    };
    const fetchGrades = async () => {
        const grades = await getGrades();
        setGrades(grades);
    };
    const fetchAssessments = async () => {
        const assessments = await getAssessments();
        setAssessments(assessments);
    };

    useEffect(() => {
        fetchDepartments().then();
        fetchTeachingUnits().then();
        fetchSubjects().then();
        fetchStudents().then();
        fetchGrades().then();
        fetchAssessments().then();
        console.log("MOUNTED")
    }, []);

    const value = useMemo(() => ({
        departments,
        setDepartments,
        fetchDepartments,
        teachingUnits,
        setTeachingUnits,
        fetchTeachingUnits,
        subjects,
        setSubjects,
        fetchSubjects,
        students,
        setStudents,
        fetchStudents,
        grades,
        setGrades,
        fetchGrades,
        assessments,
        setAssessments,
        fetchAssessments,
    }), [departments, teachingUnits, subjects, students, grades, assessments]);

    return (
        <AdminContext.Provider value={value}>
            {children}
        </AdminContext.Provider>
    );
};
