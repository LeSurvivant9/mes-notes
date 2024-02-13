"use client";

import { UserRole } from "@prisma/client";
import React from "react";
import { FormError } from "@/components/form-error";
import { useUserStore } from "@/store/use-user";

interface RoleGateProps {
  children: React.ReactNode;
  allowedRole: UserRole;
}

export const RoleGate = ({ children, allowedRole }: RoleGateProps) => {
  const { user } = useUserStore();

  if (user?.role !== allowedRole) {
    return <FormError message={"Tu ne devrais pas être ici 🥷🏽"} />;
  }

  return <>{children}</>;
};
