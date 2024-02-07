"use server";
import PDFParser from "pdf2json";

declare module "pdf2json" {
  export default class Pdfparser {
    on(event: string, listener: (...args: any[]) => void): void;

    parseBuffer(buffer: Buffer): void;

    getRawTextContent(): string;
  }
}

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
