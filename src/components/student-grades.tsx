"use client";
import {
  getAllGradesWithInformation,
  getGradeByKey,
} from "@/actions/admin/grade.actions";
import {
  AssessmentType,
  organizeGradesIntoSemesters,
  SemesterType,
  SubjectType,
  TeachingUnitType,
} from "@/data/organize-grades";
import Link from "next/link";
import { v4 as uuidv4 } from "uuid";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

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
        <SubjectComponent key={uuidv4()} subject={subject} />
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
      {JSON.stringify(subject.assessments)}
      {/*{Object.entries(subject.assessments).map(([type, assessment]) => (*/}
      {/*  <ul key={uuidv4()}>*/}
      {/*    <li key={uuidv4()}>*/}
      {/*      <AssessmentComponent key={uuidv4()} assessment={assessment} />*/}
      {/*    </li>*/}
      {/*  </ul>*/}
      {/*))}*/}
    </div>
  );
};

const AssessmentComponent = ({
  assessment,
}: {
  assessment: AssessmentType;
}) => {
  const { data: grades } = useQuery({
    queryKey: ["grades", "assessmentId", assessment.id],
    queryFn: async () => await getGradeByKey("assessmentId", assessment.id),
  });
  if (!grades) {
    return <Skeleton className="my-1 h-6 w-full bg-slate-300" />;
  }

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
      <Link
        href={assessment.fileName}
        target={"_blank"}
        rel={"noonpener noreferrer"}
        className={"hover:underline"}
      >
        {filename?.substring(0, 30)}.pdf
      </Link>{" "}
      | {assessment.type} | Note : {assessment.grades} |{" "}
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

export default function GradesComponent({
  studentNumber,
}: {
  studentNumber: string;
}) {
  const { data: studentGrades, isLoading } = useQuery({
    queryKey: ["grades"],
    queryFn: async () => await getAllGradesWithInformation("22301872"),
  });

  if (isLoading) {
    return (
      <p className={"w-full h-full items-center top-1/2 left-1/2"}>
        Chargement...
      </p>
    );
  }
  if (!studentGrades) {
    return <p>Il n'y aucune note pour le moment.</p>;
  }
  const organizedGrades = organizeGradesIntoSemesters(studentGrades);

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
}
