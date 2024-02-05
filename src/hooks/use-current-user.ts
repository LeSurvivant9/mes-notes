import { useSession } from "next-auth/react";

export const useCurrentStudent = () => {
  const session = useSession();

  return session.data?.student;
};
