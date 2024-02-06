"use server";
import { GradeSchema } from "@/schemas";
import prisma from "@/lib/prisma";
import { z } from "zod";
import PDFParser from "pdf2json";
import { GradesWithInformationType } from "@/data/organize-grades";

declare module "pdf2json" {
  export default class Pdfparser {
    on(event: string, listener: (...args: any[]) => void): void;

    parseBuffer(buffer: Buffer): void;

    getRawTextContent(): string;
  }
}

export const getAllGrades = async () => {
  return prisma.grade.findMany({
    orderBy: {
      id: "asc",
    },
  });
};

export const getGradeByKey = async (key: string, value: string) => {
  return prisma.grade.findMany({
    where: {
      [key]: value,
    },
  });
};

export async function getAllGradesWithInformation(studentNumber: string) {
  return prisma.grade.findMany({
    where: {
      studentNumber,
    },
    include: {
      assessment: {
        include: {
          subject: {
            include: {
              teachingUnit: true,
            },
          },
        },
      },
    },
  }) as Promise<GradesWithInformationType[]>;
}

export const createGrade = async (data: z.infer<typeof GradeSchema>) => {
  try {
    const grade = await prisma.grade.create({
      data,
    });
    return {
      success: `Note de ${grade.studentNumber} ajoutée avec succès`,
      error: "",
      grade,
    };
  } catch (error) {
    return {
      success: "",
      error: `Problème avec la création de la note : ${error}`,
      grade: null,
    };
  }
};

export const createManyGrades = async (data: z.infer<typeof GradeSchema>[]) => {
  try {
    const grades = await prisma.grade.createMany({
      data,
      skipDuplicates: true,
    });
    return {
      success: `Notes de ${data.length} élèves ajoutées avec succès`,
      error: "",
      grades,
    };
  } catch (error) {
    return {
      success: "",
      error: `Problème avec la création des notes : ${error}`,
      grades: null,
    };
  }
};

export const updateGrade = async (
  id: string,
  data: z.infer<typeof GradeSchema>,
) => {
  try {
    const grade = await prisma.grade.update({
      where: { id },
      data,
    });

    return {
      success: `Note de ${grade.studentNumber} modifiée avec succès`,
      error: "",
      grade,
    };
  } catch (error) {
    return {
      success: "",
      error: `Problème avec la modification de la note : ${error}`,
      grade: null,
    };
  }
};

export const deleteGrade = async (id: string) => {
  try {
    const grade = await prisma.grade.delete({
      where: { id },
    });

    return {
      success: `Note de ${grade.studentNumber} supprimée avec succès`,
      error: "",
      grade,
    };
  } catch (error) {
    return {
      success: "",
      error: `Problème avec la suppression de la note : ${error}`,
      grade: null,
    };
  }
};

type GradeType = {
  studentNumber: string;
  value: number;
};

const extractTextFromPDFBuffer = async (
  fileBuffer: ArrayBuffer,
): Promise<string> => {
  const pdfParser = new PDFParser(null, 1);

  return new Promise((resolve, reject) => {
    pdfParser.on("pdfParser_dataError", (errData) =>
      reject(errData.parserError),
    );
    pdfParser.on("pdfParser_dataReady", async () => {
      resolve(pdfParser.getRawTextContent());
    });

    pdfParser.parseBuffer(Buffer.from(fileBuffer));
  });
};

const extractGradesFromText = (text: string): GradeType[] => {
  const regex = /2\d{7}(\d+\.?\d*)?/g;
  let match;
  const grades: GradeType[] = [];

  while ((match = regex.exec(text)) !== null) {
    const studentNumber = match[0].substring(0, 8);
    const gradeValue = match[1] ? parseFloat(match[1]) : null;
    if (gradeValue !== null) {
      grades.push({ studentNumber, value: gradeValue });
    }
  }

  return grades;
};

export const extractGrades = async (file: File): Promise<string> => {
  if (!file || !(file instanceof File)) {
    throw new Error("File not found or format not supported");
  }

  const fileBuffer = await file.arrayBuffer();
  const text = await extractTextFromPDFBuffer(fileBuffer);
  const grades = extractGradesFromText(text);

  return JSON.stringify(grades);
};
