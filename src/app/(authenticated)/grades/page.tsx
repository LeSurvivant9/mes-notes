"use client";
import { GradesComponent } from "@/components/student-grades";
import Container from "@/components/ui/container";

const GradesPage = () => {
  return (
    <Container>
      <h1
        className={"w-full items-center text-center font-bold justify-center"}
      >
        Notes
      </h1>
      <GradesComponent />
    </Container>
  );
};

export default GradesPage;
