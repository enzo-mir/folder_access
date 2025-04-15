import { z } from 'zod'

export const createRoleSchema = z.object({
  role: z.string().transform((v) => v.trim()),
  level: z.number().min(0),
})

export const updateRoleSchema = createRoleSchema.extend({
  id: z.number(),
})

export const deletRoleSchema = z.object({
  id: z.number(),
})
