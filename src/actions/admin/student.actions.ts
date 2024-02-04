"use server";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { StudentSchema } from "@/schemas";

export const getAllStudents = async () => {
  return prisma.student.findMany({
    orderBy: {
      studentNumber: "asc",
    },
  });
};

export const getStudentByKey = async (key: string, value: string) => {
  return prisma.student.findFirst({
    where: {
      [key]: value,
    },
  });
};

export const createStudent = async (data: z.infer<typeof StudentSchema>) => {
  try {
    const student = await prisma.student.create({
      data,
    });
    return {
      success: `${student.studentNumber} a été ajouté avec succès`,
      error: "",
      student,
    };
  } catch (error) {
    return {
      success: "",
      error: "Problème avec la création de l'élève : " + error,
      student: null,
    };
  }
};

export const createManyStudents = async (
  studentsData: z.infer<typeof StudentSchema>[],
) => {
  let response: { success?: string; error?: string };

  const studentPromises = studentsData.map((studentData) => {
    return prisma.student.upsert({
      where: {
        studentNumber: studentData.studentNumber,
      },
      update: {
        departmentId: studentData.departmentId,
        level: studentData.level,
      },
      create: studentData,
    });
  });

  try {
    await Promise.all(studentPromises);
    response = {
      success: `${studentsData.length} élèves ajoutés ou mis à jour avec succès`,
    };
  } catch (error) {
    response = {
      error: `Problème avec l'ajout ou la mise à jour des élèves : ${error}`,
    };
  }

  return response;
};

export const updateStudent = async (
  studentNumber: string,
  data: z.infer<typeof StudentSchema>,
) => {
  try {
    const student = await prisma.student.update({
      where: { studentNumber },
      data,
    });

    return {
      success: `${student.studentNumber} a été modifié avec succès`,
      error: "",
      student,
    };
  } catch (error) {
    return {
      success: "",
      error: "Problème avec la modification de l'élève : " + error,
      student: null,
    };
  }
};

export const deleteStudent = async (studentNumber: string) => {
  try {
    const student = await prisma.student.delete({
      where: { studentNumber },
    });

    return {
      success: `${student.studentNumber} a été supprimé avec succès`,
      error: "",
      student,
    };
  } catch (error) {
    return {
      success: "",
      error: "Problème avec la suppression de l'élève : " + error,
      student: null,
    };
  }
};
