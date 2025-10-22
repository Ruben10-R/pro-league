import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Tournament from './tournament.js'
import TournamentParticipant from './tournament_participant.js'

export default class Match extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare tournamentId: number

  @column()
  declare round: number

  @column()
  declare bracketPosition: string | null

  @column({ columnName: 'participant_1_id' })
  declare participant1Id: number | null

  @column({ columnName: 'participant_2_id' })
  declare participant2Id: number | null

  @column({ columnName: 'winner_id' })
  declare winnerId: number | null

  @column({ columnName: 'participant_1_score' })
  declare participant1Score: number | null

  @column({ columnName: 'participant_2_score' })
  declare participant2Score: number | null

  @column()
  declare status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'disputed'

  @column.dateTime()
  declare scheduledAt: DateTime | null

  @column.dateTime()
  declare startedAt: DateTime | null

  @column.dateTime()
  declare completedAt: DateTime | null

  @column()
  declare location: string | null

  @column()
  declare notes: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Tournament)
  declare tournament: BelongsTo<typeof Tournament>

  @belongsTo(() => TournamentParticipant, {
    foreignKey: 'participant1Id',
  })
  declare participant1: BelongsTo<typeof TournamentParticipant>

  @belongsTo(() => TournamentParticipant, {
    foreignKey: 'participant2Id',
  })
  declare participant2: BelongsTo<typeof TournamentParticipant>

  @belongsTo(() => TournamentParticipant, {
    foreignKey: 'winnerId',
  })
  declare winner: BelongsTo<typeof TournamentParticipant>
}

