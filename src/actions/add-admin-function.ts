"use server";
import {z} from "zod";
import {DepartmentSchema, TeachingUnitSchema} from "@/schemas";
import prisma from "@/lib/prisma";
import {revalidatePath} from "next/cache";
import {type subject} from "@prisma/client";
import multer from 'multer';

const upload = multer({dest: '/tmp'});

export const addDepartment = async (formData: z.infer<typeof DepartmentSchema>) => {
    try {
        await prisma.department.create({data: {department_name: formData.department_name}})
        revalidatePath("/admin")
        return {success: `${formData.department_name} ajouté avec succès`}
    } catch (error) {
        return {error: `Problème avec l'upload ${error}`}
    }
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


export const addSubject = async (formData: subject) => {
    try {
        await prisma.subject.create(
            {
                data: {
                    teaching_unit_id: formData.teaching_unit_id,
                    subject_name: formData.subject_name,
                    subject_coefficient: formData.subject_coefficient,
                }
            })
        revalidatePath("/admin")
        return {success: `${formData.subject_name} ajouté avec succès`}
    } catch (error) {
        return {error: `Problème avec l'upload ${error}`}
    }
}

export const addStudents = async (studentsInfo: any, departmentId: number, level: number) => {
    try {
        for (const studentData of studentsInfo) {
            const existingStudent = await prisma.student.findUnique({where: {student_number: studentData.Code}})
            if (existingStudent) {
                continue
            }
            await prisma.student.create({
                data: {
                    last_name: studentData.Nom,
                    first_name: studentData.Prenom,
                    student_number: studentData.Code,
                    level,
                    department_id: departmentId,
                },
            });
        }
        return {success: "Élèves ajoutés avec succès"}
    } catch (error) {
        return {error: `Problème avec l'upload ${error}`}
    }
};
