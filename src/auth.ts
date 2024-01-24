import NextAuth from "next-auth"
import {PrismaAdapter} from "@auth/prisma-adapter";
import {student, UserRole} from "@prisma/client"
import authConfig from "@/auth.config";
import prisma from "@/lib/prisma"
import {getStudentByUserId, getUserById} from "@/data/users";

export const {
    handlers: {GET, POST},
    auth,
    signIn,
    signOut,
} = NextAuth({
    pages: {
        signIn: "/auth/login",
        error: "/auth/error",
    },
    events: {
        async linkAccount({user}) {
            await prisma.user.update({
                where: {id: user.id},
                data: {emailVerified: new Date()}
            })
        },
    },
    callbacks: {
        async signIn({user, account}) {
            // Allow OAuth without email verification
            if (account?.provider !== "credentials") return true;

            const existingUser = await getUserById(user.id);

            // Prevent sign in without email verification
            if (!existingUser?.emailVerified) return false;

            return true;
        },
        async session({token, session}) {
            if (token.sub && session.user) {
                session.user.id = token.sub;
            }
            if (token.role && session.user) {
                session.user.role = token.role as UserRole;
            }

            if (token.student && session.user) {
                session.student = token.student as student;
            }

            return session;
        },
        async jwt({token}) {
            if (!token.sub) return token;

            const existingUser = await getUserById(token.sub);
            if (!existingUser) return token;

            token.role = existingUser.role;

            const existingStudent = await getStudentByUserId(existingUser.id)
            if (!existingStudent) return token;

            token.student = existingStudent;

            return token;
        }
    },
    adapter: PrismaAdapter(prisma),
    session: {strategy: "jwt"},
    ...authConfig
});