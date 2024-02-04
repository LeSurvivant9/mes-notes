"use server";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { DepartmentSchema } from "@/schemas";

export const getAllDepartments = async () => {
  return prisma.department.findMany({
    orderBy: {
      id: "asc",
    },
  });
};

export const getDepartmentByKey = async (key: string, value: string) => {
  return prisma.department.findFirst({
    where: { [key]: value },
  });
};
export const createDepartment = async (
  data: z.infer<typeof DepartmentSchema>,
) => {
  try {
    const department = await prisma.department.create({
      data,
    });

    return {
      success: `${department.name} a été ajouté avec succès`,
      error: "",
      department,
    };
  } catch (error) {
    return {
      success: "",
      error: "Problème avec la création du département : " + error,
      department: null,
    };
  }
};

export const updateDepartment = async (
  id: string,
  data: z.infer<typeof DepartmentSchema>,
) => {
  try {
    const department = await prisma.department.update({
      where: { id },
      data,
    });

    return {
      success: `"${department.name}" a été modifié avec succès`,
      error: "",
      department,
    };
  } catch (error) {
    return {
      success: "",
      error: "Problème avec la modification du département : " + error,
      department: null,
    };
  }
};

export const deleteDepartment = async (id: string) => {
  try {
    const department = await prisma.department.delete({
      where: { id },
    });

    return {
      success: `"${department.name}" a été supprimé avec succès`,
      error: "",
      department,
    };
  } catch (error) {
    return {
      success: "",
      error: "Problème avec la suppression du département : " + error,
      department: null,
    };
  }
};
