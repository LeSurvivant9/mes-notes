"use client"
import React from 'react';

import {Card, CardContent, CardHeader} from "@/components/ui/card";
import {RoleGate} from "@/components/auth/role-gate";
import {FormSuccess} from "@/components/form-success";
import {UserRole} from "@prisma/client";
import {toast} from "sonner";
import {admin} from "@/actions/admin";
import TeachingUnitComponent from "@/app/(protected)/_components/teaching-unit";
import DepartmentComponent from "@/app/(protected)/_components/department";
import DepartmentForm from "@/components/admin/department-form";

const AdminPage = () => {
    const onServerActionClick = () => {
        admin()
            .then((data) => {
                if (data.error) {
                    toast.error(data.error)
                }
                if (data.success) {
                    toast.success(data.success)
                }
            })
    }
    const onApiRouteClick = () => {
        fetch("/api/admin")
            .then((response) => {
                if (response.ok) {
                    toast.success("Allowed API Route!")
                } else {
                    toast.error("FORBIDDEN API Route!")
                }
            })
    }
    return (
        <Card className={"w-[800px]"}>
            <CardHeader>
                <p className={"text-2xl font-semibold text-center"}>
                    🔑Admin
                </p>
            </CardHeader>
            <CardContent className={"space-y-4"}>
                <RoleGate allowedRole={UserRole.ADMIN}>
                    <FormSuccess message={"Toi t'es ok"}/>
                </RoleGate>
                <DepartmentComponent/>
                <TeachingUnitComponent/>
            </CardContent>
        </Card>
    );
};

export default AdminPage;