import { z } from "zod";
import {
  AssessmentSchema,
  GradeSchema,
  SubjectSchema,
  TeachingUnitSchema,
} from "@/schemas";

export type GradesWithInformationsType = z.infer<typeof GradeSchema> & {
  assessment: z.infer<typeof AssessmentSchema> & {
    subject: z.infer<typeof SubjectSchema> & {
      teachingUnit: z.infer<typeof TeachingUnitSchema>;
    };
  };
};

export type GroupedGrades = {
  [semester: number]: {
    [teachingUnitId: string]: {
      teachingUnit: z.infer<typeof TeachingUnitSchema>;
      subjects: {
        [subjectId: string]: {
          subject: z.infer<typeof SubjectSchema>;
          assessments: {
            assessment: z.infer<typeof AssessmentSchema>;
            grade: z.infer<typeof GradeSchema>;
          }[];
        };
      };
    };
  };
};

export const organizeGrades = (
  grades: GradesWithInformationsType[],
): GroupedGrades => {
  return grades.reduce<GroupedGrades>((acc, grade) => {
    const {
      semester,
      id: teachingUnitId,
      ...teachingUnitRest
    } = grade.assessment.subject.teachingUnit;

    const { id: subjectId, ...subjectRest } = grade.assessment.subject;
    const { id: assessmentId, ...assessmentRest } = grade.assessment;

    if (!acc[semester]) {
      acc[semester] = {};
    }

    if (!acc[semester][teachingUnitId]) {
      acc[semester][teachingUnitId] = {
        teachingUnit: { id: teachingUnitId, semester, ...teachingUnitRest },
        subjects: {},
      };
    }

    if (!acc[semester][teachingUnitId].subjects[subjectId]) {
      acc[semester][teachingUnitId].subjects[subjectId] = {
        subject: { id: subjectId, ...subjectRest },
        assessments: [],
      };
    }

    const gradeWithoutRelations: z.infer<typeof GradeSchema> = {
      id: grade.id,
      value: grade.value,
      studentNumber: grade.studentNumber,
      assessmentId: grade.assessmentId,
    };

    acc[semester][teachingUnitId].subjects[subjectId].assessments.push({
      assessment: { id: assessmentId, ...assessmentRest },
      grade: gradeWithoutRelations,
    });

    return acc;
  }, {} as GroupedGrades);
};

export type AveragesType = {
  semesters: {
    [semester: number]: {
      average: number;
      ues: {
        [teachingUnitId: string]: {
          average: number;
          subjects: {
            [subjectId: string]: {
              average: number;
            };
          };
        };
      };
    };
  };
};

// Fonction pour grouper les évaluations par type
const groupAssessmentsByType = (
  assessments: {
    assessment: z.infer<typeof AssessmentSchema>;
    grade: z.infer<typeof GradeSchema>;
  }[],
) => {
  return assessments.reduce<{
    [type: string]: {
      assessment: z.infer<typeof AssessmentSchema>;
      grade: z.infer<typeof GradeSchema>;
    }[];
  }>((acc, { assessment, grade }) => {
    const type = assessment.type;
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push({ assessment, grade });
    return acc;
  }, {});
};

// Fonction pour calculer la moyenne des groupes d'évaluations
const calculateAverageForGroups = (groups: {
  [type: string]: {
    assessment: z.infer<typeof AssessmentSchema>;
    grade: z.infer<typeof GradeSchema>;
  }[];
}) => {
  const averages: { [type: string]: { average: number; coefficient: number } } =
    {};
  for (const type in groups) {
    const group = groups[type];
    const total = group.reduce((sum, { grade }) => sum + grade.value, 0);
    const average = total / group.length;
    const coefficient = group[0].assessment.coefficient;
    averages[type] = { average, coefficient };
  }
  return averages;
};

