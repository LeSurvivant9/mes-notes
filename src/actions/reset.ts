"use server";

import {ResetSchema} from "@/schemas";
import {getUserByEmail} from "@/data/users";
import {z} from "zod";
import {generatePasswordResetToken} from "@/lib/tokens";
import {sendPasswordResetEmail} from "@/lib/mail";

export const reset = async (values: z.infer<typeof ResetSchema>) => {
    const validatedFields = ResetSchema.safeParse(values);

    if (!validatedFields.success) {
        return {error: "Invalid email!"};
    }

    const {email} = validatedFields.data;

    const existingUser = await getUserByEmail(email);

    if (!existingUser) {
        return {error: "Email not found!"};
    }

    const passwordResetToken = await generatePasswordResetToken(email);
    await sendPasswordResetEmail(passwordResetToken.email, passwordResetToken.token);

    return {success: "Reset email sent!"}
}