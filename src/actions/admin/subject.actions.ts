"use server";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { SubjectSchema } from "@/schemas";

export const createSubject = async (data: z.infer<typeof SubjectSchema>) => {
  return prisma.subject.create({
    data,
  });
};

export const getAllSubject = async () => {
  return prisma.subject.findMany();
};

export const getSubjectByKey = async (key: string, value: string) => {
  return prisma.subject.findFirst({
    where: { [key]: value },
  });
};

export const updateSubject = async (
  id: number,
  data: z.infer<typeof SubjectSchema>,
) => {
  return prisma.subject.update({
    where: { id },
    data,
  });
};

export const deleteSubject = async (id: number) => {
  return prisma.subject.delete({
    where: { id },
  });
};
