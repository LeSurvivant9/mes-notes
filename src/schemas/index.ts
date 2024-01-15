import {z} from "zod";

export const RegisterSchema = z.object({
    last_name: z.string().min(1, {
        message: "Last name required"
    }),
    first_name: z.string().min(1, {
        message: "First name required"
    }),
    student_number: z.string().min(1, {
        message: "Student number required"
    }),
    email: z.string().email({
        message: "Email required"
    }),
    password: z.string().min(6, {
        message: "Minimum 6 characters required"
    }),
})

export const LoginSchema = z.object({
    email: z.string().email({
        message: "Email is required"
    }),
    password: z.string().min(1, {
        message: "Password is required"
    }),
})

export const ResetSchema = z.object({
    email: z.string().email({
        message: "Email is required"
    }),
})

export const NewPasswordSchema = z.object({
    password: z.string().min(6, {
        message: "Minimum 6 characters required"
    }),
})

export const DepartmentSchema = z.object({
    id: z.number().optional(),
    department_name: z.string().min(1),
})

export const TeachingUnitSchema = z.object({
    id: z.number().optional(),
    semester: z.number(),
    teaching_unit_name: z.string().min(1),
    department_id: z.number().int(),
})

export const SubjectSchema = z.object({
    id: z.number().optional(),
    teaching_unit_id: z.number().int(),
    subject_name: z.string(),
    subject_coefficient: z.number().int(),
})

export const StudentSchema = z.object({
    id: z.number().optional(),
})