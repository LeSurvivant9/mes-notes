"use server";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { TeachingUnitSchema } from "@/schemas";

export const getAllTeachingUnits = async () => {
  return prisma.teachingUnit.findMany({
    orderBy: {
      id: "asc",
    },
  });
};

export const getTeachingUnitByKey = async (key: string, value: string) => {
  return prisma.teachingUnit.findFirst({
    where: { [key]: value },
  });
};

export const createTeachingUnit = async (
  data: z.infer<typeof TeachingUnitSchema>,
) => {
  try {
    const teachingUnit = await prisma.teachingUnit.create({
      data,
    });
    return {
      success: `${teachingUnit.name} a été ajouté avec succès`,
      error: "",
      teachingUnit,
    };
  } catch (error) {
    return {
      success: "",
      error: "Problème avec la création de l'unité d'enseignement : " + error,
      teachingUnit: null,
    };
  }
};

export const updateTeachingUnit = async (
  id: string,
  data: z.infer<typeof TeachingUnitSchema>,
) => {
  try {
    const teachingUnit = await prisma.teachingUnit.update({
      where: { id },
      data,
    });
    return {
      success: `"${teachingUnit.name}" a été modifié avec succès`,
      error: "",
      teachingUnit,
    };
  } catch (error) {
    return {
      success: "",
      error:
        "Problème avec la modification de l'unité d'enseignement : " + error,
      teachingUnit: null,
    };
  }
};

export const deleteTeachingUnit = async (id: string) => {
  try {
    await prisma.teachingUnit.delete({
      where: { id },
    });
    return {
      success: `L'unité d'enseignement a été supprimée avec succès`,
      error: "",
    };
  } catch (error) {
    return {
      success: "",
      error:
        "Problème avec la suppression de l'unité d'enseignement : " + error,
    };
  }
};
