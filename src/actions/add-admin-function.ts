"use server";
import {z} from "zod";
import {DepartmentSchema, TeachingUnitSchema} from "@/schemas";
import prisma from "@/lib/prisma";
import {revalidatePath} from "next/cache";
import {type subject} from "@prisma/client";
import multer from 'multer';
import {capitalize, toUpperCase} from "@/lib/utils";
import {GradeInformationType} from "@/types";

type StudentInfoType = {
    Code: string; Nom: string; Prenom: string;
};

const upload = multer({dest: '/tmp'});

export const addDepartment = async (formData: z.infer<typeof DepartmentSchema>) => {
    try {
        await prisma.department.create({data: {department_name: formData.department_name}});
        revalidatePath("/admin");
        return {success: `${formData.department_name} ajouté avec succès`}
    } catch (error) {
        return {error: `Problème avec l'upload ${error}`}
    }
};

export const addTeachingUnit = async (formData: z.infer<typeof TeachingUnitSchema>) => {
    try {
        await prisma.teaching_unit.create({
            data: {
                semester: Number(formData.semester),
                teaching_unit_name: formData.teaching_unit_name,
                department_id: formData.department_id,
            }
        });
        revalidatePath("/admin");
        return {success: `${formData.teaching_unit_name} ajouté avec succès`}
    } catch (error) {
        return {error: `Problème avec l'upload ${error}`}
    }
};


export const addSubject = async (formData: subject) => {
    try {
        await prisma.subject.create({
            data: {
                teaching_unit_id: formData.teaching_unit_id,
                subject_name: formData.subject_name,
                subject_coefficient: formData.subject_coefficient,
            }
        });
        revalidatePath("/admin");
        return {success: `${formData.subject_name} ajouté avec succès`}
    } catch (error) {
        return {error: `Problème avec l'upload ${error}`}
    }
};


export const addOrUpdateStudents = async (studentsInfo: StudentInfoType[], newDepartmentId: number, newLevel: number) => {
    const studentPromises = studentsInfo.map(studentData => {
        return prisma.student.upsert({
            where: {student_number: studentData.Code}, update: {
                level: newLevel, department_id: newDepartmentId,
            }, create: {
                student_number: studentData.Code,
                last_name: toUpperCase(studentData.Nom),
                first_name: capitalize(studentData.Prenom),
                department_id: newDepartmentId,
                level: newLevel,
            },
        });
    });

    try {
        await Promise.allSettled(studentPromises);
        return {success: "Élèves ajoutés ou mis à jour avec succès"};
    } catch (error) {
        return {error: `Problème lors de l'ajout ou de la mise à jour des étudiants : ${error}`};
    }
};


export const addGrades = async (gradeInformation: GradeInformationType) => {
    const {data, subjectId, typeOfAssessment, assessmentCoefficient, fileName, period} = gradeInformation;
    let response: { success?: string, error?: string };

    try {
        const assessmentData = {
            subject_id: subjectId,
            type_of_assessment: typeOfAssessment,
            date_of_assessment: new Date(),
            coefficient: assessmentCoefficient,
            file_name: fileName,
            period,
            semester: Math.ceil(period / 2),
        };

        const studentNumbers = data.map(grade => grade.student_number);
        const students = await prisma.student.findMany({
            where: {student_number: {in: studentNumbers}},
        });

        const studentMap = new Map(students.map(student => [student.student_number, student.id]));

        const gradesData = data
            .filter(grade => studentMap.has(grade.student_number))
            .map(grade => ({
                student_id: studentMap.get(grade.student_number),
                grade_value: grade.grade_value,
                assessment_id: undefined,
            }))
            .filter(gradeData => gradeData.student_id !== undefined);

        await prisma.$transaction(async (prisma) => {
            const assessment = await prisma.assessment.create({data: assessmentData});
            await Promise.all(gradesData.map(gradeData => prisma.grade.create({
                data: {
                    ...gradeData, student_id: gradeData.student_id as number, assessment_id: assessment.id,
                }
            })));
        });

        response = {success: `Notes de ${data.length} élèves ajoutées avec succès`};
    } catch (error) {
        console.error(`Problème avec l'upload des notes : ${error}`);
        response = {error: `Problème avec l'upload des notes : ${error}`};
    }

    return response;
};
