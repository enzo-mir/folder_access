import { type HttpContext } from '@adonisjs/core/http'
import { createUserSchema, deleteUserSchema } from '../validator/user.schema.js'
import User from '#models/user'
import { ZodError } from 'zod'
import { createRoleSchema, deletRoleSchema, updateRoleSchema } from '../validator/role.schema.js'
import Role from '#models/role'
import { adminUsage } from '#abilities/users_page'
import { sendCreds } from '../mail/create_user_mail.js'

export default class SettingsController {
  private bouncer = async (ctx: HttpContext, errors: string) => {
    if (await ctx.bouncer.denies(adminUsage)) {
      ctx.session.flash({
        errors,
      })
      return ctx.response.redirect().back()
    }
  }

  public higherRole = async ({ isMin }: { isMin?: boolean }) => {
    const roles = await Role.query().select('level', 'id').orderBy('level', 'desc')

    return roles[isMin ? 0 : 1]
  }

  async createUser(ctx: HttpContext) {
    await this.bouncer(ctx, "You don't have the access rights to create a user")

    try {
      const payload = await createUserSchema.parseAsync(ctx.request.all())

      if (payload.email) {
        const loginUrl = ctx.request.completeUrl().split(ctx.request.url())[0]
        await sendCreds({
          email: payload.email,
          username: payload.username,
          code: payload.code,
          loginUrl,
        })
        delete payload.email
      }
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
      await Role.create(payload)
      return ctx.response.redirect().back()
    } catch (error) {
      console.log(error)

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

      if (ctx.auth?.user?.role !== payload.role) {
        const higherLevel = await this.higherRole({
          isMin: true,
        })

        if (payload.level >= higherLevel!.level) {
          ctx.session.flash({
            errors: `The level access must be lower than ${higherLevel!.level} `,
          })
        } else {
          await Role.query()
            .update({ role: payload.role, level: payload.level })
            .where({ id: payload.id })
        }
        return ctx.response.redirect().back()
      } else {
        const higherLevel = await this.higherRole({ isMin: false })
        if (higherLevel!.level >= payload.level) {
          ctx.session.flash({
            errors: `The level access must be higher than ${higherLevel!.level}`,
          })
        } else {
          await Role.query()
            .update({ role: payload.role, level: payload.level })
            .where({ id: payload.id })
        }
        return ctx.response.redirect().back()
      }
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
}
