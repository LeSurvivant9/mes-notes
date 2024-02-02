import React from "react";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";

const queryClient = new QueryClient();

const FooComponent = () => {
  const foo = () => "Blabla";
  const { data, isLoading, error } = useQuery({
    queryKey: ["posts"],
    queryFn: foo,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <div>{data}</div>;
};

const UploadPage = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <FooComponent />
    </QueryClientProvider>
  );
};

export default UploadPage;
