"use server";
import { CompleteGradesType } from "@/app/(authenticated)/grades/page";
import prisma from "@/lib/prisma";

export const getCompleteStudentGrades = async (
  studentId: number
): Promise<CompleteGradesType> => {
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
