import type { HttpContext } from '@adonisjs/core/http'
import Tournament from '#models/tournament'

export default class TournamentsController {
  /**
   * Get all tournaments
   */
  async index({ request, response }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 10)
    const status = request.input('status')

    const query = Tournament.query().preload('creator')

    if (status) {
      query.where('status', status)
    }

    const tournaments = await query.paginate(page, limit)

    return response.ok(tournaments)
  }

  /**
   * Get a single tournament
   */
  async show({ params, response }: HttpContext) {
    const tournament = await Tournament.query()
      .where('id', params.id)
      .preload('creator')
      .preload('participants', (query) => {
        query.preload('user').preload('team')
      })
      .preload('matches')
      .firstOrFail()

    return response.ok(tournament)
  }

  /**
   * Create a new tournament
   */
  async store({ request, response, auth }: HttpContext) {
    const user = auth.getUserOrFail()

    const data = request.only([
      'name',
      'description',
      'gameType',
      'format',
      'maxParticipants',
      'isTeamBased',
      'teamSize',
      'rules',
      'prizes',
      'registrationStart',
      'registrationEnd',
      'startDate',
      'endDate',
    ])

    const tournament = await Tournament.create({
      ...data,
      createdBy: user.id,
      status: 'draft',
    })

    await tournament.load('creator')

    return response.created(tournament)
  }

  /**
   * Update a tournament
   */
  async update({ params, request, response, auth }: HttpContext) {
    const user = auth.getUserOrFail()
    const tournament = await Tournament.findOrFail(params.id)

    // Check if user is the creator
    if (tournament.createdBy !== user.id) {
      return response.forbidden({ message: 'You are not authorized to update this tournament' })
    }

    const data = request.only([
      'name',
      'description',
      'gameType',
      'format',
      'status',
      'maxParticipants',
      'isTeamBased',
      'teamSize',
      'rules',
      'prizes',
      'registrationStart',
      'registrationEnd',
      'startDate',
      'endDate',
    ])

    tournament.merge(data)
    await tournament.save()

    await tournament.load('creator')

    return response.ok(tournament)
  }

  /**
   * Delete a tournament
   */
  async destroy({ params, response, auth }: HttpContext) {
    const user = auth.getUserOrFail()
    const tournament = await Tournament.findOrFail(params.id)

    // Check if user is the creator
    if (tournament.createdBy !== user.id) {
      return response.forbidden({ message: 'You are not authorized to delete this tournament' })
    }

    await tournament.delete()

    return response.noContent()
  }
}

