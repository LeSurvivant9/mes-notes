import * as z from "zod"
import { CompleteTeachingUnit, RelatedTeachingUnitSchema, CompleteStudent, RelatedStudentSchema } from "./index"

export const DepartmentSchema = z.object({
  id: z.string(),
  name: z.string(),
})

export interface CompleteDepartment extends z.infer<typeof DepartmentSchema> {
  teachingUnits: CompleteTeachingUnit[]
  students: CompleteStudent[]
}

/**
 * RelatedDepartmentSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedDepartmentSchema: z.ZodSchema<CompleteDepartment> = z.lazy(() => DepartmentSchema.extend({
  teachingUnits: RelatedTeachingUnitSchema.array(),
  students: RelatedStudentSchema.array(),
}))
