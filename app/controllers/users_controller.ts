import { type HttpContext } from '@adonisjs/core/http'
import { createuserSchema } from '../validator/user.schema.js'
import User from '#models/user'
import { ZodError } from 'zod'

export default class UsersController {
  async create(ctx: HttpContext) {
    try {
      const payload = await createuserSchema.parseAsync(ctx.request.all())
      await User.create(payload)
      return ctx.response.redirect().back()
    } catch (error) {
      if (error instanceof ZodError) {
        ctx.session.flash({
          errors: 'An error as occurred with the information given',
        })
      }
      if ('code' in error) {
        if (error.code === 'ER_DUP_ENTRY') {
          ctx.session.flash({
            errors: 'Username must be unique',
          })
        }
      }
      return ctx.response.redirect().back()
    }
  }
}
