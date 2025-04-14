import { z } from 'zod'

// Common disallowed names (Windows reserved names)
const DISALLOWED_NAMES = /^(con|prn|aux|nul|com[0-9]|lpt[0-9])$/i

const baseNameSchema = z
  .string()
  .min(1, 'Name cannot be empty')
  .max(255, 'Name too long (max 255 characters)')
  .regex(/^[^.\s]/, 'Cannot start with a dot or space')
  .regex(/[^.\s]$/, 'Cannot end with a dot or space')
  .regex(/^[^\\/]+$/, 'Cannot contain path separators (/, \\)')
  .regex(/^[^<>:"|?*]+$/, 'Cannot contain <>:"|?* characters')
  .refine(
    (val) => !DISALLOWED_NAMES.test(val),
    (val) => ({ message: `"${val}" is a reserved system name` })
  )
  .refine((val) => !val.includes('..'), 'Cannot contain consecutive dots')
  .transform((val) => val.trim())

const filenameSchema = baseNameSchema
  .refine((val) => val.includes('.'), { message: 'Filename must include an extension' })
  .refine(
    (val) => {
      const ext = val.split('.').pop()
      return ext && ext.length >= 1
    },
    { message: 'Extension cannot be empty' }
  )
  .optional()

const dirNameSchema = baseNameSchema
  .refine((val) => !val.includes('.'), { message: 'Directory name should not contain dots' })
  .optional()

export const addFileSchema = z.object({
  fileName: filenameSchema,
  direName: dirNameSchema,
})

export const editFileSchema = z.object({
  content: z.union([z.string(), z.null()]).transform((val) => val ?? ''),
})
