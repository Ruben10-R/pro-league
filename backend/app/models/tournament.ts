import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import User from './user.js'
import TournamentParticipant from './tournament_participant.js'
import Match from './match.js'

export default class Tournament extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare description: string | null

  @column()
  declare gameType: string

  @column()
  declare format: 'single_elimination' | 'double_elimination' | 'round_robin' | 'swiss' | 'group_stage'

  @column()
  declare status: 'draft' | 'registration_open' | 'registration_closed' | 'in_progress' | 'completed' | 'cancelled'

  @column()
  declare maxParticipants: number | null

  @column()
  declare isTeamBased: boolean

  @column()
  declare teamSize: number | null

  @column()
  declare rules: string | null

  @column()
  declare prizes: string | null

  @column.dateTime()
  declare registrationStart: DateTime | null

  @column.dateTime()
  declare registrationEnd: DateTime | null

  @column.dateTime()
  declare startDate: DateTime | null

  @column.dateTime()
  declare endDate: DateTime | null

  @column()
  declare createdBy: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => User, {
    foreignKey: 'createdBy',
  })
  declare creator: BelongsTo<typeof User>

  @hasMany(() => TournamentParticipant)
  declare participants: HasMany<typeof TournamentParticipant>

  @hasMany(() => Match)
  declare matches: HasMany<typeof Match>
}

