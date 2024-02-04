"use client";
import { getAllGradesWithInformation } from "@/actions/admin/grade.actions";
import Container from "@/components/ui/container";
import { useSession } from "next-auth/react";
import { Suspense, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import {
  AssessmentSchema,
  GradeSchema,
  SubjectSchema,
  TeachingUnitSchema,
} from "@/schemas";
import { unstable_noStore } from "next/cache";

type CompleteGradesType = z.infer<typeof GradeSchema> & {
  assessments: AssessmentType[];
};

type AssessmentType = z.infer<typeof AssessmentSchema>;

type SubjectType = z.infer<typeof SubjectSchema> & {
  totalGrade: number;
  totalCoefficient: number;
  subjectCoefficient: number;
  average: number;
  assessments: AssessmentType[];
};

type TeachingUnitType = z.infer<typeof TeachingUnitSchema> & {
  totalGrade: number;
  totalCoefficient: number;
  average: number;
  subjects: { [subjectId: string]: SubjectType };
};

type SemesterType = {
  totalGrade: number;
  totalCoefficient: number;
  average: number;
  teachingUnits: { [teachingUnitId: string]: TeachingUnitType };
};

const GradesComponent = () => {
  unstable_noStore();
  const { data: session } = useSession();
  const studentNumber = session?.student.studentNumber;
  const [organizedGrades, setOrganizedGrades] = useState<SemesterType[]>([]);

  const { data: studentGrades } = useQuery({
    queryKey: ["grades", studentNumber],
    queryFn: async () => {
      const grades = await getAllGradesWithInformation(studentNumber);
      const organized = organizeGrades(grades);
      return organized;
    },
  });

  function organizeGrades(grades: CompleteGradesType[]) {
    const semesters: { [key: number]: SemesterType } = {};
    grades.forEach((grade) => {
      const { assessments } = grade;
      const { subjects } = assessments;
      const teachingUnit = subject.teachingUnit;
      const semesterNumber = teachingUnit.semester;

      if (!semesters[semesterNumber]) {
        semesters[semesterNumber] = {
          average: 0,
          totalGrade: 0,
          totalCoefficient: 0,
          teachingUnits: {},
        };
      }

      if (!semesters[semesterNumber].teachingUnits[teachingUnit.id]) {
        semesters[semesterNumber].teachingUnits[teachingUnit.id] = {
          average: 0,
          name: teachingUnit.teachingUnitName,
          totalGrade: 0,
          totalCoefficient: 0,
          subjects: {},
        };
      }

      if (
        !semesters[semesterNumber].teachingUnits[teachingUnit.id].subjects[
          subject.id
        ]
      ) {
        semesters[semesterNumber].teachingUnits[teachingUnit.id].subjects[
          subject.id
        ] = {
          name: subject.subjectName,
          totalGrade: 0,
          totalCoefficient: 0,
          subjectCoefficient: subject.subjectCoefficient,
          average: 0,
          assessments: [],
        };
      }

      const subjectData =
        semesters[semesterNumber].teachingUnits[teachingUnit.id].subjects[
          subject.id
        ];
      subjectData.assessments.push({
        id: assessment.id,
        fileName: assessment.fileName,
        gradeValue: grade.gradeValue,
        coefficient: assessment.coefficient,
        period: assessment.period,
      });

      const gradeValueTimesCoefficient =
        grade.gradeValue * assessment.coefficient;
      subjectData.totalGrade += gradeValueTimesCoefficient;
      subjectData.totalCoefficient += assessment.coefficient;
    });

    Object.values(semesters).forEach((semester) => {
      Object.values(semester.teachingUnits).forEach((teachingUnit) => {
        Object.values(teachingUnit.subjects).forEach((subject) => {
          subject.average = subject.totalGrade / subject.totalCoefficient;
          teachingUnit.totalGrade +=
            subject.average * subject.subjectCoefficient;
          teachingUnit.totalCoefficient += subject.subjectCoefficient;
        });
        teachingUnit.average =
          teachingUnit.totalGrade / teachingUnit.totalCoefficient;
        semester.totalGrade += teachingUnit.average;
        semester.totalCoefficient += 1;
      });
      semester.average = semester.totalGrade / semester.totalCoefficient;
    });

    return Object.values(semesters);
  }

  return (
    <Container>
      {Object.entries(organizedGrades).map(([semesterNumber, semesterData]) => (
        <div key={semesterNumber}>
          <h2>
            Semestre {semesterNumber} - Moyenne générale:{" "}
            {semesterData.average.toFixed(2)}
          </h2>
          {Object.entries(semesterData.teachingUnits).map(
            ([teachingUnitId, teachingUnitData]) => (
              <div key={teachingUnitId}>
                <h3>
                  UE {teachingUnitData.name} - Moyenne de l'UE:{" "}
                  {teachingUnitData.average.toFixed(2)}
                </h3>
                {Object.entries(teachingUnitData.subjects).map(
                  ([subjectId, subjectData]) => (
                    <div key={subjectId}>
                      <h4>
                        {subjectData.name} - Moyenne de la matière:{" "}
                        {subjectData.average.toFixed(2)} - Poids :{" "}
                        {subjectData.subjectCoefficient}
                      </h4>
                      {subjectData.assessments.map((assessment) => (
                        <p key={assessment.id}>
                          {assessment.fileName} | Note: {assessment.gradeValue}{" "}
                          | Coefficient: {assessment.coefficient} | Période:{" "}
                          {assessment.period}
                        </p>
                      ))}
                    </div>
                  ),
                )}
              </div>
            ),
          )}
        </div>
      ))}
    </Container>
  );
};

const GradesPage = () => {
  return (
    <section>
      <Suspense fallback={<div>Loading...</div>}>
        <GradesComponent />
      </Suspense>
    </section>
  );
};

export default GradesPage;
