import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany, manyToMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import User from './user.js'
import TournamentParticipant from './tournament_participant.js'

export default class Team extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare description: string | null

  @column()
  declare logoUrl: string | null

  @column()
  declare captainId: number | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => User, {
    foreignKey: 'captainId',
  })
  declare captain: BelongsTo<typeof User>

  @manyToMany(() => User, {
    pivotTable: 'team_members',
    pivotForeignKey: 'team_id',
    pivotRelatedForeignKey: 'user_id',
    pivotColumns: ['role', 'joined_at'],
  })
  declare members: ManyToMany<typeof User>

  @hasMany(() => TournamentParticipant)
  declare tournamentParticipants: HasMany<typeof TournamentParticipant>
}

