"use client";

import {UserRole} from "@prisma/client";
import React from "react";
import {useCurrentRole} from "@/hooks/use-current-role";
import {FormError} from "@/components/form-error";

interface RoleGateProps {
    children: React.ReactNode;
    allowedRole: UserRole;
}

export const RoleGate = ({children, allowedRole}: RoleGateProps) => {
    const role = useCurrentRole();

    if (role !== allowedRole) {
        return (
            <FormError message={"Tu ne devrais pas être ici 🥷🏽"}/>
        )
    }

    return (
        <>
            {children}
        </>
    );
};