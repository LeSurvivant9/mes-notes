"use server";
import {z} from "zod";
import {RegisterSchema} from "@/schemas";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import {getStudentByStudentNumber, getUserByEmail} from "@/data/users";
import {generateVerificationToken} from "@/lib/tokens";
import {sendVerificationEmail} from "@/lib/mail";
import {AccountType} from "@prisma/client";
import {capitalize, removeAccents, toUpperCase} from "@/lib/utils";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
    try {
        const validatedFields = RegisterSchema.safeParse(values);
        if (!validatedFields.success) {
            return {error: "Invalid field!"};
        }

        const {last_name, first_name, student_number, email, password} = validatedFields.data;
        const lowerCaseEmail = email.toLowerCase();
        const normalizedLastName = toUpperCase(removeAccents(last_name));
        const normalizedFirstName = capitalize(removeAccents(first_name));
        const hashedPassword = await bcrypt.hash(password, 10);

        const [existingUser, existingStudent] = await Promise.all([
            getUserByEmail(lowerCaseEmail),
            getStudentByStudentNumber(student_number)
        ]);

        if (existingUser) {
            return {error: "Adresse email déjà utilisée"}
        }
        if (!existingStudent || existingStudent.last_name != normalizedLastName || existingStudent.first_name != normalizedFirstName) {
            return {error: "Informations incorrectes, veuillez réessayer"};
        }

        await prisma.$transaction(async (prisma) => {
            const user = await prisma.user.create({
                data: {
                    email: lowerCaseEmail,
                    hashed_password: hashedPassword,
                },
            });

            await prisma.account.create({
                data: {
                    user_id: user.id,
                    student_id: existingStudent.id,
                    type: AccountType.STUDENT,
                },
            });
        });

        const verificationToken = await generateVerificationToken(lowerCaseEmail);
        await sendVerificationEmail(verificationToken.email, verificationToken.token);

        return {success: "Email de confirmation envoyé"}
    } catch (error) {
        console.error(error);
        return {error: "Oop! Veuillez recharger la page et réessayer"}
    }
}