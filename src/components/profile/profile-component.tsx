"use client";
import { useUserStore } from "@/store/use-user";
import React from "react";
import Container from "@/components/ui/container";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Session } from "next-auth";

export default function ProfileComponent({
  session,
}: {
  session: Session | null;
}) {
  const { user, setUser } = useUserStore((state) => ({
    user: state.user,
    setUser: state.setUser,
  }));

  return (
    <Container>
      <div className={"space-y-10 pb-10"}>
        <Card
          className={
            "p-4 sm:p-6 lg:p-8 rounded-lg overflow-hidden border-none shadow-none"
          }
        >
          <CardHeader className={"p-0"}>Profil</CardHeader>
          <CardContent>
            <span>Nom : {user?.name}</span>
          </CardContent>
          <CardContent>
            <span>Email : {user?.email}</span>
          </CardContent>
          <CardContent>
            <span>Numéro étudiant : {session?.student.studentNumber}</span>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}
