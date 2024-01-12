import prisma from '@/lib/prisma';

export const getVerificationTokenByToken = async (token: string) => {
    try {
        const verifactionToken = await prisma.verification_token.findUnique({
            where: {token}
        });

        return verifactionToken;
    } catch {
        return null;
    }
}


export const getVerificationTokenByEmail = async (email: string) => {
    try {
        const verifactionToken = await prisma.verification_token.findFirst({
            where: {email}
        });

        return verifactionToken;
    } catch {
        return null;
    }
}