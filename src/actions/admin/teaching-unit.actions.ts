"use server";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { TeachingUnitSchema } from "@/schemas";

export const createTeachingUnit = async (
  data: z.infer<typeof TeachingUnitSchema>,
) => {
  return prisma.teachingUnit.create({
    data,
  });
};

export const getAllTeachingUnit = async () => {
  return prisma.teachingUnit.findMany();
};

export const getTeachingUnitByKey = async (key: string, value: string) => {
  return prisma.teachingUnit.findFirst({
    where: { [key]: value },
  });
};

export const updateTeachingUnit = async (
  id: number,
  data: z.infer<typeof TeachingUnitSchema>,
) => {
  return prisma.teachingUnit.update({
    where: { id },
    data,
  });
};

export const deleteTeachingUnit = async (id: number) => {
  return prisma.teachingUnit.delete({
    where: { id },
  });
};
