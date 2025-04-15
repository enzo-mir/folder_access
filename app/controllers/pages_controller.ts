import { adminUsage } from '#abilities/admin_content'
import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'
import drive from '@adonisjs/drive/services/main'
import fs from 'node:fs'
import { getFiles } from '#services/get_folder_qs'
import { permissionsByRole } from '#services/get_permissions'
import { getAccessFolders } from '#abilities/fetch_folders'

export default class PagesController {
  async dashboard(ctx: HttpContext) {
    const folderPath = ctx.params.folder ? decodeURIComponent(ctx.params.folder) : ''

    if (
      (await ctx.bouncer.denies(getAccessFolders, folderPath)) &&
      ctx.request.url() !== '/dashboard'
    ) {
      return ctx.response.redirect().toRoute('dashboard')
    }

    const disk = drive.use()
    const files = await getFiles(ctx, folderPath, disk)
    const content = files ? undefined : fs.readFileSync(`storage/${folderPath}`, 'utf-8')

    return ctx.inertia.render('dashboard', {
      errors: ctx.session.flashMessages.get('errors'),
      files,
      content,
      currentPath: folderPath,
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
    if (await ctx.bouncer.denies(adminUsage)) {
      return ctx.response.redirect().toRoute('dashboard')
    }

    const users = await User.query().select('id', 'username', 'role', 'created_at')

    return ctx.inertia.render('users', {
      users,
      errors: ctx.session.flashMessages.get('errors'),
    })
  }

  async settings(ctx: HttpContext) {
    if (await ctx.bouncer.denies(adminUsage)) {
      return ctx.response.redirect().toRoute('dashboard')
    }
    const folderPermissions = await permissionsByRole()

    return ctx.inertia.render('settings', {
      errors: ctx.session.flashMessages.get('errors'),
      folderPermissions,
    })
  }
}
