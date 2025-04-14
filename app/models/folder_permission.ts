import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import Role from './role.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class FolderPermission extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare path: string

  @column()
  declare permission: string

  @belongsTo(() => Role, {
    foreignKey: 'permission',
    localKey: 'role',
  })
  declare role: BelongsTo<typeof Role>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
