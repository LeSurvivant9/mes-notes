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
    console.log("LOGIN")

    if (!validatedFields.success) {
        return {error: "Invalid field!"};
    }
    console.log("Valide fields")

    const {email, password} = validatedFields.data;

    const existingUser = await getUserByEmail(email);
    console.log({user: existingUser}, {mail: email})
    if (!existingUser || !existingUser.email || !existingUser.hashed_password) {
        return {error: "Email does not exist!"}
    }
    console.log("User exist")

    if (!existingUser.emailVerified) {
        const verificationToken = await generateVerificationToken(existingUser.email);
        await sendVerificationEmail(verificationToken.email, verificationToken.token);
        return {success: "Confirmation email sent!"}
    }
    console.log("User mail confirmed")

    try {
        await signIn("credentials", {
            email,
            password,
            redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT,
        })
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return {error: "Invalid credentials"}
                default:
                    return {error: "Something went wrong"}
            }
        }
        throw error;
    }
}