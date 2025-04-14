import { z } from 'zod'

export const createPermissionSchema = z.object({
  permission: z.string().min(1, { message: 'Permission is required' }),
  path: z.string().min(1, { message: 'Path is required' }),
})

export const deletePermissionSchema = z.object({
  id: z.number().min(1, { message: 'ID is required' }),
})
