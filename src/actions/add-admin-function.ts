"use server";
import prisma from "@/lib/prisma";
import { capitalize, toUpperCase } from "@/lib/utils";
import { DepartmentSchema, SubjectSchema, TeachingUnitSchema } from "@/schemas";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// const upload = multer({ dest: "/tmp" });

export const addDepartment = async (
  departmentData: z.infer<typeof DepartmentSchema>,
) => {
  try {
    await prisma.department.create({
      data: departmentData,
    });
    revalidatePath("/admin");
    return { success: `${departmentData.name} ajouté avec succès` };
  } catch (error) {
    return { error: `Problème avec l'upload ${error}` };
  }
};

export const addTeachingUnit = async (
  teachingUnitData: z.infer<typeof TeachingUnitSchema>,
) => {
  try {
    await prisma.teachingUnit.create({
      data: teachingUnitData,
    });
    revalidatePath("/admin");
    return { success: `${teachingUnitData.name} ajouté avec succès` };
  } catch (error) {
    return { error: `Problème avec l'upload ${error}` };
  }
};

export const addSubject = async (
  subjectData: z.infer<typeof SubjectSchema>,
) => {
  try {
    await prisma.subject.create({
      data: subjectData,
    });
    revalidatePath("/admin");
    return { success: `${subjectData.name} ajouté avec succès` };
  } catch (error) {
    return { error: `Problème avec l'upload ${error}` };
  }
};

type StudentDataType = {
  Code: string;
  Nom: string;
  Prenom: string;
};

export const addOrUpdateStudents = async (
  studentsData: StudentDataType[],
  newDepartmentId: number,
  newLevel: number,
) => {
  const studentPromises = studentsData.map((studentData) => {
    const email = `${studentData.Nom.toLowerCase()}.${studentData.Prenom.toLowerCase()}@uphfr.fr`;
    return prisma.student.upsert({
      where: { studentNumber: Number(studentData.Code) },
      update: {
        level: newLevel,
        departmentId: newDepartmentId,
      },
      create: {
        studentNumber: Number(studentData.Code),
        lastName: toUpperCase(studentData.Nom),
        firstName: capitalize(studentData.Prenom),
        email,
        departmentId: newDepartmentId,
        level: newLevel,
      },
    });
  });

  try {
    await Promise.allSettled(studentPromises);
    return { success: "Élèves ajoutés ou mis à jour avec succès" };
  } catch (error) {
    return {
      error: `Problème lors de l'ajout ou de la mise à jour des étudiants : ${error}`,
    };
  }
};
