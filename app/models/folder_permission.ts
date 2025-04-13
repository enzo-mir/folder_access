import { DateTime } from 'luxon'
import { BaseModel, column, hasOne } from '@adonisjs/lucid/orm'
import Role from './role.js'
import type { HasOne } from '@adonisjs/lucid/types/relations'

export default class FolderPermission extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare path: string

  @hasOne(() => Role, {
    foreignKey: 'role',
  })
  declare permission: HasOne<typeof Role>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
