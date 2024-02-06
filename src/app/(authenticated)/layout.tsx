"use client";
import { getUserByKey } from "@/actions/auth/user.actions";
import { Navbar } from "@/components/navbar";
import { useUserStore } from "@/store/use-user";
import { ThemeProvider } from "@/theme/ThemeProvider";
import { useSession } from "next-auth/react";
import React, { useEffect } from "react";

interface ConnectedLayoutProps {
  children: React.ReactNode;
}

const AuthenticatedLayout = ({ children }: ConnectedLayoutProps) => {
  const session = useSession();
  const { initializeUser } = useUserStore();

  useEffect(() => {
    if ("data" in session && session.data !== null) {
      const { data } = session;
      if (data && data.user) {
        const userId = data.user.id as string;
        getUserByKey("id", userId).then((user) => initializeUser(user));
      }
    } else {
      initializeUser(null);
    }
  }, [session?.data?.user, session, initializeUser]);

  return (
    <ThemeProvider attribute={"class"} defaultTheme={"system"} enableSystem>
      <Navbar />
      {children}
    </ThemeProvider>
  );
};

export default AuthenticatedLayout;
