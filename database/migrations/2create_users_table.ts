import hash from '@adonisjs/core/services/hash'
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.string('username', 254).notNullable().unique()
      table.string('code').notNullable()
      table.string('role').notNullable()
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })

    this.schema.alterTable(this.tableName, (table) => {
      table.foreign('role').references('roles.role').onDelete('CASCADE')
    })
    this.defer(async (db) => {
      await db.table(this.tableName).insert({
        username: 'admin',
        code: await hash.make('7X1{0Pmd1EU^'),
        role: 'admin',
        created_at: new Date(),
      })
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
