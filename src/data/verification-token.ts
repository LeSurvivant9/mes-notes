import prisma from "@/lib/prisma";

export const getVerificationTokenByToken = async (token: string) => {
  try {
    return prisma.verificationToken.findUnique({
      where: { token },
    });
  } catch {
    return null;
  }
};

export const getVerificationTokenByEmail = async (email: string) => {
  try {
    return prisma.verificationToken.findFirst({
      where: { email },
    });
  } catch {
    return null;
  }
};
