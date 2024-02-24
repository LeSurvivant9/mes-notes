"use client";
import { getAllGradesWithInformation } from "@/actions/admin/grade.actions";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { calculateAverages, organizeData } from "@/data/organize-grades";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { MdKeyboardArrowRight } from "react-icons/md";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";

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
      <h1 className={"w-full  text-center my-2"}>
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
      <h2 className={"bg-emerald-100 dark:bg-white dark:text-black w-full "}>
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
    <Accordion
      collapsible
      type={"single"}
      className={"my-4 box-border border-2 w-full "}
    >
      <AccordionItem value={`${subjectName}`}>
        <AccordionTrigger className={"hover:no-underline"}>
          <h3>
            ✧ {subjectName} | Moyenne : {subjectData.average?.toFixed(3)} |
            Poids : {subjectData.EXAM?.[0]?.assessment.subject.coefficient}
          </h3>
        </AccordionTrigger>
        <AccordionContent>
          {Object.keys(subjectData)
            .filter((type) => type !== "average")
            .map((type) => (
              <Assessment
                key={type}
                assessmentType={type}
                grades={subjectData[type]}
              />
            ))}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
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
    <div className={"w-full ml-4 my-2"}>
      {assessmentType} (Coeff : {grades[0].assessment.coefficient})
      {grades.map((grade: any, index: number) => (
        <div key={index} className={"my-2"}>
          <Dialog>
            <DialogTrigger className={"w-full flex items-center"}>
              • Note : {grade.value} | Date d'ajout :{" "}
              {grade.assessment.date.toLocaleDateString("fr-FR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
            </DialogTrigger>
            <DialogContent
              className={
                "w-full max-w-screen-md mx-2 flex flex-col items-center"
              }
            >
              <Link
                href={grade.assessment.fileName}
                target={"_blank"}
                rel={"noonpener noreferrer"}
                className={"hover:underline"}
              >
                Fichier pdf :{" "}
                {grade.assessment.fileName.split("/").pop()?.substring(0, 30)}
              </Link>{" "}
              <p>Note : {grade.value}</p>
              <p>Période : {grade.assessment.period}</p>
            </DialogContent>
          </Dialog>
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
  if (!studentGrades) {
    return (
      <p className={"w-full h-full items-center top-1/2 left-1/2"}>
        Il n'y aucune note pour le moment.
      </p>
    );
  }
  const organizedGrades = calculateAverages(organizeData(studentGrades));

  return (
    <div className={"w-full items-center justify-center"}>
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
