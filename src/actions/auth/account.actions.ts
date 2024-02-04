import prisma from "@/lib/prisma";

export const getAccountByKey = async (key: string, value: string) => {
  const user = await prisma.account.findFirst({ where: { [key]: value } });
  return user;
};
