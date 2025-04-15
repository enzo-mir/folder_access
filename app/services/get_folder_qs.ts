import { Disk, DriveDirectory, DriveFile } from '@adonisjs/drive'
import { FilesType } from '../types/files.type.js'
import { HttpContext } from '@adonisjs/core/http'
import { getAccessFolders } from '#abilities/fetch_folders'

export const getFiles = async (ctx: HttpContext, folderPath: string, disk: Disk) => {
  if (folderPath === '') {
    const files = await disk.listAll()
    return getFilesList(ctx, folderPath, files)
  }

  return disk
    .exists(folderPath)
    .then(async () => {
      const files = await disk.listAll(folderPath)
      return getFilesList(ctx, folderPath, files)
    })
    .catch(() => {
      return getFilesList(ctx, folderPath, {})
    })
}

async function getFilesList(ctx: HttpContext, folderPath: string, allFiles: Object) {
  const files: FilesType = []

  if ('objects' in allFiles) {
    for (const item of allFiles.objects as Iterable<DriveFile | DriveDirectory>) {
      const fullPath = folderPath !== '' ? `${folderPath}/${item.name}` : item.name

      const access = await ctx.bouncer.allows(getAccessFolders, fullPath)

      if (!access) continue

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

    return files
  } else {
    return undefined
  }
}
