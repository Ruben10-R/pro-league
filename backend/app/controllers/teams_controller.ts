import type { HttpContext } from '@adonisjs/core/http'
import Team from '#models/team'
import { DateTime } from 'luxon'

export default class TeamsController {
  /**
   * Get all teams
   */
  async index({ request, response }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 10)

    const teams = await Team.query()
      .preload('captain')
      .preload('members')
      .paginate(page, limit)

    return response.ok(teams)
  }

  /**
   * Get a single team
   */
  async show({ params, response }: HttpContext) {
    const team = await Team.query()
      .where('id', params.id)
      .preload('captain')
      .preload('members')
      .firstOrFail()

    return response.ok(team)
  }

  /**
   * Create a new team
   */
  async store({ request, response, auth }: HttpContext) {
    const user = auth.getUserOrFail()

    const data = request.only(['name', 'description', 'logoUrl'])

    const team = await Team.create({
      ...data,
      captainId: user.id,
    })

    // Add creator as captain member
    await team.related('members').attach({
      [user.id]: {
        role: 'captain',
        joined_at: DateTime.now().toSQL(),
      },
    })

    await team.load('captain')
    await team.load('members')

    return response.created(team)
  }

  /**
   * Update a team
   */
  async update({ params, request, response, auth }: HttpContext) {
    const user = auth.getUserOrFail()
    const team = await Team.findOrFail(params.id)

    // Check if user is the captain
    if (team.captainId !== user.id) {
      return response.forbidden({ message: 'You are not authorized to update this team' })
    }

    const data = request.only(['name', 'description', 'logoUrl'])

    team.merge(data)
    await team.save()

    await team.load('captain')
    await team.load('members')

    return response.ok(team)
  }

  /**
   * Delete a team
   */
  async destroy({ params, response, auth }: HttpContext) {
    const user = auth.getUserOrFail()
    const team = await Team.findOrFail(params.id)

    // Check if user is the captain
    if (team.captainId !== user.id) {
      return response.forbidden({ message: 'You are not authorized to delete this team' })
    }

    await team.delete()

    return response.noContent()
  }

  /**
   * Add a member to the team
   */
  async addMember({ params, request, response, auth }: HttpContext) {
    const user = auth.getUserOrFail()
    const team = await Team.findOrFail(params.id)

    // Check if user is the captain
    if (team.captainId !== user.id) {
      return response.forbidden({ message: 'Only the captain can add members' })
    }

    const { userId, role } = request.only(['userId', 'role'])

    await team.related('members').attach({
      [userId]: {
        role: role || 'member',
        joined_at: DateTime.now().toSQL(),
      },
    })

    await team.load('members')

    return response.ok(team)
  }

  /**
   * Remove a member from the team
   */
  async removeMember({ params, response, auth }: HttpContext) {
    const user = auth.getUserOrFail()
    const team = await Team.findOrFail(params.id)

    // Check if user is the captain
    if (team.captainId !== user.id) {
      return response.forbidden({ message: 'Only the captain can remove members' })
    }

    await team.related('members').detach([params.userId])

    await team.load('members')

    return response.ok(team)
  }
}

