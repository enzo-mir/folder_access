import FolderPermission from '#models/folder_permission'
import type { HttpContext } from '@adonisjs/core/http'
import { createPermissionSchema } from '#validator/permission.schema'
import { ZodError } from 'zod'

export default class PermissionsController {
  async create(ctx: HttpContext) {
    try {
      const payload = await createPermissionSchema.parseAsync(ctx.request.all())
      await FolderPermission.create(payload)
      return ctx.response.redirect().back()
    } catch (error) {
      if ('code' in error && error.code === 'ER_DUP_ENTRY') {
        ctx.session.flash({
          errors: 'The relation path & acces right must be unique',
        })
        return ctx.response.redirect().back()
      }
      if (error instanceof ZodError) {
        ctx.session.flash('errors', error.issues[0].message)
      } else {
        ctx.session.flash('errors', { message: 'An unexpected error occurred' })
      }
      return ctx.response.redirect().back()
    }
  }
}
