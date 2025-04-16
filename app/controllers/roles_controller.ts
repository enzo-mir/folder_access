import Role from '#models/role'
import { bouncer } from '#services/authorization'
import { createRoleSchema, deletRoleSchema, updateRoleSchema } from '#validator/role.schema'
import type { HttpContext } from '@adonisjs/core/http'
import { ZodError } from 'zod'

export default class RolesController {
  public higherRole = async ({ adminContain }: { adminContain?: boolean }) => {
    const roles = await Role.query().select('level', 'id').orderBy('level', 'desc')

    return roles[adminContain ? 0 : 1]
  }

  async createRole(ctx: HttpContext) {
    await bouncer(ctx, "You don't have the access rights to create a role")

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
    await bouncer(ctx, "You don't have the access rights to delete a role")

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
    await bouncer(ctx, "You don't have the access rights to update a role")

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
}
