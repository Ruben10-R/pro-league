import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'tournaments'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.string('name').notNullable()
      table.text('description').nullable()
      table.string('game_type').notNullable() // e.g., "FIFA", "League of Legends", "Chess"
      table.enum('format', ['single_elimination', 'double_elimination', 'round_robin', 'swiss', 'group_stage']).notNullable()
      table.enum('status', ['draft', 'registration_open', 'registration_closed', 'in_progress', 'completed', 'cancelled']).notNullable().defaultTo('draft')
      table.integer('max_participants').nullable()
      table.boolean('is_team_based').notNullable().defaultTo(false)
      table.integer('team_size').nullable() // For team-based tournaments
      table.text('rules').nullable()
      table.text('prizes').nullable()
      table.dateTime('registration_start').nullable()
      table.dateTime('registration_end').nullable()
      table.dateTime('start_date').nullable()
      table.dateTime('end_date').nullable()
      table.integer('created_by').unsigned().references('id').inTable('users').onDelete('CASCADE')

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

