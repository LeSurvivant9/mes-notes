import * as z from "zod";
import {
  CompleteAccount,
  CompleteDepartment,
  CompleteGrade,
  RelatedAccountSchema,
  RelatedDepartmentSchema,
  RelatedGradeSchema,
} from "./index";

export const StudentSchema = z.object({
  studentNumber: z.string(),
  lastName: z.string(),
  firstName: z.string(),
  entryYear: z.number().int().nullish(),
  level: z.number().int(),
  departmentId: z.string(),
});

export interface CompleteStudent extends z.infer<typeof StudentSchema> {
  department: CompleteDepartment;
  account: CompleteAccount[];
  grades: CompleteGrade[];
}

/**
 * RelatedStudentSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedStudentSchema: z.ZodSchema<CompleteStudent> = z.lazy(() =>
  StudentSchema.extend({
    department: RelatedDepartmentSchema,
    account: RelatedAccountSchema.array(),
    grades: RelatedGradeSchema.array(),
  }),
);
