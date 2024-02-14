"use server";
import { sendVerificationEmail } from "@/lib/mail";
import prisma from "@/lib/prisma";
import { generateVerificationToken } from "@/lib/tokens";
import { capitalize, removeAccents, toUpperCase } from "@/lib/utils";
import { RegisterSchema } from "@/schemas/auth";
import { AccountType } from "@prisma/client";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { getUserByKey } from "@/actions/auth/user.actions";
import { getStudentByKey } from "@/actions/admin/student.actions";
import { v4 as uuidv4 } from "uuid";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  try {
    const { lastName, firstName, studentNumber, email, password } = values;
    const lowerCaseEmail = email.toLowerCase().trim();
    const normalizedLastName = toUpperCase(removeAccents(lastName.trim()));
    const normalizedFirstName = capitalize(removeAccents(firstName.trim()));
    const hashedPassword = await bcrypt.hash(password, 10);

    const [existingUser, existingStudent] = await Promise.all([
      getUserByKey("email", lowerCaseEmail),
      getStudentByKey("studentNumber", studentNumber),
    ]);

    if (existingUser) {
      return { error: "Adresse email déjà utilisée" };
    }

    const normalizedExistingLastName = toUpperCase(
      removeAccents(existingStudent?.lastName as string).trim(),
    );
    const normalizedExistingFirstName = capitalize(
      removeAccents(existingStudent?.firstName as string).trim(),
    );
    if (
      !existingStudent ||
      normalizedExistingLastName !== normalizedLastName ||
      normalizedExistingFirstName !== normalizedFirstName
    ) {
      return { error: "Informations incorrectes, veuillez réessayer" };
    }

    await prisma.$transaction(async (prisma) => {
      const user = await prisma.user.create({
        data: {
          id: uuidv4(),
          name: `${normalizedFirstName} ${normalizedLastName}`,
          email: lowerCaseEmail,
          hashedPassword: hashedPassword,
        },
      });

      await prisma.account.create({
        data: {
          userId: user.id,
          studentNumber: existingStudent.studentNumber,
          type: AccountType.STUDENT,
        },
      });
    });

    const verificationToken = await generateVerificationToken(lowerCaseEmail);
    const response = await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token,
    );

    return { success: response.success, error: response.error };
  } catch (error) {
    console.error(error);
    return { error: "Oops! Veuillez recharger la page et réessayer" };
  }
};
