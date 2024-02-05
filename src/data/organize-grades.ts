import {
  AssessmentSchema,
  GradeSchema,
  SubjectSchema,
  TeachingUnitSchema,
} from "@/schemas";
import { z } from "zod";

export type AssessmentType = z.infer<typeof AssessmentSchema> & {
  grade: number;
};

export type SubjectType = z.infer<typeof SubjectSchema> & {
  average: number;
  subjectCoefficient: number;
  totalCoefficient: number;
  totalGrade: number;
  assessments: AssessmentType[];
};

export type TeachingUnitType = z.infer<typeof TeachingUnitSchema> & {
  average: number;
  totalCoefficient: number;
  totalGrade: number;
  subjects: { [subjectId: string]: SubjectType };
};

export type SemesterType = {
  average: number;
  totalCoefficient: number;
  totalGrade: number;
  teachingUnits: { [teachingUnitId: string]: TeachingUnitType };
};

export type GradesWithInformationType = z.infer<typeof GradeSchema> & {
  assessment: z.infer<typeof AssessmentSchema> & {
    subject: z.infer<typeof SubjectSchema> & {
      teachingUnit: z.infer<typeof TeachingUnitSchema>;
    };
  };
};

export const organizeGradesIntoSemesters = (
  grades: GradesWithInformationType[],
) => {
  const semesters: SemesterType[] = [];

  grades.forEach((grade) => {
    const teachingUnit = grade.assessment.subject.teachingUnit;
    const semester = teachingUnit.semester - 1;

    if (!semesters[semester]) {
      semesters[semester] = {
        average: 0,
        totalCoefficient: 0,
        totalGrade: 0,
        teachingUnits: {},
      };
    }

    if (!semesters[semester].teachingUnits[teachingUnit.id]) {
      semesters[semester].teachingUnits[teachingUnit.id] = {
        ...teachingUnit,
        average: 0,
        totalCoefficient: 0,
        totalGrade: 0,
        subjects: {},
      };
    }

    const subject = grade.assessment.subject;

    if (
      !semesters[semester].teachingUnits[teachingUnit.id].subjects[subject.id]
    ) {
      semesters[semester].teachingUnits[teachingUnit.id].subjects[subject.id] =
        {
          ...subject,
          average: 0,
          subjectCoefficient: subject.coefficient,
          totalCoefficient: 0,
          totalGrade: 0,
          assessments: [],
        };
    }

    const subjectEntry =
      semesters[semester].teachingUnits[teachingUnit.id].subjects[subject.id];
    subjectEntry.assessments.push({
      ...grade.assessment,
      grade: grade.value,
    });
    subjectEntry.totalGrade += grade.value * grade.assessment.coefficient;
    subjectEntry.totalCoefficient += grade.assessment.coefficient;
  });

  semesters.forEach((semester) => {
    let semesterTotalGrade = 0;
    let semesterTotalCoefficient = 0;

    Object.values(semester.teachingUnits).forEach((tUnit) => {
      let tUnitTotalGrade = 0;
      let tUnitTotalCoefficient = 0;

      Object.values(tUnit.subjects).forEach((subject) => {
        if (subject.totalCoefficient > 0) {
          subject.average = subject.totalGrade / subject.totalCoefficient;
        }
        tUnitTotalGrade += subject.average * subject.subjectCoefficient;
        tUnitTotalCoefficient += subject.subjectCoefficient;
      });

      if (tUnitTotalCoefficient > 0) {
        tUnit.average = tUnitTotalGrade / tUnitTotalCoefficient;
        tUnit.totalCoefficient = tUnitTotalCoefficient;
        tUnit.totalGrade = tUnitTotalGrade;
      }
      semesterTotalGrade += tUnit.average * tUnit.totalCoefficient;
      semesterTotalCoefficient += tUnit.totalCoefficient;
    });

    if (semesterTotalCoefficient > 0) {
      semester.average = semesterTotalGrade / semesterTotalCoefficient;
    }
  });

  return semesters;
};
