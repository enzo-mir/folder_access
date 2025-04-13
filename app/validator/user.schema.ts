import { z } from 'zod'

export const createUserSchema = z.object({
  username: z.string().transform((v) => v.trim()),
  role: z.string().transform((v) => v.trim()),
  code: z.string().transform((v) => v.trim()),
})
