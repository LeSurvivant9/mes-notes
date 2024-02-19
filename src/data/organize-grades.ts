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
    const subject = grade.assessment.subject;
    const assessment = grade.assessment;

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
          assessments: {},
        };
    }

    const subjectEntry =
      semesters[semester].teachingUnits[teachingUnit.id].subjects[subject.id];

    if (!subjectEntry.assessments[assessment.id]) {
      subjectEntry.assessments[assessment.id] = {
        ...assessment,
        totalGrade: 0,
        totalCoefficient: 0,
        grades: [],
      };
    }

    subjectEntry.assessments[assessment.id].grades.push(grade.value);
    subjectEntry.assessments[assessment.id].totalGrade += grade.value;
    subjectEntry.assessments[assessment.id].totalCoefficient += 1;
  });

  semesters.forEach((semester) => {
    let semesterTotalGrade = 0;
    let semesterTotalCoefficient = 0;

    Object.values(semester.teachingUnits).forEach((tUnit) => {
      let tUnitTotalGrade = 0;
      let tUnitTotalCoefficient = 0;

      Object.values(tUnit.subjects).forEach((subject) => {
        let subjectTotalGrade = 0;
        let subjectTotalCoefficient = 0;

        Object.values(subject.assessments).forEach((assessment) => {
          if (assessment.totalCoefficient > 0) {
            const average = assessment.totalGrade / assessment.totalCoefficient;
            const finalGrade = average * subject.subjectCoefficient;
            subjectTotalGrade += finalGrade;
            subjectTotalCoefficient += subject.subjectCoefficient;
          }
        });

        if (subjectTotalCoefficient > 0) {
          subject.average = subjectTotalGrade / subjectTotalCoefficient;
          subject.totalCoefficient = subjectTotalCoefficient;
          subject.totalGrade = subjectTotalGrade;
        }

        tUnitTotalGrade += subject.average * subject.subjectCoefficient;
        tUnitTotalCoefficient += subject.subjectCoefficient;
      });

      if (tUnitTotalCoefficient > 0) {
        tUnit.average = tUnitTotalGrade / tUnitTotalCoefficient;
        tUnit.totalCoefficient = tUnitTotalCoefficient;
        tUnit.totalGrade = tUnitTotalGrade;
      }

      semesterTotalGrade += tUnit.average;
      semesterTotalCoefficient += 1;
    });

    if (semesterTotalCoefficient > 0) {
      semester.average = semesterTotalGrade / semesterTotalCoefficient;
    }
  });

  return semesters;
};
