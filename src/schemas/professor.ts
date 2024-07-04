import * as z from "zod";
import { CompleteAccount, RelatedAccountSchema } from "./index";

export const ProfessorSchema = z.object({
  id: z.string(),
  lastName: z.string(),
  firstName: z.string(),
});

export interface CompleteProfessor extends z.infer<typeof ProfessorSchema> {
  account: CompleteAccount[];
}

/**
 * RelatedProfessorSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedProfessorSchema: z.ZodSchema<CompleteProfessor> = z.lazy(
  () =>
    ProfessorSchema.extend({
      account: RelatedAccountSchema.array(),
    }),
);
