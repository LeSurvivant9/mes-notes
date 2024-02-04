import * as z from "zod"
import { UserRole } from "@prisma/client"
import { CompleteAccount, RelatedAccountSchema } from "./index"

export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  username: z.string().nullish(),
  image: z.string().nullish(),
  hashedPassword: z.string().nullish(),
  role: z.nativeEnum(UserRole),
  emailVerified: z.date().nullish(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export interface CompleteUser extends z.infer<typeof UserSchema> {
  account: CompleteAccount[]
}

/**
 * RelatedUserSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedUserSchema: z.ZodSchema<CompleteUser> = z.lazy(() => UserSchema.extend({
  account: RelatedAccountSchema.array(),
}))
