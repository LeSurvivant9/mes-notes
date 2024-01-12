"use server";
import {z} from "zod";
import {RegisterSchema} from "@/schemas";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import {getStudentByStudentNumber, getUserByEmail} from "@/data/users";
import {generateVerificationToken} from "@/lib/tokens";
import {sendVerificationEmail} from "@/lib/mail";
import {AccountType} from "@prisma/client";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
    console.log({student: prisma.student.findMany()})
    console.log("REGISTER")

    const validatedFields = RegisterSchema.safeParse(values);
    if (!validatedFields.success) {
        return {error: "Invalid field!"};
    }
    console.log("Valid fields")

    const {last_name, first_name, student_number, email, password} = validatedFields.data;
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await getUserByEmail(email)
    console.log({user: existingUser}, {mail: email})
    if (existingUser) {
        return {error: "Email already in use"}
    }
    console.log("User exist")

    const existingStudent = await getStudentByStudentNumber(student_number)
    if (!existingStudent || existingStudent.last_name != last_name || existingStudent.first_name != first_name) {
        return {error: "Veuillez vérifier vos informations"}
    }
    console.log("Student exist")

    const user = await prisma.user.create({
        data: {
            email,
            hashed_password: hashedPassword,
        }
    });

    await prisma.account.create({
        data: {
            user_id: user.id,
            student_id: existingStudent.id,
            type: AccountType.STUDENT,
        }
    })

    const verificationToken = await generateVerificationToken(email);

    await sendVerificationEmail(verificationToken.email, verificationToken.token);

    return {success: "Confirmation email sent"}
}