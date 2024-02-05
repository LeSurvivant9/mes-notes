import React, { useEffect } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import DepartmentComponent from "@/components/admin/department/department";
import TeachingUnitComponent from "@/components/admin/teaching-unit/teaching-unit";
import SubjectComponent from "@/components/admin/subject/subject";
import AssessmentComponent from "@/components/admin/assessment/assessment";
import GradePage from "@/components/admin/grade/grade";
import StudentComponent from "@/components/admin/student/student";
import { useDepartmentStore } from "@/store/use-department";
import { useTeachingUnitStore } from "@/store/use-teaching-unit";
import { useSubjectStore } from "@/store/use-subject";
import { useStudentStore } from "@/store/use-student";
import { useGradeStore } from "@/store/use-grade";
import { useAssessmentStore } from "@/store/use-assessment";
import { useQuery } from "@tanstack/react-query";
import { fetchAllData } from "@/data/get-all-datas";
import { z } from "zod";
import { StudentSchema } from "@/schemas";

const AdminComponent = () => {
  const setDepartments = useDepartmentStore((state) => state.setDepartments);
  const setTeachingUnits = useTeachingUnitStore(
    (state) => state.setTeachingUnits,
  );
  const setSubjects = useSubjectStore((state) => state.setSubjects);
  const setStudents = useStudentStore((state) => state.setStudents);
  const setGrades = useGradeStore((state) => state.setGrades);
  const setAssessments = useAssessmentStore((state) => state.setAssessments);

  const { data, isLoading, error } = useQuery({
    queryKey: ["allData"],
    queryFn: fetchAllData,
  });

  useEffect(() => {
    if (data) {
      setDepartments(data.departments);
      setTeachingUnits(data.teachingUnits);
      setSubjects(data.subjects);
      setStudents(data.students as z.infer<typeof StudentSchema>[]);
      setGrades(data.grades);
      setAssessments(data.assessments);
    }
  }, [
    data,
    setDepartments,
    setTeachingUnits,
    setSubjects,
    setStudents,
    setGrades,
    setAssessments,
  ]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className={"p-4 m-4 gap-y-4"}>
      <Accordion type={"single"} collapsible className={"w-full"}>
        <AccordionItem value={"departments"}>
          <AccordionTrigger>Départements</AccordionTrigger>
          <AccordionContent>
            <DepartmentComponent />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value={"teachingUnits"}>
          <AccordionTrigger>Unité d'enseignements</AccordionTrigger>
          <AccordionContent>
            <TeachingUnitComponent />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value={"subjects"}>
          <AccordionTrigger>Matières</AccordionTrigger>
          <AccordionContent>
            <SubjectComponent />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value={"assessments"}>
          <AccordionTrigger>Évaluations</AccordionTrigger>
          <AccordionContent>
            <AssessmentComponent />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value={"grades"}>
          <AccordionTrigger>Notes</AccordionTrigger>
          <AccordionContent>
            <GradePage />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value={"students"}>
          <AccordionTrigger>Étudiants</AccordionTrigger>
          <AccordionContent>
            <StudentComponent />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default AdminComponent;
