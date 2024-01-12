"use server";
import {z} from "zod";
import {RegisterSchema} from "@/schemas";
import bcrypt from "bcryptjs";
import {db} from "@/lib/db";
import {getStudentByStudentNumber, getUserByEmail} from "@/data/users";
import {generateVerificationToken} from "@/lib/tokens";
import {sendVerificationEmail} from "@/lib/mail";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
    const validatedFields = RegisterSchema.safeParse(values);
    console.log("REGISTER")

    if (!validatedFields.success) {
        return {error: "Invalid field!"};
    }
    console.log("Valide fields")

    const {last_name, first_name, student_number, email, password} = validatedFields.data;
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await getUserByEmail(email)

    if (existingUser) {
        return {error: "Email already in use"}
    }

    const existingStudent = await getStudentByStudentNumber(student_number)

    if (!existingStudent || existingStudent.last_name != last_name || existingStudent.first_name != first_name) {
        return {error: "Veuillez vérifier vos informations"}
    }
    console.log("Student exist")

    await db.user.create({
        data: {
            email,
            hashed_password: hashedPassword,
        }
    });
    console.log("User created")

    const verificationToken = await generateVerificationToken(email);

    await sendVerificationEmail(verificationToken.email, verificationToken.token);

    return {success: "Confirmation email sent"}
}