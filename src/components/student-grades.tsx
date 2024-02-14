"use client";
import { getAllGradesWithInformation } from "@/actions/admin/grade.actions";
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

const TeachingUnitComponent = ({
  teachingUnit,
}: {
  teachingUnit: TeachingUnitType;
}) => {
  return (
    <div>
      <h2>
        {teachingUnit.name} | Moyenne : {teachingUnit.average.toFixed(2)}
      </h2>
      {Object.values(teachingUnit.subjects).map((subject) => (
        <>
          <Separator key={subject.id} />
          <SubjectComponent key={subject.id} subject={subject} />
          <Separator key={subject.id} />
        </>
      ))}
    </div>
  );
};

const SubjectComponent = ({ subject }: { subject: SubjectType }) => {
  return (
    <div className="ml-4 my-4">
      <h3>
        ✧ {subject.name} | Coefficient : {subject.coefficient} | Moyenne :{" "}
        {subject.average.toFixed(2)}
      </h3>
      {subject.assessments.map((assessment) => (
        <ul key={assessment.id}>
          <li key={assessment.id}>
            <AssessmentComponent key={assessment.id} assessment={assessment} />
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
  const filename = assessment.fileName.split("/").pop();
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
      {assessment.period} | Coefficient : {assessment.coefficient}
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
        Semestre {semesterNumber} | Moyenne : {semester.average.toFixed(2)}
      </h2>
      {Object.values(semester.teachingUnits).map((teachingUnit) => (
        <TeachingUnitComponent
          key={teachingUnit.id}
          teachingUnit={teachingUnit}
        />
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
            key={index}
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
