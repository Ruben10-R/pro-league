import type { HttpContext } from '@adonisjs/core/http'
import TournamentParticipant from '#models/tournament_participant'
import Tournament from '#models/tournament'
import { DateTime } from 'luxon'

export default class ParticipantsController {
  /**
   * Get all participants for a tournament
   */
  async index({ params, response }: HttpContext) {
    const participants = await TournamentParticipant.query()
      .where('tournamentId', params.tournamentId)
      .preload('user')
      .preload('team', (query) => {
        query.preload('members')
      })

    return response.ok(participants)
  }

  /**
   * Register for a tournament
   */
  async store({ params, request, response, auth }: HttpContext) {
    const user = auth.getUserOrFail()
    const tournament = await Tournament.findOrFail(params.tournamentId)

    // Check if registration is open
    if (tournament.status !== 'registration_open') {
      return response.badRequest({ message: 'Registration is not open for this tournament' })
    }

    // Check if max participants reached
    if (tournament.maxParticipants) {
      const currentCount = await TournamentParticipant.query()
        .where('tournamentId', tournament.id)
        .count('* as total')

      if (currentCount[0].$extras.total >= tournament.maxParticipants) {
        return response.badRequest({ message: 'Tournament is full' })
      }
    }

    const { teamId } = request.only(['teamId'])

    // Check if already registered
    const existing = await TournamentParticipant.query()
      .where('tournamentId', tournament.id)
      .where((query) => {
        if (teamId) {
          query.where('teamId', teamId)
        } else {
          query.where('userId', user.id)
        }
      })
      .first()

    if (existing) {
      return response.badRequest({ message: 'Already registered for this tournament' })
    }

    // Validate team-based vs individual
    if (tournament.isTeamBased && !teamId) {
      return response.badRequest({ message: 'This tournament requires team registration' })
    }
    if (!tournament.isTeamBased && teamId) {
      return response.badRequest({ message: 'This tournament is for individual players only' })
    }

    const participant = await TournamentParticipant.create({
      tournamentId: tournament.id,
      userId: tournament.isTeamBased ? null : user.id,
      teamId: tournament.isTeamBased ? teamId : null,
      registeredAt: DateTime.now(),
      status: 'registered',
    })

    await participant.load('user')
    await participant.load('team')

    return response.created(participant)
  }

  /**
   * Update participant status
   */
  async update({ params, request, response, auth }: HttpContext) {
    const user = auth.getUserOrFail()
    const participant = await TournamentParticipant.findOrFail(params.id)

    await participant.load('tournament')

    // Only tournament creator can update participant status
    if (participant.tournament.createdBy !== user.id) {
      return response.forbidden({ message: 'Only the tournament creator can update participants' })
    }

    const data = request.only(['status', 'seed'])

    participant.merge(data)
    await participant.save()

    await participant.load('user')
    await participant.load('team')

    return response.ok(participant)
  }

  /**
   * Withdraw from tournament
   */
  async destroy({ params, response, auth }: HttpContext) {
    const user = auth.getUserOrFail()
    const participant = await TournamentParticipant.findOrFail(params.id)

    // Check if user owns this participant entry
    if (participant.userId !== user.id) {
      await participant.load('team')
      if (!participant.team || participant.team.captainId !== user.id) {
        return response.forbidden({ message: 'You are not authorized to withdraw this participant' })
      }
    }

    participant.status = 'withdrew'
    await participant.save()

    return response.ok(participant)
  }
}

