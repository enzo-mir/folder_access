import { HttpContext } from '@adonisjs/core/http'
import { addFileSchema, editFileSchema, searchFileSchema } from '../validator/file.schema.js'
import drive from '@adonisjs/drive/services/main'
import fs from 'node:fs'
import { z } from 'zod'
import transmit from '@adonisjs/transmit/services/main'
import path from 'node:path'

export default class FilesController {
  private async getSamePath(folderPath: string, direName?: string, fileName?: string) {
    const disk = drive.use()

    let exists: boolean = false
    if (fileName) {
      exists = await disk.exists(`${folderPath}/${fileName || direName}`)
      return exists
    } else if (direName) {
      exists = fs.existsSync(`storage/${folderPath}/${direName}`)
      return exists
    }
  }

  private async listFoldersRecursively({
    dirPath,
    pathName,
    folders = [],
  }: {
    dirPath: string
    pathName: string
    folders?: { name: string; path: string }[]
  }): Promise<{ name: string; path: string }[]> {
    const disk = drive.use()

    const entries = await disk.listAll(`/${dirPath}`)

    for (const entry of entries.objects) {
      if (entry.isDirectory) {
        const fullPath = path.join(dirPath, entry.name)
        const normalizedPath = fullPath.replaceAll(/\\/g, '/')

        const entryNameLower = normalizedPath.toLowerCase()
        const pathNameLower = pathName.toLowerCase()

        console.log(pathNameLower)

        if (entryNameLower.includes(pathNameLower)) {
          folders.push({
            name: entry.name,
            path: normalizedPath,
          })
        }

        this.listFoldersRecursively({
          dirPath: fullPath,
          pathName,
          folders,
        })
      }
    }

    transmit.broadcast('folders', {
      folders,
    })

    return folders
  }

  async create(ctx: HttpContext) {
    const folderPath = ctx.params.folder ? decodeURIComponent(ctx.params.folder) : ''
    const disk = drive.use()

    try {
      const { fileName, direName } = await addFileSchema.parseAsync(ctx.request.all())

      const isSamePath = await this.getSamePath(folderPath, direName, fileName)

      if (isSamePath) {
        ctx.session.flash({ errors: `${fileName ? 'File' : 'Folder'} already exists` })
        return ctx.response.redirect().back()
      } else {
        if (fileName) {
          await disk.put(`${folderPath}/${fileName}`, '')
        } else if (direName) {
          await fs.promises.mkdir(`storage/${folderPath}/${direName}`, { recursive: true })
        }
        return ctx.response.redirect().back()
      }
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

  async findFolder(ctx: HttpContext) {
    try {
      const { path: folderPath } = await searchFileSchema.parseAsync(ctx.request.all())

      await this.listFoldersRecursively({
        dirPath: '',
        pathName: folderPath,
      })

      return ctx.response.redirect().back()
    } catch (error) {
      if (error instanceof z.ZodError) {
        ctx.session.flash({ errors: error.issues[0].message })
      } else {
        ctx.session.flash({ errors: 'No folder' })
      }
      return ctx.response.redirect().back()
    }
  }
}
