"use server";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { StudentSchema } from "@/schemas";

export const createStudent = async (data: z.infer<typeof StudentSchema>) => {
  return prisma.student.create({
    data,
  });
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

export const getAllStudents = async () => {
  return prisma.student.findMany();
};

export const getStudentByKey = async (key: string, value: string) => {
  return prisma.student.findFirst({
    where: {
      [key]: value,
    },
  });
};

export const updateStudent = async (
  studentNumber: number,
  data: z.infer<typeof StudentSchema>,
) => {
  return prisma.student.update({
    where: {
      studentNumber,
    },
    data: data,
  });
};

export const deleteStudent = async (studentNumber: number) => {
  return prisma.student.delete({
    where: {
      studentNumber,
    },
  });
};
