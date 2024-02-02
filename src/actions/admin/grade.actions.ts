"use server";
import { GradeSchema } from "@/schemas";
import { z } from "zod";
import prisma from "@/lib/prisma";

export const createGrade = async (data: z.infer<typeof GradeSchema>) => {
  return prisma.grade.create({
    data,
  });
};

export const createManyGrades = async (data: z.infer<typeof GradeSchema>[]) => {
  let response: { success?: string; error?: string };
  try {
    await prisma.grade.createMany({
      data,
      skipDuplicates: true,
    });
    response = {
      success: `Notes de ${data.length} élèves ajoutées avec succès`,
    };
  } catch (error) {
    response = { error: `Problème avec l'upload des notes : ${error}` };
  }

  return response;
};

export const getAllGrades = async () => {
  return prisma.grade.findMany();
};

export const getGradeByKey = async (key: string, value: string) => {
  return prisma.grade.findMany({
    where: {
      [key]: value,
    },
  });
};

export const updateGrade = async (
  id: number,
  data: z.infer<typeof GradeSchema>,
) => {
  return prisma.grade.update({
    where: {
      id: id,
    },
    data: data,
  });
};

export const deleteGrade = async (id: number) => {
  return prisma.grade.delete({
    where: {
      id: id,
    },
  });
};
