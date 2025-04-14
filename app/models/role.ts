import User from './user.js'
import FolderPermission from './folder_permission.js'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'

export default class Role extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare role: string

  @column()
  declare level: number

  @hasMany(() => User)
  declare users: HasMany<typeof User>

  @hasMany(() => FolderPermission, {
    foreignKey: 'permission', // matches the permission column in folder_permissions
    localKey: 'role', // matches the role column in roles table
  })
  declare folderPermissions: HasMany<typeof FolderPermission>
}
