"use server";
import { z } from "zod";
import { AssessmentSchema } from "@/schemas";
import prisma from "@/lib/prisma";

export const createAssessment = async (
  assessmentData: z.infer<typeof AssessmentSchema>,
) => {
  return prisma.assessment.create({
    data: assessmentData,
  });
};

export const getAllAssessment = async () => {
  return prisma.assessment.findMany();
};

export const getAssessmentByKey = async (key: string, value: string) => {
  return prisma.assessment.findFirst({
    where: { [key]: value },
  });
};

export const updateAssessment = async (
  id: number,
  data: z.infer<typeof AssessmentSchema>,
) => {
  return prisma.assessment.update({
    where: { id },
    data,
  });
};

export const deleteAssessment = async (id: number) => {
  return prisma.assessment.delete({
    where: { id },
  });
};
