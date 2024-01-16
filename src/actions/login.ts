"use server";
import {z} from "zod";
import {LoginSchema} from "@/schemas";
import {signIn} from "@/auth";
import {DEFAULT_LOGIN_REDIRECT} from "@/routes";
import {AuthError} from "next-auth";
import {getUserByEmail} from "@/data/users";
import {generateVerificationToken} from "@/lib/tokens";
import {sendVerificationEmail} from "@/lib/mail";

export const login = async (values: z.infer<typeof LoginSchema>, callbackUrl?: string | null) => {
    const validatedFields = LoginSchema.safeParse(values);
    if (!validatedFields.success) {
        return {error: "Invalid field!"};
    }

    const {email, password} = validatedFields.data;
    const lowerCaseEmail = email.toLowerCase();

    const existingUser = await getUserByEmail(lowerCaseEmail);
    if (!existingUser?.email || !existingUser?.hashed_password) {
        return {error: "Adresse mail non reconnue"};
    }

    if (!existingUser.emailVerified) {
        const verificationToken = await generateVerificationToken(existingUser.email);
        await sendVerificationEmail(verificationToken.email, verificationToken.token);
        return {success: "Confirmation email sent!"}
    }

    try {
        await signIn("credentials", {
            email: lowerCaseEmail,
            password,
            redirectTo: callbackUrl ?? DEFAULT_LOGIN_REDIRECT,
        })
    } catch (error) {
        if (error instanceof AuthError) {
            if (error.type === "CredentialsSignin") {
                return {error: "Identifiants non valides"};
            }
            return {error: "Oop! Veuillez recharger la page et réessayer"};
        }
        throw error;
    }
}