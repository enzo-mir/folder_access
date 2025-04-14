import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'folder_permissions'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('path', 254).notNullable()
      table
        .string('permission')
        .notNullable()
        .references('roles.role')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })

    this.schema.alterTable(this.tableName, (table) => {
      table.unique(['path', 'permission'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
