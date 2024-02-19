import GradesComponent from "@/components/student-grades";
import Container from "@/components/ui/container";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getAllGradesWithInformation } from "@/actions/admin/grade.actions";
import { auth } from "@/auth";

export default async function GradesPage() {
  const session = await auth();
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["grades"],
    queryFn: async () =>
      await getAllGradesWithInformation(
        // session?.student.studentNumber as string,
        "22301872",
      ),
  });

  if (!session?.student.studentNumber) {
    return <p>Vous n'êtes pas connecté</p>;
  }
  return (
    <Container>
      <h1
        className={"w-full items-center text-center font-bold justify-center"}
      >
        Notes
      </h1>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <GradesComponent studentNumber={session.student.studentNumber} />
      </HydrationBoundary>
    </Container>
  );
}
