"use client"
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
import {studentStore} from "@/store/student-store";
import {getDepartments, getStudents} from "@/actions/admin";
import {departmentStore} from "@/store/department-store";

const AdminPage = () => {
    const setStudents = studentStore((state: any) => state.setStudents)
    const setDepartments = departmentStore((state: any) => state.setDepartments)

    useEffect(() => {
        const fetchStudents = async () => {
            const students = await getStudents();
            setStudents(students)
        }
        const fetchDepartments = async () => {
            const departments = await getDepartments();
            setDepartments(departments);
        }
        fetchStudents().then();
        fetchDepartments().then();
    }, [setStudents, setDepartments])

    return (
        <AdminProvider>
            <Container>
                <div className={"p-4 m-4 gap-y-4"}>
                    <p className={"text-2xl font-semibold text-center"}>
                        🔑Admin
                    </p>
                    <RoleGate allowedRole={UserRole.ADMIN}>
                        <FormSuccess message={"Toi t'es ok"}/>
                    </RoleGate>
                    <DepartmentComponent/>
                    <TeachingUnitComponent/>
                    <SubjectComponent/>
                    <StudentComponent/>
                </div>
            </Container>
        </AdminProvider>
    );
};

export default AdminPage;