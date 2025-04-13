import { adminUsage } from '#abilities/users_page'
import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class PagesController {
  async dashboard(ctx: HttpContext) {
    return ctx.inertia.render('dashboard', {
      errors: ctx.session.flashMessages.get('errors'),
    })
  }

  async login(ctx: HttpContext) {
    if (await ctx.auth.check()) {
      ctx.response.redirect().toRoute('dashboard')
    }
    return ctx.inertia.render('login', {
      errors: ctx.session.flashMessages.get('errors'),
    })
  }

  async users(ctx: HttpContext) {
    if (!(await ctx.bouncer.allows(adminUsage))) {
      return ctx.response.redirect().toRoute('dashboard')
    }

    const users = await User.query().select('id', 'username', 'role', 'created_at')

    return ctx.inertia.render('users', {
      users,
      errors: ctx.session.flashMessages.get('errors'),
    })
  }
}
