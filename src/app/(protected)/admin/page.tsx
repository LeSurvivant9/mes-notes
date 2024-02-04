"use client";

import Container from "@/components/ui/container";
import { Navbar } from "@/components/navbar";
import { ThemeProvider } from "@/theme/ThemeProvider";
import { useDepartmentStore } from "@/store/use-department";
import { useTeachingUnitStore } from "@/store/use-teaching-unit";
import { useSubjectStore } from "@/store/use-subject";
import { useStudentStore } from "@/store/use-student";
import { useGradeStore } from "@/store/use-grade";
import { useAssessmentStore } from "@/store/use-assessment";
import { useQuery } from "@tanstack/react-query";
import { fetchAllData } from "@/data/get-all-datas";
import { z } from "zod";
import { StudentSchema } from "@/schemas";
import { useEffect } from "react";
import AdminComponent from "@/components/admin/admin";

const AdminPage = () => {
  const setDepartments = useDepartmentStore((state) => state.setDepartments);
  const setTeachingUnits = useTeachingUnitStore(
    (state) => state.setTeachingUnits,
  );
  const setSubjects = useSubjectStore((state) => state.setSubjects);
  const setStudents = useStudentStore((state) => state.setStudents);
  const setGrades = useGradeStore((state) => state.setGrades);
  const setAssessments = useAssessmentStore((state) => state.setAssessments);

  const { data, isLoading, error } = useQuery({
    queryKey: ["allData"],
    queryFn: fetchAllData,
  });

  useEffect(() => {
    if (data) {
      setDepartments(data.departments);
      setTeachingUnits(data.teachingUnits);
      setSubjects(data.subjects);
      setStudents(data.students as z.infer<typeof StudentSchema>[]);
      setGrades(data.grades);
      setAssessments(data.assessments);
    }
  }, [
    data,
    setDepartments,
    setTeachingUnits,
    setSubjects,
    setStudents,
    setGrades,
    setAssessments,
  ]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <ThemeProvider attribute={"class"} defaultTheme={"system"} enableSystem>
      <Navbar />
      <Container>
        <AdminComponent />
      </Container>
    </ThemeProvider>
  );
};

export default AdminPage;
