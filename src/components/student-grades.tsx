"use client";
import { getAllGradesWithInformation } from "@/actions/admin/grade.actions";
import Container from "@/components/ui/container";
import {
  AssessmentType,
  organizeGradesIntoSemesters,
  SemesterType,
  SubjectType,
  TeachingUnitType,
} from "@/data/organize-grades";
import { useCurrentStudent } from "@/hooks/use-current-user";
import { QueryClient, useQuery } from "@tanstack/react-query";

const TeachingUnitComponent = ({
  teachingUnit,
}: {
  teachingUnit: TeachingUnitType;
}) => {
  return (
    <div className="teaching-unit">
      <h2>
        {teachingUnit.name} | Moyenne : {teachingUnit.average.toFixed(2)}
      </h2>
      {Object.values(teachingUnit.subjects).map((subject) => (
        <SubjectComponent key={subject.id} subject={subject} />
      ))}
    </div>
  );
};

const SubjectComponent = ({ subject }: { subject: SubjectType }) => {
  return (
    <div className="subject">
      <h3>
        {subject.name} | Coefficient : {subject.coefficient} | Moyenne :{" "}
        {subject.average.toFixed(2)}
      </h3>
      {subject.assessments.map((assessment) => (
        <AssessmentComponent key={assessment.id} assessment={assessment} />
      ))}
    </div>
  );
};

const AssessmentComponent = ({
  assessment,
}: {
  assessment: AssessmentType;
}) => {
  return (
    <div className="assessment">
      <p>
        {assessment.fileName} | {assessment.type} | Note : {assessment.grade} |{" "}
        {new Date(assessment.date).toLocaleDateString()} | Période :{" "}
        {assessment.period} | Coefficient : {assessment.coefficient}
      </p>
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
  const student = useCurrentStudent();
  const studentNumber = student?.studentNumber || "";

  const { data: studentGrades, isLoading } = useQuery({
    queryKey: ["grades"],
    queryFn: async () => await getAllGradesWithInformation(studentNumber),
  });

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  if (!studentGrades) {
    return <h1>Pas de notes</h1>;
  }

  const organizedGrades = organizeGradesIntoSemesters(studentGrades);

  return (
    <>
      {Object.values(organizedGrades).map((semester, index) => (
        <SemesterComponent
          key={index}
          semester={semester}
          semesterNumber={index + 1}
        />
      ))}
    </>
  );
};
