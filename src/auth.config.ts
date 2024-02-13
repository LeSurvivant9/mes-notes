import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { LoginSchema } from "@/schemas/auth";
import bcrypt from "bcryptjs";
import { getUserByKey } from "@/actions/auth/user.actions";

export default {
  providers: [
    Credentials({
      async authorize(credentials) {
        const validatedFields = LoginSchema.safeParse(credentials);

        if (validatedFields.success) {
          const { email, password } = validatedFields.data;

          const user = await getUserByKey("email", email);
          if (!user || !user.hashedPassword) return null;

          const passwordsMatch = await bcrypt.compare(
            password,
            user.hashedPassword,
          );

          if (passwordsMatch) return user;
        }
        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;
