"use client";
import {AdminProvider} from "@/app/(connected)/admin/AdminContext";
import React, {useEffect} from 'react';
import {RoleGate} from "@/components/auth/role-gate";
import {FormSuccess} from "@/components/form-success";
import {UserRole} from "@prisma/client";
import TeachingUnitComponent from "@/app/(connected)/_components/teaching-unit";
import DepartmentComponent from "@/app/(connected)/_components/department";
import Container from "@/components/ui/container";
import SubjectComponent from "@/app/(connected)/_components/subject";
import StudentComponent from "@/app/(connected)/_components/student";
import {departmentStore, studentStore} from "@/store/admin-store";
import {gradeStore} from "@/store/grade-store"
import {getAssessments, getDepartments, getGrades, getStudents, getSubjects, getTeachingUnits} from "@/actions/admin";
import GradeComponent from "@/app/(connected)/_components/grade-component";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion";
import {subjectStore} from "@/store/subject-store";
import {assessmentStore} from "@/store/assessment-store";
import {teachingUnitStore} from "@/store/teaching-unit-store";

const AdminPage = () => {
    const setStudents = studentStore((state: any) => state.setStudents);
    const setDepartments = departmentStore((state: any) => state.setDepartments);
    const setSubjects = subjectStore((state: any) => state.setSubjects);
    const setGrades = gradeStore((state: any) => state.setGrades);
    const setAssessments = assessmentStore((state: any) => state.setAssessments);
    const setTeachingUnits = teachingUnitStore((state: any) => state.setTeachingUnits);

    useEffect(() => {
        const fetchStudents = async () => {
            const students = await getStudents();
            setStudents(students)
        };
        const fetchDepartments = async () => {
            const departments = await getDepartments();
            setDepartments(departments);
        };
        const fetchSubjects = async () => {
            const subjects = await getSubjects();
            setSubjects(subjects)
        };

        const fetchGrades = async () => {
            const grades = await getGrades();
            setGrades(grades)
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
    }, [setStudents, setDepartments, setSubjects, setGrades, setAssessments, setTeachingUnits]);

    return (<AdminProvider>
        <Container>
            <div className={"p-4 m-4 gap-y-4"}>
                <p className={"text-2xl font-semibold text-center"}>
                    🔑Admin
                </p>
                <RoleGate allowedRole={UserRole.ADMIN}>
                    <FormSuccess message={"Toi t'es ok"}/>
                </RoleGate>
                <Accordion type={"single"} collapsible className={"w-full"}>
                    <AccordionItem value={"departments"}>
                        <AccordionTrigger>Départements</AccordionTrigger>
                        <AccordionContent>
                            <DepartmentComponent/>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value={"teachingUnits"}>
                        <AccordionTrigger>Unité d'enseignements</AccordionTrigger>
                        <AccordionContent>
                            <TeachingUnitComponent/>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value={"subjects"}>
                        <AccordionTrigger>Matières</AccordionTrigger>
                        <AccordionContent>
                            <SubjectComponent/>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value={"students"}>
                        <AccordionTrigger>Étudiants</AccordionTrigger>
                        <AccordionContent>
                            <StudentComponent/>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value={"grades"}>
                        <AccordionTrigger>Notes</AccordionTrigger>
                        <AccordionContent>
                            <GradeComponent/>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        </Container>
    </AdminProvider>);
};

export default AdminPage;