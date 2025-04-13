import { adminUsage } from '#abilities/users_page'
import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'
import drive from '@adonisjs/drive/services/main'
import { FilesType } from '../types/files.type.js'

export default class PagesController {
  async dashboard(ctx: HttpContext) {
    const folderPath = ctx.params.folder ? decodeURIComponent(ctx.params.folder) : ''
    const disk = drive.use()
    const response = await disk.listAll(folderPath)
    const files: FilesType = []

    for (const item of response.objects) {
      if (item.isFile) {
        const metadata = await item.getMetaData()
        files.push({
          name: item.name,
          modified_at: metadata.lastModified,
          size: metadata.contentLength,
          type: 'file',
        })
      } else {
        files.push({
          name: item.name,
          modified_at: null,
          size: null,
          type: 'folder',
        })
      }
    }

    return ctx.inertia.render('dashboard', {
      errors: ctx.session.flashMessages.get('errors'),
      files,
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
