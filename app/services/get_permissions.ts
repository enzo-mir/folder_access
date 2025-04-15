import FolderPermission from '#models/folder_permission'

export const permissionsByRole = async () => {
  const folderPermissions = await FolderPermission.query().select('*')
  return folderPermissions.reduce<Record<string, Array<{ id: number; path: string }>>>(
    (acc, permission) => {
      const role = permission.permission

      if (!acc[role]) {
        acc[role] = []
      }

      acc[role].push({
        id: permission.id,
        path: permission.path,
      })

      return acc
    },
    {}
  )
}
