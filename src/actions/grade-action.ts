"use server";
import prisma from "@/lib/prisma";
import {CompleteGradesType} from "@/app/(connected)/grades/page";


export const getCompleteStudentGrades = async (studentId: number): Promise<CompleteGradesType> => {
    return prisma.grade.findMany({
        where: {student_id: studentId},
        include: {
            assessment: {
                include: {
                    subject: {
                        include: {
                            teaching_unit: true,
                        },
                    },
                },
            },
        },
    });
};