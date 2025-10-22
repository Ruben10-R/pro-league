import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'matches'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.integer('tournament_id').unsigned().references('id').inTable('tournaments').onDelete('CASCADE')
      table.integer('round').notNullable() // Round number in the tournament
      table.string('bracket_position').nullable() // e.g., "semifinal-1", "final"
      table.integer('participant_1_id').unsigned().nullable().references('id').inTable('tournament_participants').onDelete('SET NULL')
      table.integer('participant_2_id').unsigned().nullable().references('id').inTable('tournament_participants').onDelete('SET NULL')
      table.integer('winner_id').unsigned().nullable().references('id').inTable('tournament_participants').onDelete('SET NULL')
      table.integer('participant_1_score').nullable()
      table.integer('participant_2_score').nullable()
      table.enum('status', ['scheduled', 'in_progress', 'completed', 'cancelled', 'disputed']).notNullable().defaultTo('scheduled')
      table.dateTime('scheduled_at').nullable()
      table.dateTime('started_at').nullable()
      table.dateTime('completed_at').nullable()
      table.string('location').nullable()
      table.text('notes').nullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

