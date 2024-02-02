import prisma from "@/lib/prisma";
import { getGrades } from "@/actions/admin";

export const getUserByEmail = async (email: string) => {
  try {
    return await prisma.user.findUnique({ where: { email } });
  } catch {
    return null;
  }
};

export const getUserById = async (id: string) => {
  try {
    return await prisma.user.findUnique({ where: { id } });
  } catch {
    return null;
  }
};

export const getStudentByStudentNumber = async (studentNumber: string) => {
  try {
    return await prisma.student.findUnique({
      where: { student_number: studentNumber },
    });
  } catch {
    return null;
  }
};

export const getStudentByStudentId = async (studentId: number | null) => {
  if (!studentId) return null;

  try {
    return await prisma.student.findUnique({ where: { id: studentId } });
  } catch {
    return null;
  }
};

export const getStudentByUserId = async (userId: string) => {
  try {
    const existingAccount = await prisma.account.findFirst({
      where: { user_id: userId },
    });

    if (!existingAccount) return null;

    return await getStudentByStudentId(existingAccount?.student_id);
  } catch {
    return null;
  }
};
