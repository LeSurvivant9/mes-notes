"use server";
import { GradeDataType } from "@/components/admin/grade/grade-form";
import prisma from "@/lib/prisma";
import { capitalize, toUpperCase } from "@/lib/utils";
import {
  AssessmentSchema,
  DepartmentSchema,
  GradeSchema,
  StudentSchema,
  SubjectSchema,
  TeachingUnitSchema,
} from "@/schemas";
import multer from "multer";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const upload = multer({ dest: "/tmp" });

export const addDepartment = async (
  departmentData: z.infer<typeof DepartmentSchema>
) => {
  try {
    await prisma.department.create({
      data: departmentData,
    });
    revalidatePath("/admin");
    return { success: `${departmentData.name} ajouté avec succès` };
  } catch (error) {
    return { error: `Problème avec l'upload ${error}` };
  }
};

export const addTeachingUnit = async (
  teachingUnitData: z.infer<typeof TeachingUnitSchema>
) => {
  try {
    await prisma.teachingUnit.create({
      data: teachingUnitData,
    });
    revalidatePath("/admin");
    return { success: `${teachingUnitData.name} ajouté avec succès` };
  } catch (error) {
    return { error: `Problème avec l'upload ${error}` };
  }
};

export const addSubject = async (
  subjectData: z.infer<typeof SubjectSchema>
) => {
  try {
    await prisma.subject.create({
      data: subjectData,
    });
    revalidatePath("/admin");
    return { success: `${subjectData.name} ajouté avec succès` };
  } catch (error) {
    return { error: `Problème avec l'upload ${error}` };
  }
};

type StudentDataType = {
  Code: string;
  Nom: string;
  Prenom: string;
};

export const addOrUpdateStudents = async (
  studentsData: StudentDataType[],
  newDepartmentId: number,
  newLevel: number
) => {
  const studentPromises = studentsData.map((studentData) => {
    return prisma.student.upsert({
      where: { studentNumber: Number(studentData.Code) },
      update: {
        level: newLevel,
        departmentId: newDepartmentId,
      },
      create: {
        studentNumber: Number(studentData.Code),
        lastName: toUpperCase(studentData.Nom),
        firstName: capitalize(studentData.Prenom),
        departmentId: newDepartmentId,
        level: newLevel,
      },
    });
  });

  try {
    await Promise.allSettled(studentPromises);
    return { success: "Élèves ajoutés ou mis à jour avec succès" };
  } catch (error) {
    return {
      error: `Problème lors de l'ajout ou de la mise à jour des étudiants : ${error}`,
    };
  }
};

export const addAssessment = async (
  assessmentData: z.infer<typeof AssessmentSchema>
) => {
  return prisma.assessment.create({
    data: assessmentData,
  });
};

async function filterGrades(grades: GradeDataType[]) {
  type FilteredGrades = {
    value: number;
    studentId: number;
    assessmentId: undefined;
  }[];

  const studentNumbers = grades.map((grade) => Number(grade.studentNumber));
  const filteredStudents: z.infer<typeof StudentSchema>[] =
    await prisma.student.findMany({
      where: { studentNumber: { in: studentNumbers } },
    });

  const studentMap = new Map(
    filteredStudents.map((student) => [student.studentNumber, student.id])
  );

  const filteredGrades = grades
    .filter((grade) => studentMap.has(grade.studentNumber))
    .map((grade) => ({
      studentId: studentMap.get(grade.studentNumber),
      value: grade.value,
      assessmentId: undefined,
    }))
    .filter((grade) => grade.studentId !== undefined);

  return filteredGrades as FilteredGrades;
}

export const addGrades = async (
  grades: GradeDataType[],
  assessmentData: z.infer<typeof AssessmentSchema>
) => {
  let response: { success?: string; error?: string };

  try {
    const filteredGradesData = await filterGrades(grades);

    const assessment: z.infer<typeof AssessmentSchema> = await addAssessment(
      assessmentData
    );

    const gradesData: z.infer<typeof GradeSchema>[] = filteredGradesData.map(
      (gradeData) => ({
        ...gradeData,
        assessmentId: assessment.id as number,
      })
    );
    await prisma.grade.createMany({
      data: gradesData,
      skipDuplicates: true,
    });
    response = {
      success: `Notes de ${grades.length} élèves ajoutées avec succès`,
    };
  } catch (error) {
    console.error(`Problème avec l'upload des notes : ${error}`);
    response = { error: `Problème avec l'upload des notes : ${error}` };
  }

  return response;
};
