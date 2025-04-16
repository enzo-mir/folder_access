import type { HttpContext } from '@adonisjs/core/http'
import { sendCreds } from '../mail/create_user_mail.js'
import User from '#models/user'
import { createUserSchema, deleteUserSchema, updateUserSchema } from '#validator/user.schema'
import { ZodError } from 'zod'
import { bouncer } from '#services/authorization'

export default class UsersController {
  private getLoginUrl(ctx: HttpContext): string {
    const fullUrl = ctx.request.completeUrl()
    const requestUrl = ctx.request.url()
    return fullUrl.substring(0, fullUrl.lastIndexOf(requestUrl))
  }

  private handleCreateUserError(ctx: HttpContext, error: any) {
    if (error instanceof ZodError) {
      ctx.session.flash({
        errors: 'There were errors with the information you provided.',
      })
    } else if ('code' in error && error.code === 'ER_DUP_ENTRY') {
      ctx.session.flash({
        errors: 'The username you entered is already taken.',
      })
    } else {
      ctx.session.flash({
        errors: 'An unexpected error occurred while creating the user.',
      })
    }
    return ctx.response.redirect().back()
  }

  async manageUser(ctx: HttpContext) {
    await bouncer(ctx, "You don't have the access rights to create a user")

    try {
      const parser = ctx.request.method() === 'PUT' ? updateUserSchema : createUserSchema
      const payload = await parser.parseAsync(ctx.request.all())

      if (payload.email) {
        const loginUrl = this.getLoginUrl(ctx)
        const getCode = 'code' in payload ? (payload.code as string) : undefined

        await sendCreds({
          username: payload.username,
          code: getCode,
          email: payload.email,
          loginUrl,
        })
        delete payload.email
      }
      if (payload.id) {
        const { id, ...updateData } = payload
        await User.query().update(updateData).where({ id: payload.id })
      } else {
        await User.create(payload)
      }

      return ctx.response.redirect().back()
    } catch (error) {
      return this.handleCreateUserError(ctx, error)
    }
  }

  async deleteUser(ctx: HttpContext) {
    await bouncer(ctx, "You don't have the access rights to delete a user")

    try {
      const payload = await deleteUserSchema.parseAsync(ctx.request.all())
      await User.query().delete().where({ id: payload.id })
      return ctx.response.redirect().back()
    } catch (error) {
      ctx.session.flash({
        errors: 'An error as occurred durring the delete of user',
      })
      return ctx.response.redirect().back()
    }
  }
}
