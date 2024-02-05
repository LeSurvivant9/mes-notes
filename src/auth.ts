import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { UserRole } from "@prisma/client";
import authConfig from "@/auth.config";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { StudentSchema } from "@/schemas";
import { getUserByKey } from "@/actions/auth/user.actions";
import { getStudentByKey } from "@/actions/admin/student.actions";
import { getAccountByKey } from "@/actions/auth/account.actions";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  events: {
    async linkAccount({ user }) {
      await prisma.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      });
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      // Allow OAuth without email verification
      if (account?.provider !== "credentials") return true;

      const existingUser = await getUserByKey("id", user.id);

      // Prevent sign in without email verification
      return !!(existingUser && existingUser.emailVerified);
    },
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      session.user.role = token.role as UserRole;

      session.student = token.student as z.infer<typeof StudentSchema>;

      return session;
    },
    async jwt({ token }) {
      if (!token.sub) return token;

      const existingUser = await getUserByKey("id", token.sub);
      if (!existingUser) return token;

      token.role = existingUser.role;

      const existingAccount = await getAccountByKey("userId", existingUser.id);
      if (!existingAccount || !existingAccount.studentNumber) return token;

      token.student = await getStudentByKey(
        "studentNumber",
        existingAccount.studentNumber,
      );

      return token;
    },
  },
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  ...authConfig,
});
