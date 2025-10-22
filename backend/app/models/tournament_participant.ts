import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Tournament from './tournament.js'
import User from './user.js'
import Team from './team.js'
import Match from './match.js'

export default class TournamentParticipant extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare tournamentId: number

  @column()
  declare userId: number | null

  @column()
  declare teamId: number | null

  @column()
  declare seed: number | null

  @column()
  declare status: 'registered' | 'confirmed' | 'checked_in' | 'disqualified' | 'withdrew'

  @column.dateTime()
  declare registeredAt: DateTime

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Tournament)
  declare tournament: BelongsTo<typeof Tournament>

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @belongsTo(() => Team)
  declare team: BelongsTo<typeof Team>

  @hasMany(() => Match, {
    foreignKey: 'participant1Id',
  })
  declare matchesAsParticipant1: HasMany<typeof Match>

  @hasMany(() => Match, {
    foreignKey: 'participant2Id',
  })
  declare matchesAsParticipant2: HasMany<typeof Match>

  @hasMany(() => Match, {
    foreignKey: 'winnerId',
  })
  declare wonMatches: HasMany<typeof Match>
}