// Fonction pour calculer la moyenne d'une matière
const calculateSubjectAverage = (
  assessments: {
    assessment: z.infer<typeof AssessmentSchema>;
    grade: z.infer<typeof GradeSchema>;
  }[],
): number => {
  const groups = groupAssessmentsByType(assessments);
  const averages = calculateAverageForGroups(groups);

  let weightedTotal = 0;
  let totalCoefficient = 0;
  let catchAverage = 0;
  let hasCatch = false;
  let hasTP = false;

  if (groups["CATCH"]) {
    hasCatch = true;
    catchAverage = averages["CATCH"].average;
    delete averages["CATCH"];
  }

  if (groups["TP"]) {
    hasTP = true;
    const tpCoefficient = groups["TP"][0].assessment.coefficient;
    weightedTotal += averages["TP"].average * tpCoefficient;
    totalCoefficient += tpCoefficient;
    delete averages["TP"];
  }

  for (const type in averages) {
    weightedTotal += averages[type].average * averages[type].coefficient;
    totalCoefficient += averages[type].coefficient;
  }

  if (hasCatch) {
    const catchCoefficient = groups["EXAM"]
      ? groups["EXAM"][0].assessment.coefficient
      : 1;
    weightedTotal =
      catchAverage * catchCoefficient + (hasTP ? weightedTotal : 0);
    totalCoefficient = catchCoefficient + (hasTP ? totalCoefficient : 0);
  }

  return weightedTotal / totalCoefficient;
};

// Function to calculate teaching unit average
const calculateTeachingUnitAverage = (subjects: {
  [subjectId: string]: {
    subject: z.infer<typeof SubjectSchema>;
    assessments: {
      assessment: z.infer<typeof AssessmentSchema>;
      grade: z.infer<typeof GradeSchema>;
    }[];
  };
}) => {
  let ueTotal = 0;
  let ueCoefficientSum = 0;
  const subjectsAverages: {
    [subjectId: string]: {
      average: number;
    };
  } = {};

  for (const subjectId in subjects) {
    const average = calculateSubjectAverage(subjects[subjectId].assessments);
    subjectsAverages[subjectId] = { average };
    const subjectCoefficient = subjects[subjectId].subject.coefficient;
    ueTotal += average * subjectCoefficient;
    ueCoefficientSum += subjectCoefficient;
  }

  const ueAverage = ueTotal / ueCoefficientSum;

  return {
    average: ueAverage,
    subjects: subjectsAverages,
  };
};

// Function to calculate semester average
const calculateSemesterAverage = (ues: {
  [teachingUnitId: string]: {
    teachingUnit: z.infer<typeof TeachingUnitSchema>;
    subjects: {
      [subjectId: string]: {
        subject: z.infer<typeof SubjectSchema>;
        assessments: {
          assessment: z.infer<typeof AssessmentSchema>;
          grade: z.infer<typeof GradeSchema>;
        }[];
      };
    };
  };
}) => {
  let semesterTotal = 0;
  let semesterCoefficientSum = 0;
  const uesAverages: {
    [teachingUnitId: string]: {
      average: number;
      subjects: {
        [subjectId: string]: {
          average: number;
        };
      };
    };
  } = {};

  for (const teachingUnitId in ues) {
    const { average, subjects } = calculateTeachingUnitAverage(
      ues[teachingUnitId].subjects,
    );
    uesAverages[teachingUnitId] = {
      average,
      subjects,
    };
    semesterTotal += average;
    semesterCoefficientSum++;
  }

  const semesterAverage = semesterTotal / semesterCoefficientSum;

  return {
    average: semesterAverage,
    ues: uesAverages,
  };
};

// Main function to calculate all averages
export const calculateAverages = (
  organizedGrades: GroupedGrades,
): AveragesType => {
  const averages: AveragesType = { semesters: {} };

  for (const semester in organizedGrades) {
    averages.semesters[semester] = calculateSemesterAverage(
      organizedGrades[semester],
    );
  }

  return averages;
};
