"use server";

import {currentRole} from "@/lib/auth";
import {UserRole} from "@prisma/client";
import prisma from "@/lib/prisma";
import {z} from "zod";
import {DepartmentSchema, TeachingUnitSchema} from "@/schemas";
import {revalidatePath} from "next/cache";

export const admin = async () => {
    const role = await currentRole();

    if (role === UserRole.USER) {
        return {error: "Action non permise"}
    }

    return {success: "Forbidden action"};
}

export const addDepartment = async (formData: z.infer<typeof DepartmentSchema>) => {
    try {
        await prisma.department.create({data: {department_name: formData.department_name}})
        revalidatePath("/admin")
        return {success: `${formData.department_name} ajouté avec succès`}
    } catch (error) {
        return {error: `Problème avec l'upload ${error}`}
    }
}

export const getDepartments = async () => {
    return prisma.department.findMany({orderBy: {id: "asc"}})
}

export const addTeachingUnit = async (formData: z.infer<typeof TeachingUnitSchema>) => {
    try {
        await prisma.teaching_unit.create(
            {
                data: {
                    semester: Number(formData.semester),
                    teaching_unit_name: formData.teaching_unit_name,
                    department_id: formData.department_id,
                }
            })
        revalidatePath("/admin")
        return {success: `${formData.teaching_unit_name} ajouté avec succès`}
    } catch (error) {
        return {error: `Problème avec l'upload ${error}`}
    }
}

export const getTeachingUnits = async () => {
    return prisma.teaching_unit.findMany()
}