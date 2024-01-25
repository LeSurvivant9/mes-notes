"use client";
import { Navbar } from "@/app/(connected)/_components/navbar";
import React from "react";

interface ConnectedLayoutProps {
  children: React.ReactNode;
}

const ConnectedLayout = ({ children }: ConnectedLayoutProps) => {
  return (
    <div>
      <Navbar />
      {children}
    </div>
  );
};

export default ConnectedLayout;
