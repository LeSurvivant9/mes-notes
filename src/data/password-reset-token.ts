import prisma from "@/lib/prisma";

export const getPasswordResetTokenByToken = async (token: string) => {
    try {
        const passwordResetToken = await prisma.password_reset_token.findUnique({
            where: {token}
        });

        return passwordResetToken;
    } catch {
        return null;
    }
};

export const getPasswordResetTokenByEmail = async (email: string) => {
    try {
        const passwordResetToken = await prisma.password_reset_token.findFirst({
            where: {email}
        });

        return passwordResetToken;
    } catch {
        return null;
    }
};