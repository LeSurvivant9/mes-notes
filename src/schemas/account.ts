import * as z from "zod";
import { AccountType } from "@prisma/client";
import {
  CompleteUser,
  RelatedUserSchema,
  CompleteStudent,
  RelatedStudentSchema,
  CompleteProfessor,
  RelatedProfessorSchema,
} from "./index";

export const AccountSchema = z.object({
  id: z.string(),
  userId: z.string(),
  studentNumber: z.string().nullish(),
  professorId: z.string().nullish(),
  type: z.nativeEnum(AccountType),
});

export interface CompleteAccount extends z.infer<typeof AccountSchema> {
  user: CompleteUser;
  student?: CompleteStudent | null;
  professor?: CompleteProfessor | null;
}

/**
 * RelatedAccountSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedAccountSchema: z.ZodSchema<CompleteAccount> = z.lazy(() =>
  AccountSchema.extend({
    user: RelatedUserSchema,
    student: RelatedStudentSchema.nullish(),
    professor: RelatedProfessorSchema.nullish(),
  }),
);
