import { adminUsage } from '#abilities/users_page'
import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'
import drive from '@adonisjs/drive/services/main'
import { FilesType } from '../types/files.type.js'
import { DriveDirectory, DriveFile } from '@adonisjs/drive'
import fs from 'node:fs'
import FolderPermission from '#models/folder_permission'

export default class PagesController {
  async dashboard(ctx: HttpContext) {
    const folderPath = ctx.params.folder ? decodeURIComponent(ctx.params.folder) : ''
    const disk = drive.use()

    const getFiles = async () => {
      if (folderPath === '') {
        return await disk.listAll()
      }
      return disk
        .exists(folderPath)
        .then(async () => {
          return await disk.listAll(folderPath)
        })
        .catch(() => {
          return {}
        })
    }

    const response = await getFiles()
    const files: FilesType = []

    if ('objects' in response) {
      for (const item of response.objects as Iterable<DriveFile | DriveDirectory>) {
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
    } else {
      const content = fs.readFileSync(`storage/${folderPath}`, 'utf-8')

      return ctx.inertia.render('dashboard', {
        errors: ctx.session.flashMessages.get('errors'),
        content,
        currentPath: folderPath,
      })
    }
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

  async settings(ctx: HttpContext) {
    if (!(await ctx.bouncer.allows(adminUsage))) {
      return ctx.response.redirect().toRoute('dashboard')
    }

    const folderPermissions = await FolderPermission.query().select('*')

    return ctx.inertia.render('settings', {
      errors: ctx.session.flashMessages.get('errors'),
      folderPermissions,
    })
  }
}
