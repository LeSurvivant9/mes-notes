"use client";
import React, { startTransition, useEffect } from "react";
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
import { fetchAllData } from "@/data/get-all-datas";

const AdminComponent = () => {
  useEffect(() => {
    startTransition(() => {
      fetchAllData();
    });
  });

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
