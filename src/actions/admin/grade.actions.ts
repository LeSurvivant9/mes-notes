"use server";
import { GradeSchema } from "@/schemas";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { GradesWithInformationType } from "@/data/organize-grades";

export const getAllGrades = async () => {
  return prisma.grade.findMany({
    orderBy: {
      id: "asc",
    },
  });
};

export const getGradeByKey = async (key: string, value: string) => {
  return prisma.grade.findMany({
    where: {
      [key]: value,
    },
  });
};

export async function getAllGradesWithInformation(studentNumber: string) {
  return prisma.grade.findMany({
    where: {
      studentNumber,
    },
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
  }) as Promise<GradesWithInformationType[]>;
}

export const createGrade = async (data: z.infer<typeof GradeSchema>) => {
  try {
    const grade = await prisma.grade.create({
      data,
    });
    return {
      success: `Note de ${grade.studentNumber} ajoutée avec succès`,
      error: "",
      grade,
    };
  } catch (error) {
    return {
      success: "",
      error: `Problème avec la création de la note : ${error}`,
      grade: null,
    };
  }
};

export const createManyGrades = async (data: z.infer<typeof GradeSchema>[]) => {
  try {
    const grades = await prisma.grade.createMany({
      data,
      skipDuplicates: true,
    });
    return {
      success: `Notes de ${data.length} élèves ajoutées avec succès`,
      error: "",
      grades,
    };
  } catch (error) {
    return {
      success: "",
      error: `Problème avec la création des notes : ${error}`,
      grades: null,
    };
  }
};

export const updateGrade = async (
  id: string,
  data: z.infer<typeof GradeSchema>,
) => {
  try {
    const grade = await prisma.grade.update({
      where: { id },
      data,
    });

    return {
      success: `Note de ${grade.studentNumber} modifiée avec succès`,
      error: "",
      grade,
    };
  } catch (error) {
    return {
      success: "",
      error: `Problème avec la modification de la note : ${error}`,
      grade: null,
    };
  }
};

export const deleteGrade = async (id: string) => {
  try {
    const grade = await prisma.grade.delete({
      where: { id },
    });

    return {
      success: `Note de ${grade.studentNumber} supprimée avec succès`,
      error: "",
      grade,
    };
  } catch (error) {
    return {
      success: "",
      error: `Problème avec la suppression de la note : ${error}`,
      grade: null,
    };
  }
};
