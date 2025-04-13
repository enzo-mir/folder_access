import { HttpContext } from '@adonisjs/core/http'

export const getFolderQs = async (ctx: HttpContext) => {
  const folderPermissionsList = ctx.request.qs().folder
  console.log(folderPermissionsList)
}
