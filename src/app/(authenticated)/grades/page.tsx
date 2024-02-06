import { getAllGradesWithInformation } from "@/actions/admin/grade.actions";
import Container from "@/components/ui/container";
import { useCurrentStudent } from "@/hooks/use-current-user";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { GradesComponent } from "@/components/student-grades";

const GradesPage = async () => {
  const student = useCurrentStudent();
  const studentNumber = student?.studentNumber || "";
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["grades"],
    queryFn: async () => await getAllGradesWithInformation(studentNumber),
  });

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
