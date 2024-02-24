import * as z from "zod"

export const PasswordResetTokenSchema = z.object({
  id: z.string(),
  email: z.string(),
  token: z.string(),
  expires: z.date(),
})
