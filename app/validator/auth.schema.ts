import { z } from 'zod'

export const loginSchema = z.object({
  username: z.string().transform((val) => val.trim()),
  code: z.string().transform((val) => val.trim()),
})
