import { z } from 'zod'

export const createUserSchema = z.object({
  id: z.number().optional(),
  username: z.string().transform((v) => v.trim()),
  role: z.string().transform((v) => v.trim()),
  code: z.string().transform((v) => v.trim()),
  email: z.string().email().optional(),
})

export const updateUserSchema = createUserSchema.omit({
  code: true,
})

export const deleteUserSchema = z.object({
  id: z.number(),
})
