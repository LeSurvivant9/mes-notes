"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/navbar";
import Container from "@/components/ui/container";
import { ThemeProvider } from "@/theme/ThemeProvider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import GradesComponent from "@/components/student-grades";

export default function Home() {
  const queryClient = new QueryClient();
  const [studentNumber, setStudentNumber] = useState("");
  const [submittedStudentNumber, setSubmittedStudentNumber] = useState<
    string | null
  >(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStudentNumber(event.target.value);
  };

  const handleSubmit = () => {
    setSubmittedStudentNumber(studentNumber);
  };

  return (
    <ThemeProvider attribute={"class"} defaultTheme={"system"} enableSystem>
      <QueryClientProvider client={queryClient}>
        <Navbar />
        <Container>
          <main className={"pt-17"}>
            <div className="flex flex-col gap-4 items-center justify-center">
              <Input
                type="text"
                placeholder="Entrez votre numéro étudiant"
                value={studentNumber}
                onChange={handleInputChange}
                className={"max-w-xs text-center mt-4"}
              />
              <Button className={"max-w-xs"} onClick={handleSubmit}>
                Soumettre
              </Button>
            </div>
            {submittedStudentNumber && (
              <GradesComponent studentNumber={submittedStudentNumber} />
            )}
          </main>
        </Container>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
