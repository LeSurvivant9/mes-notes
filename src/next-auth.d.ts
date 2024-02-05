import { type DefaultSession } from "next-auth";
import { UserRole } from "@prisma/client";
import { z } from "zod";
import { StudentSchema } from "@/schemas";

export type ExtendedUser = DefaultSession["user"] & {
  role: UserRole;
};

declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
    student: z.infer<typeof StudentSchema>;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: "ADMIN" | "USER";
    student: z.infer<typeof StudentSchema>;
  }
}
