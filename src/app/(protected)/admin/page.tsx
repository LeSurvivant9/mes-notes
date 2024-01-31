"use client";
import {
  getAssessments,
  getDepartments,
  getGrades,
  getStudents,
  getSubjects,
  getTeachingUnits,
} from "@/actions/admin";
import DepartmentComponent from "@/components/admin/department/department";
import GradeComponent from "@/components/admin/grade/grade-component";
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
import { departmentStore, studentStore } from "@/store/admin-store";
import { assessmentStore } from "@/store/assessment-store";
import { gradeStore } from "@/store/grade-store";
import { subjectStore } from "@/store/subject-store";
import { teachingUnitStore } from "@/store/teaching-unit-store";
import { useEffect } from "react";

const AdminPage = () => {
  const setStudents = studentStore((state: any) => state.setStudents);
  const setDepartments = departmentStore((state: any) => state.setDepartments);
  const setSubjects = subjectStore((state: any) => state.setSubjects);
  const setGrades = gradeStore((state: any) => state.setGrades);
  const setAssessments = assessmentStore((state: any) => state.setAssessments);
  const setTeachingUnits = teachingUnitStore(
    (state: any) => state.setTeachingUnits
  );

  useEffect(() => {
    const fetchStudents = async () => {
      const students = await getStudents();
      setStudents(students);
    };
    const fetchDepartments = async () => {
      const departments = await getDepartments();
      setDepartments(departments);
    };
    const fetchSubjects = async () => {
      const subjects = await getSubjects();
      setSubjects(subjects);
    };

    const fetchGrades = async () => {
      const grades = await getGrades();
      setGrades(grades);
    };

    const fetchAssessments = async () => {
      const assessments = await getAssessments();
      setAssessments(assessments);
    };

    const fetchTeachingUnits = async () => {
      const teachingUnits = await getTeachingUnits();
      setTeachingUnits(teachingUnits);
    };

    fetchStudents();
    fetchDepartments();
    fetchSubjects();
    fetchGrades();
    fetchAssessments();
    fetchTeachingUnits();
  }, [
    setStudents,
    setDepartments,
    setSubjects,
    setGrades,
    setAssessments,
    setTeachingUnits,
  ]);

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
              <GradeComponent />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </Container>
  );
};

export default AdminPage;
