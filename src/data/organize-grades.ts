import { z } from "zod";
import {
  AssessmentSchema,
  GradeSchema,
  SubjectSchema,
  TeachingUnitSchema,
} from "@/schemas";

export type GradesWithInformationType = z.infer<typeof GradeSchema> & {
  assessment: z.infer<typeof AssessmentSchema> & {
    subject: z.infer<typeof SubjectSchema> & {
      teachingUnit: z.infer<typeof TeachingUnitSchema>;
    };
  };
};

type AssessmentOrAverage =
  | {
      type: "assessment";
      data: GradesWithInformationType[];
    }
  | {
      type: "average";
      data: number;
    };

type SubjectDetails = {
  [key: string]: AssessmentOrAverage | undefined;
};

type UnitDetails = {
  [key: string]: SubjectDetails | undefined;
};

type SemesterDetails = {
  [key: string]: UnitDetails | undefined;
};

type OrganizedDataWithAverages = {
  [semester: number]: SemesterDetails | undefined;
};

type OrganizedData = any;

export function organizeData(grades: any): any {
  return grades.reduce((acc: any, grade: any) => {
    const semester = grade.assessment.subject.teachingUnit.semester as number;
    const unitName = grade.assessment.subject.teachingUnit.name;
    const subjectName = grade.assessment.subject.name;
    const assessmentType = grade.assessment.type;

    acc[semester] = acc[semester] || {};
    acc[semester][unitName] = acc[semester][unitName] || {};
    acc[semester][unitName][subjectName] =
      acc[semester][unitName][subjectName] || {};
    acc[semester][unitName][subjectName][assessmentType] =
      acc[semester][unitName][subjectName][assessmentType] || [];

    acc[semester][unitName][subjectName][assessmentType].push(grade);

    return acc;
  }, {} as OrganizedData);
}

type SubjectCoefficients = {
  examCoefficient?: number;
  ccCoefficient?: number;
  tpCoefficient?: number;
  [key: string]: number | undefined;
};

type GradeWithAverage = GradesWithInformationType & { average?: number };

export function calculateAverages(
  data: OrganizedData,
): OrganizedDataWithAverages {
  const calculateWeightedAverage = (
    gradesByType: Record<string, GradeWithAverage[]>,
    subjectCoefficients: SubjectCoefficients,
  ): number => {
    let totalWeightedAverage = 0;
    let totalCoefficient = 0;

    Object.keys(gradesByType).forEach((type) => {
      const grades = gradesByType[type];
      if (grades.length === 0) return;

      const average =
        grades.reduce((sum, grade) => sum + grade.value, 0) / grades.length;
      const coefficient =
        subjectCoefficients[`${type.toLowerCase()}Coefficient`];

      if (coefficient && coefficient > 0) {
        totalWeightedAverage += average * coefficient;
        totalCoefficient += coefficient;
      }
    });

    return totalCoefficient > 0 ? totalWeightedAverage / totalCoefficient : 0;
  };

  Object.keys(data).forEach((semester: any) => {
    let semesterTotalAverage = 0;
    let numberOfUnits = 0;

    Object.keys(data[semester]).forEach((unit) => {
      let unitTotalAverage = 0;
      let numberOfSubjects = 0;

      Object.keys(data[semester][unit]).forEach((subject) => {
        // Exclude 'average' property
        if (subject === "average") return;

        // Récupère les coefficients pour le sujet actuel
        const subjectCoefficients = {
          examCoefficient:
            data[semester][unit][subject].EXAM?.[0]?.assessment.subject
              .examCoefficient || 0,
          ccCoefficient:
            data[semester][unit][subject].CC?.[0]?.assessment.subject
              .ccCoefficient || 0,
          tpCoefficient:
            data[semester][unit][subject].TP?.[0]?.assessment.subject
              .tpCoefficient || 0,
        };

        const subjectAverage = calculateWeightedAverage(
          data[semester][unit][subject],
          subjectCoefficients,
        );
        data[semester][unit][subject].average = subjectAverage;

        unitTotalAverage += subjectAverage;
        numberOfSubjects += 1;
      });

      // Calcul de la moyenne pour chaque UE
      const unitAverage =
        numberOfSubjects > 0 ? unitTotalAverage / numberOfSubjects : 0;
      data[semester][unit].average = unitAverage;

      semesterTotalAverage += unitAverage;
      numberOfUnits += 1;
    });

    // Calcul de la moyenne pour chaque semestre
    data[semester].average =
      numberOfUnits > 0 ? semesterTotalAverage / numberOfUnits : 0;
  });

  return data;
}
