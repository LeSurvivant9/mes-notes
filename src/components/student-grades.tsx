"use client";
import {
  getAllGradesWithInformation,
  getGradeByKey,
} from "@/actions/admin/grade.actions";
import {
  AssessmentType,
  GradesWithInformationType,
  organizeGradesIntoSemesters,
  SemesterType,
  SubjectType,
  TeachingUnitType,
} from "@/data/organize-grades";
import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { getAccountByKey } from "@/actions/auth/account.actions";
import { useUserStore } from "@/store/use-user";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import { GradeSchema } from "@/schemas";

const TeachingUnitComponent = ({
  teachingUnit,
}: {
  teachingUnit: TeachingUnitType;
}) => {
  return (
    <div>
      <h2 className={"bg-emerald-100"}>
        {teachingUnit.name} | Moyenne : {teachingUnit.average.toFixed(3)}
      </h2>
      {Object.values(teachingUnit.subjects).map((subject) => (
        <>
          {/*<Separator key={uuidv4()} />*/}
          <SubjectComponent key={uuidv4()} subject={subject} />
          {/*<Separator key={uuidv4()} />*/}
        </>
      ))}
    </div>
  );
};

const SubjectComponent = ({ subject }: { subject: SubjectType }) => {
  return (
    <div className={"ml-4 my-4 box-border border-2"}>
      <h3 className={""}>
        ✧ {subject.name} | Moyenne : {subject.average.toFixed(3)} | Coefficients
        : Poids {subject.coefficient}{" "}
        {subject.ccCoefficient && `; CC ${subject.ccCoefficient} `}
        {subject.examCoefficient && `; EXAM ${subject.examCoefficient} `}
        {subject.tpCoefficient && `; TP ${subject.tpCoefficient}`}
      </h3>
      {subject.assessments.map((assessment) => (
        <ul key={uuidv4()}>
          <li key={uuidv4()}>
            <AssessmentComponent key={uuidv4()} assessment={assessment} />
          </li>
        </ul>
      ))}
    </div>
  );
};

const AssessmentComponent = ({
  assessment,
}: {
  assessment: AssessmentType;
}) => {
  const [grades, setGrades] = useState<z.infer<typeof GradeSchema>[]>([]);
  useEffect(() => {
    const fetchGrades = async () => {
      const grades = await getGradeByKey("assessmentId", assessment.id);
      setGrades(grades);
    };

    fetchGrades();
  }, [assessment.id]);
  const filename = assessment.fileName.split("/").pop();
  const gradeValues = grades.map((grade) => grade.value);
  // Calculer la moyenne
  const average = gradeValues.reduce((a, b) => a + b, 0) / gradeValues.length;

  // Calculer la médiane
  const sortedGrades = [...gradeValues].sort((a, b) => a - b);
  const middle = Math.floor(sortedGrades.length / 2);
  const median =
    sortedGrades.length % 2 === 0
      ? (sortedGrades[middle - 1] + sortedGrades[middle]) / 2
      : sortedGrades[middle];

  // Trouver la note la plus élevée et la plus basse
  const highestGrade = Math.max(...gradeValues);
  const lowestGrade = Math.min(...gradeValues);
  return (
    <div className="ml-4 my-2">
      •{" "}
      <Link
        href={assessment.fileName}
        target={"_blank"}
        rel={"noonpener noreferrer"}
        className={"hover:underline"}
      >
        {filename?.substring(0, 30)}.pdf
      </Link>{" "}
      | {assessment.type} | Note : {assessment.grade} |{" "}
      {new Date(assessment.date).toLocaleDateString()} | Période :{" "}
      {assessment.period} | Moyenne : {average.toFixed(2)} | Médiane :{" "}
      {median.toFixed(2)} | Max : {highestGrade} | Min : {lowestGrade}
    </div>
  );
};

const SemesterComponent = ({
  semester,
  semesterNumber,
}: {
  semester: SemesterType;
  semesterNumber: number;
}) => {
  return (
    <div className="semester">
      <h2 className={"w-full text-center my-2"}>
        Semestre {semesterNumber} | Moyenne : {semester.average.toFixed(3)}
      </h2>
      {Object.values(semester.teachingUnits).map((teachingUnit) => (
        <TeachingUnitComponent key={uuidv4()} teachingUnit={teachingUnit} />
      ))}
    </div>
  );
};

export const GradesComponent = () => {
  const [isPending, startTransition] = useTransition();
  const { user } = useUserStore();
  const [studentGrades, setStudentGrades] = useState<
    GradesWithInformationType[]
  >([]);

  useEffect(() => {
    const fetchGrades = async () => {
      const student = await getAccountByKey("userId", user?.id as string);
      const grades = await getAllGradesWithInformation(
        student?.studentNumber as string,
      );
      setStudentGrades(grades);
    };
    startTransition(() => fetchGrades());
  }, [user]);

  const organizedGrades = organizeGradesIntoSemesters(studentGrades);

  if (isPending) {
    return (
      <p className={"w-full h-full items-center top-1/2 left-1/2"}>
        Chargement...
      </p>
    );
  }

  return (
    <>
      {organizedGrades.length !== 0 ? (
        Object.values(organizedGrades).map((semester, index) => (
          <SemesterComponent
            key={uuidv4()}
            semester={semester}
            semesterNumber={index + 1}
          />
        ))
      ) : (
        <p>Il n'y aucune note pour le moment.</p>
      )}
    </>
  );
};
