import prisma from '@/lib/prisma';

export const getUserByEmail = async (email: string) => {
    try {
        return await prisma.user.findUnique({where: {email}});
    } catch {
        return null;
    }
};

export const getUserById = async (id: string) => {
    try {
        return await prisma.user.findUnique({where: {id}});
    } catch {
        return null;
    }
};

export const getStudentByStudentNumber = async (studentNumber: string) => {
    try {
        return await prisma.student.findUnique({where: {student_number: studentNumber}});
    } catch {
        return null;
    }
};