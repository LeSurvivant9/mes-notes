"use client";
import { Navbar } from "@/components/navbar";
import { ThemeProvider } from "@/theme/ThemeProvider";
import React from "react";

interface ConnectedLayoutProps {
  children: React.ReactNode;
}

const ConnectedLayout = ({ children }: ConnectedLayoutProps) => {
  return (
    <ThemeProvider attribute={"class"} defaultTheme={"system"} enableSystem>
      <Navbar />
      {children}
    </ThemeProvider>
  );
};

export default ConnectedLayout;
