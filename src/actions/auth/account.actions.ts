"use server";
import prisma from "@/lib/prisma";

export const getAccountByKey = async (key: string, value: string) => {
  return prisma.account.findFirst({ where: { [key]: value } });
};
