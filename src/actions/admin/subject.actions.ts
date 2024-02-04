"use server";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { SubjectSchema } from "@/schemas";

export const getAllSubjects = async () => {
  return prisma.subject.findMany({
    orderBy: {
      id: "asc",
    },
  });
};

export const getSubjectByKey = async (key: string, value: string) => {
  return prisma.subject.findFirst({
    where: { [key]: value },
  });
};

export const createSubject = async (data: z.infer<typeof SubjectSchema>) => {
  try {
    const subject = await prisma.subject.create({
      data,
    });
    return {
      success: `${subject.name} a été ajouté avec succès`,
      error: "",
      subject,
    };
  } catch (error) {
    return {
      success: "",
      error: "Problème avec la création de la matière : " + error,
      subject: null,
    };
  }
};

export const updateSubject = async (
  id: string,
  data: z.infer<typeof SubjectSchema>,
) => {
  try {
    const subject = await prisma.subject.update({
      where: { id },
      data,
    });

    return {
      success: `"${subject.name}" a été modifié avec succès`,
      error: "",
      subject,
    };
  } catch (error) {
    return {
      success: "",
      error: "Problème avec la modification de la matière : " + error,
      subject: null,
    };
  }
};

export const deleteSubject = async (id: string) => {
  try {
    await prisma.subject.delete({
      where: { id },
    });

    return {
      success: "La matière a été supprimée avec succès",
      error: "",
    };
  } catch (error) {
    return {
      success: "",
      error: "Problème avec la suppression de la matière : " + error,
    };
  }
};
