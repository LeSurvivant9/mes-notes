import * as z from "zod";
import {
  CompleteTeachingUnit,
  RelatedTeachingUnitSchema,
  CompleteAssessment,
  RelatedAssessmentSchema,
} from "./index";

export const SubjectSchema = z.object({
  id: z.string(),
  name: z.string(),
  coefficient: z.number().int(),
  ccCoefficient: z.number().int().nullish(),
  tpCoefficient: z.number().int().nullish(),
  examCoefficient: z.number().int().nullish(),
  teachingUnitId: z.string(),
});

export interface CompleteSubject extends z.infer<typeof SubjectSchema> {
  teachingUnit: CompleteTeachingUnit;
  assessments: CompleteAssessment[];
}

/**
 * RelatedSubjectSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedSubjectSchema: z.ZodSchema<CompleteSubject> = z.lazy(() =>
  SubjectSchema.extend({
    teachingUnit: RelatedTeachingUnitSchema,
    assessments: RelatedAssessmentSchema.array(),
  }),
);
