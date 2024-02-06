"use client";
import { useSession } from "next-auth/react";

export function useCurrentStudent() {
  const session = useSession();

  return session.data?.student;
}
