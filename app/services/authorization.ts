import { adminUsage } from '#abilities/admin_content'
import { HttpContext } from '@adonisjs/core/http'

export const bouncer = async (ctx: HttpContext, errors: string) => {
  if (await ctx.bouncer.denies(adminUsage)) {
    ctx.session.flash({
      errors,
    })
    return ctx.response.redirect().back()
  } else {
    return true
  }
}
