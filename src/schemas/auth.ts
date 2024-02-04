import { z } from "zod";

export const RegisterSchema = z.object({
  lastName: z.string().min(1, {
    message: "Nom de famille requis",
  }),
  firstName: z.string().min(1, {
    message: "Prénom requis",
  }),
  studentNumber: z
    .string()
    .min(1, {
      message: "Numéro étudiant requis",
    })
    .max(8),
  email: z.string().email({
    message: "Email requis",
  }),
  password: z.string().min(6, {
    message: "Minimum 6 caractères requis",
  }),
});

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Email requis",
  }),
  password: z.string().min(1, {
    message: "Mot de passe requis",
  }),
});

export const ResetSchema = z.object({
  email: z.string().email({
    message: "Email requis",
  }),
});

export const NewPasswordSchema = z.object({
  password: z.string().min(6, {
    message: "Minimum 6 caractères requis",
  }),
});
