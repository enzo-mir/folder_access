import FolderPermission from '#models/folder_permission'
import Role from '#models/role'
import User from '#models/user'
import { Bouncer } from '@adonisjs/bouncer'

export const getAccessFolders = Bouncer.ability(async (user: User, path: string) => {
  const userRole = user.role
  const userLevelAccess = await Role.query().select('level').where('role', userRole).first()
  const getAbsolutePath = path === '' ? '/' : path

  const permissionFolder = await FolderPermission.query()
    .select('permission')
    .where('path', getAbsolutePath)
    .first()

  if (!permissionFolder || !userLevelAccess) return true

  const permissionLevel = await Role.query()
    .select('level')
    .where('role', permissionFolder.permission)
    .firstOrFail()

  return permissionLevel.level <= userLevelAccess.level
})
