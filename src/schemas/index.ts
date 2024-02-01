import { z } from "zod";

const t = "";
export const UserSchema = z.object({
  id: z.number().optional(),
  name: z.string().optional(),
  username: z.string().optional(),
  image: z.string().optional(),
  hashedPassword: z.string().optional(),
  role: z.enum(["ADMIN", "USER"]),
  emailVerified: z.date().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

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

export const DepartmentSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, {
    message: "Nom du département requis",
  }),
});

export const TeachingUnitSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, {
    message: "Nom de l'UE requis",
  }),
  semester: z.number().int({
    message: "Semestre requis",
  }),
  departmentId: z.number().int(),
});

export const SubjectSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, {
    message: "Nom de la matière requis",
  }),
  coefficient: z.number().int({
    message: "Coefficient requis",
  }),
  teachingUnitId: z.number().int(),
});

export const StudentSchema = z.object({
  id: z.number().optional(),
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
  level: z.number().int({
    message: "Niveau d'étude requis",
  }),
  departmentId: z.number().int(),
});

export const GradeSchema = z.object({
  id: z.number().optional(),
  value: z.number({
    required_error: "Note requise",
  }),
  studentId: z.number().int(),
  assessmentId: z.number().int(),
});

export const AssessmentSchema = z.object({
  id: z.number().optional(),
  type: z.enum(["CC", "TP", "EXAM"]),
  date: z.date().optional(),
  coefficient: z.number().int(),
  fileName: z.string().min(1, {
    message: "Nom du fichier requis",
  }),
  period: z.number().int(),
  subjectId: z.number().int(),
});
