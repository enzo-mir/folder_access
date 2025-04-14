import { HttpContext } from '@adonisjs/core/http'
import { addFileSchema, editFileSchema } from '../validator/file.schema.js'
import drive from '@adonisjs/drive/services/main'
import fs from 'node:fs'
import { z } from 'zod'

export default class FilesController {
  private async getSamePath(folderPath: string, direName?: string, fileName?: string) {
    const disk = drive.use()

    let exists: boolean = false

    if (fileName) {
      exists = await disk.exists(`${folderPath}/${fileName || direName}`)
    } else if (direName) {
      exists = fs.existsSync(`storage/${folderPath}/${direName}`)
    }

    return exists
  }

  async create(ctx: HttpContext) {
    const folderPath = ctx.params.folder ? decodeURIComponent(ctx.params.folder) : ''
    const disk = drive.use()

    try {
      const { fileName, direName } = await addFileSchema.parseAsync(ctx.request.all())

      if (await this.getSamePath(folderPath, fileName, direName)) {
        ctx.session.flash({ errors: `${fileName ? 'File' : 'Folder'} already exists` })
        return ctx.response.redirect().back()
      }
      if (fileName) {
        await disk.put(`${folderPath}/${fileName}`, '')
      } else if (direName) {
        await fs.promises.mkdir(`storage/${folderPath}/${direName}`, { recursive: true })
      }
      return ctx.response.redirect().back()
    } catch (error) {
      if (error instanceof z.ZodError) {
        ctx.session.flash({ errors: error.issues[0].message })
      } else {
        ctx.session.flash({ errors: 'An unknown error occurred' })
      }
      return ctx.response.redirect().back()
    }
  }

  async update(ctx: HttpContext) {
    const folderPath = ctx.params.folder ? decodeURIComponent(ctx.params.folder) : null

    try {
      if (!folderPath) throw new Error('Folder path is required')

      const { content } = await editFileSchema.parseAsync(ctx.request.all())
      const filePath = `storage/${folderPath}`

      fs.writeFileSync(filePath, content, { encoding: 'utf-8' })

      return ctx.response.redirect().back()
    } catch (error) {
      if (error instanceof z.ZodError) {
        ctx.session.flash({ errors: error.issues[0].message })
      } else {
        ctx.session.flash({ errors: 'An unknown error occurred' })
      }
      return ctx.response.redirect().back()
    }
  }
}
