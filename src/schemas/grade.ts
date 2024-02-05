import * as z from "zod";
import {
  CompleteAssessment,
  CompleteStudent,
  RelatedAssessmentSchema,
  RelatedStudentSchema,
} from "./index";

export const GradeSchema = z.object({
  id: z.string(),
  value: z.number(),
  studentNumber: z.string(),
  assessmentId: z.string(),
});

export interface CompleteGrade extends z.infer<typeof GradeSchema> {
  student: CompleteStudent;
  assessment: CompleteAssessment;
}

/**
 * RelatedGradeSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedGradeSchema: z.ZodSchema<CompleteGrade> = z.lazy(() =>
  GradeSchema.extend({
    student: RelatedStudentSchema,
    assessment: RelatedAssessmentSchema,
  }),
);
