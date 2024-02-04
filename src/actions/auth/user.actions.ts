import prisma from "@/lib/prisma";
import { z } from "zod";
import { UserSchema } from "@/schemas";

export const getAllUsers = async () => {
  return prisma.user.findMany({
    orderBy: {
      id: "asc",
    },
  });
};

export const getUserByKey = async (key: string, value: string) => {
  return prisma.user.findFirst({
    where: { [key]: value },
  });
};
export const createUser = async (data: z.infer<typeof UserSchema>) => {
  try {
    const user = await prisma.user.create({
      data,
    });
    return {
      success: `${user.name} a été ajouté avec succès`,
      error: "",
      user,
    };
  } catch {
    return {
      success: "",
      error: "Problème avec la création de l'utilisateur",
      user: null,
    };
  }
};

export const updateUser = async (
  id: string,
  data: z.infer<typeof UserSchema>,
) => {
  try {
    const user = await prisma.user.update({
      where: { id },
      data,
    });
    return {
      success: `"${user.name}" a été modifié avec succès`,
      error: "",
      user,
    };
  } catch {
    return {
      success: "",
      error: "Problème avec la modification de l'utilisateur",
      user: null,
    };
  }
};
