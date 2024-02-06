import * as z from "zod";
import { AssessmentType } from "@prisma/client";
import {
  CompleteSubject,
  RelatedSubjectSchema,
  CompleteGrade,
  RelatedGradeSchema,
} from "./index";

export const AssessmentSchema = z.object({
  id: z.string(),
  type: z.nativeEnum(AssessmentType),
  date: z.date(),
  coefficient: z.number().int(),
  fileName: z.string(),
  period: z.number().int(),
  subjectId: z.string(),
});

export interface CompleteAssessment extends z.infer<typeof AssessmentSchema> {
  subject: CompleteSubject;
  grades: CompleteGrade[];
}

/**
 * RelatedAssessmentSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedAssessmentSchema: z.ZodSchema<CompleteAssessment> = z.lazy(
  () =>
    AssessmentSchema.extend({
      subject: RelatedSubjectSchema,
      grades: RelatedGradeSchema.array(),
    }),
);
