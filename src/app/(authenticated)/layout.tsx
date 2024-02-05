"use client";
import { Navbar } from "@/components/navbar";
import { ThemeProvider } from "@/theme/ThemeProvider";
import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useUserStore } from "@/store/use-user";
import { getUserByKey } from "@/actions/auth/user.actions";

interface ConnectedLayoutProps {
  children: React.ReactNode;
}

const AuthenticatedLayout = ({ children }: ConnectedLayoutProps) => {
  const { data: session } = useSession();
  const { initializeUser } = useUserStore();

  useEffect(() => {
    if (session?.user) {
      const userId = session.user.id as string;
      getUserByKey("id", userId).then((user) => initializeUser(user));
    }
  }, [session?.user, initializeUser]);
  return (
    <ThemeProvider attribute={"class"} defaultTheme={"system"} enableSystem>
      <Navbar />
      {children}
    </ThemeProvider>
  );
};

export default AuthenticatedLayout;
