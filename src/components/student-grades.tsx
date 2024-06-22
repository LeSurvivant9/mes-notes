"use client";
import { getAllGradesWithInformation } from "@/actions/admin/grade.actions";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { calculateAverages, organizeData } from "@/data/organize-grades";

function Semester({
  semesterData,
  semesterNumber,
}: {
  semesterData: any;
  semesterNumber: number;
}) {
  const unitNames = Object.keys(semesterData).filter(
    (key) => key !== "average",
  );

  return (
    <div>
      <h1 className={"w-full text-center my-2"}>
        Semestre {semesterNumber} | {semesterData.average?.toFixed(3)}
      </h1>
      {unitNames.map((unitName) => (
        <TeachingUnit
          key={unitName}
          unitData={semesterData[unitName]}
          unitName={unitName}
        />
      ))}
    </div>
  );
}

function TeachingUnit({
  unitData,
  unitName,
}: {
  unitData: any;
  unitName: string;
}) {
  return (
    <div>
      <h2 className={"bg-emerald-100 dark:bg-white dark:text-black"}>
        {unitName} | Moyenne : {unitData.average?.toFixed(3)}
      </h2>
      {Object.keys(unitData)
        .filter((subjectName) => subjectName !== "average")
        .map((subjectName) => (
          <Subject
            key={subjectName}
            subjectData={unitData[subjectName]}
            subjectName={subjectName}
          />
        ))}
    </div>
  );
}

function Subject({
  subjectData,
  subjectName,
}: {
  subjectData: any;
  subjectName: string;
}) {
  return (
    <div className={"ml-4 my-4 box-border border-2"}>
      <h3>
        ✧ {subjectName} | Moyenne : {subjectData.average?.toFixed(3)}
      </h3>
      {Object.keys(subjectData)
        .filter((type) => type !== "average")
        .map((type) => (
          <Assessment
            key={type}
            assessmentType={type}
            grades={subjectData[type]}
          />
        ))}
    </div>
  );
}

function Assessment({
  assessmentType,
  grades,
}: {
  assessmentType: string;
  grades: any;
}) {
  return (
    <div>
      {grades.map((grade: any, index: number) => (
        <div key={index} className="ml-4 my-2">
          •{" "}
          <Link
            href={grade.assessment.fileName}
            target={"_blank"}
            rel={"noonpener noreferrer"}
            className={"hover:underline"}
          >
            {grade.assessment.fileName.split("/").pop()?.substring(0, 30)}
          </Link>{" "}
          | Note: {grade.value} | Type : {assessmentType} (Coeff{" "}
          {grade.assessment.coefficient}) | Période : {grade.assessment.period}
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
    queryKey: ["grades"],
    queryFn: async () => await getAllGradesWithInformation(studentNumber),
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
        Il n'y aucune note pour le moment.
      </p>
    );
  }
  const organizedGrades = calculateAverages(organizeData(studentGrades));

  return (
    <div>
      {Object.keys(organizedGrades).map((semester: any) => (
        <Semester
          key={semester}
          semesterData={organizedGrades[semester]}
          semesterNumber={semester}
        />
      ))}
    </div>
  );
}
