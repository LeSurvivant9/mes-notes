import Container from "@/components/ui/container";
import { Navbar } from "@/components/navbar";
import { ThemeProvider } from "@/theme/ThemeProvider";
import AdminComponent from "@/components/admin/admin";
import { RoleGate } from "@/components/auth/role-gate";
import React from "react";

export default async function AdminPage() {
  return (
    <ThemeProvider attribute={"class"} defaultTheme={"system"} enableSystem>
      <Navbar />
      <Container>
        {/*<RoleGate allowedRole={"ADMIN"}>*/}
        <AdminComponent />
        {/*</RoleGate>*/}
      </Container>
    </ThemeProvider>
  );
}
