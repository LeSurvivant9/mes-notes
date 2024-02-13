"use server";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { UserSchema } from "@/schemas";
import { signIn } from "next-auth/react";

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

export const updateUser = async (id: string, data: object) => {
  try {
    const user = await prisma.user.update({
      where: { id },
      data,
    });

    // Tentative de revalidation de la session après la mise à jour de l'utilisateur
    // Notez que cela nécessite que req soit passé à updateUser lors de l'appel
    await signIn("credentials", { redirect: false });

    return {
      success: `"${user.name}" a été modifié avec succès`,
      error: "",
      user,
    };
  } catch (error) {
    return {
      success: "",
      error: "Problème avec la modification de l'utilisateur" + error,
      user: null,
    };
  }
};
