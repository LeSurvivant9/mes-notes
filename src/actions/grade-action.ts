"use server";
import prisma from "@/lib/prisma";
import { CompleteGradesType } from "@/app/(connected)/grades/page";

export const getCompleteStudentGrades = async (
  studentId: number
): Promise<CompleteGradesType> => {
  const grades = await prisma.grade.findMany();
  return prisma.grade.findMany({
    where: { studentId },
    include: {
      assessment: {
        include: {
          subject: {
            include: {
              teachingUnit: true,
            },
          },
        },
      },
    },
  });
};
