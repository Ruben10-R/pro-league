import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'tournament_participants'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.integer('tournament_id').unsigned().notNullable().references('id').inTable('tournaments').onDelete('CASCADE')
      table.integer('user_id').unsigned().nullable().references('id').inTable('users').onDelete('CASCADE')
      table.integer('team_id').unsigned().nullable().references('id').inTable('teams').onDelete('CASCADE')
      table.integer('seed').nullable()
      table.enum('status', ['registered', 'confirmed', 'checked_in', 'disqualified', 'withdrew']).notNullable().defaultTo('registered')
      table.dateTime('registered_at').notNullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

