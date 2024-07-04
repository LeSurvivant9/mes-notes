"use client";
import { getAllGradesWithInformations } from "@/actions/admin/grade.actions";
import { useQuery } from "@tanstack/react-query";
import {
  AveragesType,
  calculateAverages,
  GroupedGrades,
  organizeGrades,
} from "@/data/organize-grades";

function Semester({
  semesterData,
  semesterNumber,
  average,
  averages,
}: {
  semesterData: any;
  semesterNumber: number;
  average: number;
  averages: any;
}) {
  const unitIds = Object.keys(semesterData);

  return (
    <div>
      <h1 className={"w-full text-center my-2"}>
        Semestre {semesterNumber} | Moyenne : {average?.toFixed(3)}
      </h1>
      {unitIds.map((unitId) => (
        <TeachingUnit
          key={unitId}
          unitData={semesterData[unitId]}
          average={averages.ues[unitId].average}
          averages={averages.ues[unitId].subjects}
        />
      ))}
    </div>
  );
}

function TeachingUnit({
  unitData,
  average,
  averages,
}: {
  unitData: any;
  average: number;
  averages: any;
}) {
  return (
    <div>
      <h2 className={"bg-emerald-100 dark:bg-white dark:text-black"}>
        {unitData.teachingUnit.name} | Moyenne : {average?.toFixed(3)}
      </h2>
      {Object.keys(unitData.subjects).map((subjectId) => (
        <Subject
          key={subjectId}
          subjectData={unitData.subjects[subjectId]}
          average={averages[subjectId].average}
        />
      ))}
    </div>
  );
}

function Subject({
  subjectData,
  average,
}: {
  subjectData: any;
  average: number;
}) {
  return (
    <div className={"ml-4 my-4 box-border border-2"}>
      <h3>
        ✧ {subjectData.subject.name} | Moyenne : {average?.toFixed(3)} | Poids :{" "}
        {subjectData.subject.coefficient}
      </h3>
      {subjectData.assessments.map((assessment: any, index: number) => (
        <div key={index} className="ml-4 my-2">
          • {assessment.assessment.fileName} | Note: {assessment.grade.value} |
          Type : {assessment.assessment.type} (Coeff{" "}
          {assessment.assessment.coefficient}) | Période :{" "}
          {assessment.assessment.period}
        </div>
      ))}
    </div>
  );
}

export default function GradesComponent({
  studentNumber,
}: {
  studentNumber: string;
}) {
  const {
    data: studentGrades,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["grades", studentNumber],
    queryFn: async () => await getAllGradesWithInformations(studentNumber),
    enabled: !!studentNumber,
  });

  if (isLoading) {
    return (
      <p className={"w-full h-full items-center top-1/2 left-1/2"}>
        Chargement...
      </p>
    );
  }
  if (error) {
    return (
      <p className={"w-full h-full items-center top-1/2 left-1/2"}>
        Une erreur est survenue.
      </p>
    );
  }

  if (!studentGrades || studentGrades.length === 0) {
    return (
      <p className={"w-full h-full text-center text-2xl py-5"}>
        Il n'y a aucune note pour le moment.
      </p>
    );
  }

  const organizedGrades: GroupedGrades = organizeGrades(studentGrades);
  const averages: AveragesType = calculateAverages(organizedGrades);

  return (
    <div>
      {Object.keys(organizedGrades).map((semester: any) => (
        <Semester
          key={semester}
          semesterData={organizedGrades[semester]}
          semesterNumber={parseInt(semester, 10)}
          average={averages.semesters[semester].average}
          averages={averages.semesters[semester]}
        />
      ))}
    </div>
  );
}
