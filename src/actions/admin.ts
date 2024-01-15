"use server";

import {currentRole} from "@/lib/auth";
import {UserRole} from "@prisma/client";
import prisma from "@/lib/prisma";

export const admin = async () => {
    const role = await currentRole();

    if (role === UserRole.USER) {
        return {error: "Action non permise"}
    }

    return {success: "Forbidden action"};
}


export const getDepartments = async () => {
    return prisma.department.findMany({orderBy: {id: "asc"}})
}

export const getDepartmentsById = async (id: number) => {
    return prisma.department.findUnique({where: {id}})
}

export const getTeachingUnits = async () => {
    return prisma.teaching_unit.findMany()
}

export const getSubjects = async () => {
    return prisma.subject.findMany()
}

export const getStudents = async () => {
    return prisma.student.findMany()
}

export const getGrades = async () => {
    return prisma.grade.findMany()
}

export const getAssessments = async () => {
    return prisma.assessment.findMany()
}