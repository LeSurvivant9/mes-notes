import { getAllDepartments } from "@/actions/admin/department.actions";
import { getAllStudents } from "@/actions/admin/student.actions";
import { getAllSubjects } from "@/actions/admin/subject.actions";
import { getAllTeachingUnits } from "@/actions/admin/teaching-unit.actions";
import { getAllGrades } from "@/actions/admin/grade.actions";
import { z } from "zod";
import { StudentSchema } from "@/schemas";
import { getAllAssessments } from "@/actions/admin/assessment.actions";
import { useDepartmentStore } from "@/store/use-department";
import { useTeachingUnitStore } from "@/store/use-teaching-unit";
import { useSubjectStore } from "@/store/use-subject";
import { useAssessmentStore } from "@/store/use-assessment";
import { useGradeStore } from "@/store/use-grade";
import { useStudentStore } from "@/store/use-student";

export async function fetchAllData() {
  const [departments, teachingUnits, subjects, assessments, grades, students] =
    await Promise.all([
      getAllDepartments(),
      getAllTeachingUnits(),
      getAllSubjects(),
      getAllAssessments(),
      getAllGrades(),
      getAllStudents(),
    ]);

  return {
    departments,
    teachingUnits,
    subjects,
    assessments,
    grades,
    students,
  };
}

export const fetchDepartments = async () => {
  try {
    const departments = await getAllDepartments();
    const setDepartments = useDepartmentStore.getState().setDepartments;
    setDepartments(departments);
  } catch (error) {
    console.error("Erreur lors de la récupération des départements :", error);
  }
};

export const fetchTeachingUnits = async () => {
  try {
    const teachingUnits = await getAllTeachingUnits();
    const setTeachingUnits = useTeachingUnitStore.getState().setTeachingUnits;
    setTeachingUnits(teachingUnits);
  } catch (error) {
    console.error("Erreur lors de la récupération des départements :", error);
  }
};

export const fetchSubjects = async () => {
  try {
    const subjects = await getAllSubjects();
    const setSubjects = useSubjectStore.getState().setSubjects;
    setSubjects(subjects);
  } catch (error) {
    console.error("Erreur lors de la récupération des matières :", error);
  }
};

export const fetchAssessments = async () => {
  try {
    const assessments = await getAllAssessments();
    const setAssessments = useAssessmentStore.getState().setAssessments;
    setAssessments(assessments);
  } catch (error) {
    console.error("Erreur lors de la récupération des évaluations :", error);
  }
};

export const fetchGrades = async () => {
  try {
    const grades = await getAllGrades();
    const setGrades = useGradeStore.getState().setGrades;
    setGrades(grades);
  } catch (error) {
    console.error("Erreur lors de la récupération des notes :", error);
  }
};

export const fetchStudents = async () => {
  try {
    const students = await getAllStudents();
    const setStudents = useStudentStore.getState().setStudents;
    setStudents(students as z.infer<typeof StudentSchema>[]);
  } catch (error) {
    console.error("Erreur lors de la récupération des élèves :", error);
  }
};
