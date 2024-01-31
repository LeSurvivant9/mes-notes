"use server";
import { getStudentByStudentNumber, getUserByEmail } from "@/data/users";
import { sendVerificationEmail } from "@/lib/mail";
import prisma from "@/lib/prisma";
import { generateVerificationToken } from "@/lib/tokens";
import { capitalize, removeAccents, toUpperCase } from "@/lib/utils";
import { RegisterSchema } from "@/schemas";
import { AccountType } from "@prisma/client";
import bcrypt from "bcryptjs";
import { z } from "zod";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  try {
    const validatedFields = RegisterSchema.safeParse(values);
    if (!validatedFields.success) {
      return { error: "Invalid field!" };
    }

    const { lastName, firstName, studentNumber, email, password } =
      validatedFields.data;
    const lowerCaseEmail = email.toLowerCase();
    const normalizedLastName = toUpperCase(removeAccents(lastName));
    const normalizedFirstName = capitalize(removeAccents(firstName));
    const hashedPassword = await bcrypt.hash(password, 10);

    const [existingUser, existingStudent] = await Promise.all([
      getUserByEmail(lowerCaseEmail),
      getStudentByStudentNumber(studentNumber),
    ]);

    if (existingUser) {
      return { error: "Adresse email déjà utilisée" };
    }
    if (
      !existingStudent ||
      existingStudent.last_name != normalizedLastName ||
      existingStudent.first_name != normalizedFirstName
    ) {
      return { error: "Informations incorrectes, veuillez réessayer" };
    }

    await prisma.$transaction([
      prisma.user.create({
        data: {
          email: lowerCaseEmail,
          hashedPassword: hashedPassword,
        },
      }),
    ]);
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
    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token
    );

    return { success: "Email de confirmation envoyé" };
  } catch (error) {
    console.error(error);
    return { error: "Oop! Veuillez recharger la page et réessayer" };
  }
};
