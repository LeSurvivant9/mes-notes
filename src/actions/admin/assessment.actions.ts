"use server";
import { z } from "zod";
import { AssessmentSchema } from "@/schemas";
import prisma from "@/lib/prisma";
import { del } from "@vercel/blob";

export const getAllAssessments = async () => {
  return prisma.assessment.findMany({
    orderBy: {
      id: "asc",
    },
  });
};

export const getAssessmentByKey = async (key: string, value: string) => {
  return prisma.assessment.findFirst({
    where: { [key]: value },
  });
};
export const createAssessment = async (
  assessmentData: z.infer<typeof AssessmentSchema>,
) => {
  try {
    const assessment = await prisma.assessment.create({
      data: assessmentData,
    });
    return {
      success: `${assessment.fileName} a été ajouté avec succès`,
      error: "",
      assessment,
    };
  } catch (error) {
    return {
      success: "",
      error: "Problème avec la création de l'évaluation : " + error,
      assessment: null,
    };
  }
};

export const updateAssessment = async (
  id: string,
  data: z.infer<typeof AssessmentSchema>,
) => {
  try {
    const assessment = await prisma.assessment.update({
      where: { id },
      data,
    });

    return {
      success: `"${assessment.fileName}" a été modifié avec succès`,
      error: "",
      assessment,
    };
  } catch (error) {
    return {
      success: "",
      error: "Problème avec la modification de l'évaluation : " + error,
      assessment: null,
    };
  }
};

export const deleteAssessment = async (id: string) => {
  try {
    const assessment = await prisma.assessment.delete({
      where: { id },
    });
    await del(assessment.fileName);

    return {
      success: `"${assessment.fileName}" a été supprimé avec succès`,
      error: "",
      assessment,
    };
  } catch (error) {
    return {
      success: "",
      error: "Problème avec la suppression de l'évaluation : " + error,
      assessment: null,
    };
  }
};
