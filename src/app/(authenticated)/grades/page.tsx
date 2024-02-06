"use client";
import { getAllGradesWithInformation } from "@/actions/admin/grade.actions";
import { GradesComponent } from "@/components/student-grades";
import Container from "@/components/ui/container";
import { useCurrentStudent } from "@/hooks/use-current-user";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
  useQuery,
} from "@tanstack/react-query";

const GradesPage = () => {
  const student = useCurrentStudent();
  const studentNumber = student?.studentNumber || "";

  const { data, isLoading } = useQuery({
    queryKey: ["grades", studentNumber],
    queryFn: async () => await getAllGradesWithInformation(studentNumber),
    enabled: !!studentNumber,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const queryClient = new QueryClient();
  queryClient.setQueryData(["grades"], data);

  return (
    <Container>
      <h1
        className={"w-full items-center text-center font-bold justify-center"}
      >
        Notes
      </h1>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <GradesComponent />
      </HydrationBoundary>
    </Container>
  );
};

export default GradesPage;
