import * as z from "zod";
import {
  CompleteDepartment,
  CompleteSubject,
  RelatedDepartmentSchema,
  RelatedSubjectSchema,
} from "./index";

export const TeachingUnitSchema = z.object({
  id: z.string(),
  name: z.string(),
  semester: z.number().int(),
  departmentId: z.string(),
});

export interface CompleteTeachingUnit
  extends z.infer<typeof TeachingUnitSchema> {
  department: CompleteDepartment;
  subjects: CompleteSubject[];
}

/**
 * RelatedTeachingUnitSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedTeachingUnitSchema: z.ZodSchema<CompleteTeachingUnit> =
  z.lazy(() =>
    TeachingUnitSchema.extend({
      department: RelatedDepartmentSchema,
      subjects: RelatedSubjectSchema.array(),
    }),
  );
