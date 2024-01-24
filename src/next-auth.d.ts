import {type DefaultSession} from "next-auth";
import {UserRole, student} from "@prisma/client"

export type ExtendedUser = DefaultSession["user"] & {
    role: UserRole;
}

declare module "next-auth" {
    interface Session {
        user: ExtendedUser;
        student: student
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        role?: "ADMIN" | "USER";
        student?: student;
    }
}