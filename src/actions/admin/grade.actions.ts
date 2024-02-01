"use server";
import { AssessmentSchema, GradeSchema, StudentSchema } from "@/schemas";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { GradeDataType } from "@/components/admin/grade/grade-form";
import { addAssessment } from "@/actions/admin/assessment.actions";

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
    filteredStudents.map((student) => [student.studentNumber, student.id]),
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

export async function createGrade(
  grades: GradeDataType[],
  assessmentData: z.infer<typeof AssessmentSchema>,
) {
  let response: { success?: string; error?: string };

  try {
    const filteredGradesData = await filterGrades(grades);

    const assessment: z.infer<typeof AssessmentSchema> =
      await addAssessment(assessmentData);

    const gradesData: z.infer<typeof GradeSchema>[] = filteredGradesData.map(
      (gradeData) => ({
        ...gradeData,
        assessmentId: assessment.id as number,
      }),
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
}

export async function getGrades() {
  const grades = await prisma.grade.findMany();
  return grades;
}

export async function updateGrade(
  id: number,
  data: z.infer<typeof GradeSchema>,
) {
  const grade = await prisma.grade.update({
    where: {
      id: id,
    },
    data: data,
  });

  return grade;
}

export async function deleteGrade(id: number) {
  const grade = await prisma.grade.delete({
    where: {
      id: id,
    },
  });

  return grade;
}
