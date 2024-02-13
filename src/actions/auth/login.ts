"use server";
import { signIn } from "@/auth";
import { sendVerificationEmail } from "@/lib/mail";
import { generateVerificationToken } from "@/lib/tokens";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { LoginSchema } from "@/schemas/auth";
import { AuthError } from "next-auth";
import { z } from "zod";
import { getUserByKey } from "@/actions/auth/user.actions";

export const login = async (
  values: z.infer<typeof LoginSchema>,
  callbackUrl?: string | null,
) => {
  const { email, password } = values;

  const lowerCaseEmail = email.toLowerCase();
  const existingUser = await getUserByKey("email", lowerCaseEmail);
  if (!existingUser?.email || !existingUser?.hashedPassword) {
    return { error: "Adresse mail non reconnue" };
  }

  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(
      existingUser.email,
    );
    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token,
    );
    return { success: "Confirmation email sent!" };
  }

  try {
    await signIn("credentials", {
      email: lowerCaseEmail,
      password,
      redirectTo: callbackUrl ?? DEFAULT_LOGIN_REDIRECT,
    });
    return { success: "Connexion réussie" };
  } catch (error) {
    if (error instanceof AuthError) {
      if (error.type === "CredentialsSignin") {
        return { error: "Identifiants non valides" };
      }
      return { error: "Oop! Veuillez recharger la page et réessayer" };
    }
    throw error;
  }
};
