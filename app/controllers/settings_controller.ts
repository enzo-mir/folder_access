import { type HttpContext } from '@adonisjs/core/http'
import { createUserSchema, deleteUserSchema, updateUserSchema } from '../validator/user.schema.js'
import User from '#models/user'
import { ZodError } from 'zod'
import { createRoleSchema, deletRoleSchema, updateRoleSchema } from '../validator/role.schema.js'
import Role from '#models/role'
import { adminUsage } from '#abilities/admin_content'
import { sendCreds } from '../mail/create_user_mail.js'

export default class SettingsController {
  private bouncer = async (ctx: HttpContext, errors: string) => {
    if (await ctx.bouncer.denies(adminUsage)) {
      ctx.session.flash({
        errors,
      })
      return ctx.response.redirect().back()
    } else {
      return true
    }
  }

  public higherRole = async ({ adminContain }: { adminContain?: boolean }) => {
    const roles = await Role.query().select('level', 'id').orderBy('level', 'desc')

    return roles[adminContain ? 0 : 1]
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

  private getLoginUrl(ctx: HttpContext): string {
    const fullUrl = ctx.request.completeUrl()
    const requestUrl = ctx.request.url()
    return fullUrl.substring(0, fullUrl.lastIndexOf(requestUrl))
  }

  async manageUser(ctx: HttpContext) {
    await this.bouncer(ctx, "You don't have the access rights to create a user")

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
    await this.bouncer(ctx, "You don't have the access rights to delete a user")

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

  async createRole(ctx: HttpContext) {
    await this.bouncer(ctx, "You don't have the access rights to create a role")

    try {
      const payload = await createRoleSchema.parseAsync(ctx.request.body())

      const higherLevel = await this.higherRole({ adminContain: true })
      if (payload.level >= higherLevel!.level) {
        ctx.session.flash({
          errors: `The level access must be lower than ${higherLevel!.level} `,
        })
        return ctx.response.redirect().back()
      }

      await Role.create(payload)
      return ctx.response.redirect().back()
    } catch (error) {
      if ('code' in error) {
        if (error.code === 'ER_DUP_ENTRY') {
          ctx.session.flash({
            errors: 'Role must be unique',
          })
          return ctx.response.redirect().back()
        }
      }
      ctx.session.flash({
        errors: 'An error as occurred durring the create of role',
      })
      return ctx.response.redirect().back()
    }
  }

  async deleteRole(ctx: HttpContext) {
    await this.bouncer(ctx, "You don't have the access rights to delete a role")

    try {
      const payload = await deletRoleSchema.parseAsync(ctx.request.all())
      await Role.query().delete().where({ id: payload.id })
      return ctx.response.redirect().back()
    } catch (error) {
      ctx.session.flash({
        errors: 'An error as occurred durring the delete of role',
      })
      return ctx.response.redirect().back()
    }
  }

  async updateRole(ctx: HttpContext) {
    await this.bouncer(ctx, "You don't have the access rights to update a role")

    try {
      const payload = await updateRoleSchema.parseAsync(ctx.request.all())

      const currentUserRole = ctx.auth.user?.role

      const isUpdatingCurrentUserRole = currentUserRole === payload.role

      const higherLevelRole = await this.higherRole({ adminContain: !isUpdatingCurrentUserRole })

      if (
        higherLevelRole &&
        (isUpdatingCurrentUserRole
          ? payload.level <= higherLevelRole.level
          : payload.level >= higherLevelRole.level)
      ) {
        ctx.session.flash({
          errors: `The level access must be ${isUpdatingCurrentUserRole ? 'lower than or equal to' : 'higher than'} ${higherLevelRole.level}`,
        })
        return ctx.response.redirect().back()
      }

      await Role.query()
        .update({ role: payload.role, level: payload.level })
        .where({ id: payload.id })

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
            errors: 'Role must be unique',
          })
        }
      } else {
        ctx.session.flash({
          errors: 'An error as occurred durring the update of role',
        })
      }
      return ctx.response.redirect().back()
    }
  }

  async updateUser(ctx: HttpContext) {
    await this.bouncer(ctx, "You don't have the access rights to update a user")

    try {
      const payload = await updateUserSchema.parseAsync(ctx.request.all())
      const user = await User.findOrFail(payload.id)

      await user.merge(payload).save()

      return ctx.response.redirect().back()
    } catch (error) {
      return this.handleCreateUserError(ctx, error)
    }
  }
}
