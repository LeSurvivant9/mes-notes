"use client";

import DepartmentComponent from "@/components/admin/department/department";
import GradePage from "@/components/admin/grade/grade";
import StudentComponent from "@/components/admin/student/student";
import SubjectComponent from "@/components/admin/subject/subject";
import TeachingUnitComponent from "@/components/admin/teaching-unit/teaching-unit";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Container from "@/components/ui/container";

const AdminPage = () => {
  return (
    <Container>
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
          <AccordionItem value={"students"}>
            <AccordionTrigger>Étudiants</AccordionTrigger>
            <AccordionContent>
              <StudentComponent />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value={"grades"}>
            <AccordionTrigger>Notes</AccordionTrigger>
            <AccordionContent>
              <GradePage />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </Container>
  );
};

export default AdminPage;
