import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'roles'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('role', 80).notNullable().unique()
      table.integer('level').defaultTo(0)
    })

    this.defer(async (db) => {
      await db.table(this.tableName).insert([
        { role: 'admin', level: 1 },
        { role: 'user', level: 0 },
      ])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
