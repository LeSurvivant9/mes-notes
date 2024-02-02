"use server";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { DepartmentSchema } from "@/schemas";

export const createDepartment = async (
  data: z.infer<typeof DepartmentSchema>,
) => {
  return prisma.department.create({
    data,
  });
};

export const getAllDepartment = async () => {
  return prisma.department.findMany();
};

export const getDepartmentByKey = async (key: string, value: string) => {
  return prisma.department.findFirst({
    where: { [key]: value },
  });
};

export const updateDepartment = async (
  id: number,
  data: z.infer<typeof DepartmentSchema>,
) => {
  return prisma.department.update({
    where: { id },
    data,
  });
};

export const deleteDepartment = async (id: number) => {
  return prisma.department.delete({
    where: { id },
  });
};
