import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import fs from 'node:fs/promises'
import path from 'node:path'

export default class FileMaxMiddleware {
  private maxSize: number = 20000
  private async getFolderSize(folderPath: string): Promise<number> {
    let totalSize = 0
    const files = await fs.readdir(folderPath)

    for (const file of files) {
      const filePath = path.join(folderPath, file)
      const stats = await fs.stat(filePath)
      if (stats.isFile()) {
        totalSize += stats.size
      } else if (stats.isDirectory()) {
        totalSize += await this.getFolderSize(filePath)
      }
    }
    return totalSize
  }

  async handle(ctx: HttpContext, next: NextFn) {
    const mainFolderPath = 'storage'
    const byteSize = new Blob([ctx.request.body().content]).size

    const size = await this.getFolderSize(mainFolderPath)
    if (size + byteSize > this.maxSize) {
      ctx.session.flash({
        errors: 'File size limit exceeded, the file system reboot every days at 1:00 AM',
      })
      return ctx.response.redirect().back()
    }
    const output = await next()
    return output
  }
}
