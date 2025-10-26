import type { HttpContext } from '@adonisjs/core/http'
import Match from '#models/match'
import Tournament from '#models/tournament'

export default class MatchesController {
  /**
   * Get all matches for a tournament
   */
  async index({ params, request, response }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 50)
    const tournamentId = params.tournamentId || request.input('tournamentId')

    const query = Match.query()
      .preload('participant1', (p) => {
        p.preload('user').preload('team')
      })
      .preload('participant2', (p) => {
        p.preload('user').preload('team')
      })
      .preload('winner', (p) => {
        p.preload('user').preload('team')
      })

    if (tournamentId) {
      query.where('tournamentId', tournamentId)
    }

    const matches = await query.orderBy('round', 'asc').paginate(page, limit)

    return response.ok(matches)
  }

  /**
   * Get a single match
   */
  async show({ params, response }: HttpContext) {
    const match = await Match.query()
      .where('id', params.id)
      .preload('tournament')
      .preload('participant1', (p) => {
        p.preload('user').preload('team')
      })
      .preload('participant2', (p) => {
        p.preload('user').preload('team')
      })
      .preload('winner', (p) => {
        p.preload('user').preload('team')
      })
      .firstOrFail()

    return response.ok(match)
  }

  /**
   * Create a new match
   */
  async store({ request, response, auth }: HttpContext) {
    const user = auth.getUserOrFail()

    const data = request.only([
      'tournamentId',
      'round',
      'bracketPosition',
      'participant1Id',
      'participant2Id',
      'scheduledAt',
      'location',
      'notes',
    ])

    // Verify user is the tournament creator
    const tournament = await Tournament.findOrFail(data.tournamentId)
    if (tournament.createdBy !== user.id) {
      return response.forbidden({ message: 'Only the tournament creator can create matches' })
    }

    const match = await Match.create(data)

    if (match.participant1Id) {
      await match.load('participant1', (query) => {
        query.preload('user').preload('team')
      })
    }
    if (match.participant2Id) {
      await match.load('participant2', (query) => {
        query.preload('user').preload('team')
      })
    }

    return response.created(match)
  }

  /**
   * Update a match (score, status, etc.)
   */
  async update({ params, request, response, auth }: HttpContext) {
    const user = auth.getUserOrFail()
    const match = await Match.findOrFail(params.id)

    // Verify user is the tournament creator
    await match.load('tournament')
    if (match.tournament.createdBy !== user.id) {
      return response.forbidden({ message: 'Only the tournament creator can update matches' })
    }

    const data = request.only([
      'participant1Score',
      'participant2Score',
      'winnerId',
      'status',
      'scheduledAt',
      'startedAt',
      'completedAt',
      'location',
      'notes',
    ])

    match.merge(data)
    await match.save()

    if (match.participant1Id) {
      await match.load('participant1', (query) => {
        query.preload('user').preload('team')
      })
    }
    if (match.participant2Id) {
      await match.load('participant2', (query) => {
        query.preload('user').preload('team')
      })
    }
    if (match.winnerId) {
      await match.load('winner', (query) => {
        query.preload('user').preload('team')
      })
    }

    return response.ok(match)
  }

  /**
   * Delete a match
   */
  async destroy({ params, response, auth }: HttpContext) {
    const user = auth.getUserOrFail()
    const match = await Match.findOrFail(params.id)

    // Verify user is the tournament creator
    await match.load('tournament')
    if (match.tournament.createdBy !== user.id) {
      return response.forbidden({ message: 'Only the tournament creator can delete matches' })
    }

    await match.delete()

    return response.noContent()
  }
}

