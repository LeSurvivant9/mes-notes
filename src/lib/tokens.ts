import {v4 as uuidv4} from "uuid";
import prisma from "@/lib/prisma"
import {getVerificationTokenByEmail} from "@/data/verification-token";
import {getPasswordResetTokenByEmail} from "@/data/password-reset-token";

export const generatePasswordResetToken = async (email: string) => {
    const token = uuidv4();
    const expires = new Date(new Date().getTime() + 3600 * 1000);

    const existingToken = await getPasswordResetTokenByEmail(email);

    if (existingToken) {
        await prisma.password_reset_token.delete({
            where: {id: existingToken.id}
        });
    }

    const passwordResetToken = await prisma.password_reset_token.create({
        data: {
            email,
            token,
            expires,
        }
    })

    return passwordResetToken;
}

export const generateVerificationToken = async (email: string) => {
    const token = uuidv4();
    const expires = new Date(new Date().getTime() + 3600 * 1000);

    const existingToken = await getVerificationTokenByEmail(email);

    if (existingToken) {
        await prisma.verification_token.delete({
            where: {
                id: existingToken.id,
            },
        });
    }

    const verificationToken = await prisma.verification_token.create({
        data: {
            email,
            token,
            expires,
        }
    });

    return verificationToken;
}