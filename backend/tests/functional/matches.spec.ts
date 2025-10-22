import { test } from '@japa/runner'
import User from '#models/user'
import Tournament from '#models/tournament'
import TournamentParticipant from '#models/tournament_participant'
import Match from '#models/match'
import testUtils from '@adonisjs/core/services/test_utils'
import { DateTime } from 'luxon'

test.group('Matches', (group) => {
  let user: User
  let authToken: string
  let tournament: Tournament
  let participant1: TournamentParticipant
  let participant2: TournamentParticipant

  group.each.setup(async () => {
    await testUtils.db().truncate()
  })

  group.setup(async () => {
    user = await User.create({
      fullName: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    })

    const token = await User.accessTokens.create(user)
    authToken = token.value!.release()

    tournament = await Tournament.create({
      name: 'Test Tournament',
      gameType: 'FIFA',
      format: 'single_elimination',
      status: 'in_progress',
      isTeamBased: false,
      createdBy: user.id,
    })

    const player1 = await User.create({
      fullName: 'Player 1',
      email: 'player1@example.com',
      password: 'password123',
    })

    const player2 = await User.create({
      fullName: 'Player 2',
      email: 'player2@example.com',
      password: 'password123',
    })

    participant1 = await TournamentParticipant.create({
      tournamentId: tournament.id,
      userId: player1.id,
      registeredAt: DateTime.now(),
      status: 'confirmed',
      seed: 1,
    })

    participant2 = await TournamentParticipant.create({
      tournamentId: tournament.id,
      userId: player2.id,
      registeredAt: DateTime.now(),
      status: 'confirmed',
      seed: 2,
    })
  })

  test('GET /api/matches returns paginated list of matches', async ({ client }) => {
    await Match.createMany([
      {
        tournamentId: tournament.id,
        round: 1,
        participant1Id: participant1.id,
        participant2Id: participant2.id,
        status: 'scheduled',
      },
      {
        tournamentId: tournament.id,
        round: 2,
        participant1Id: participant1.id,
        participant2Id: participant2.id,
        status: 'scheduled',
      },
    ])

    const response = await client.get('/api/matches')

    response.assertStatus(200)
    response.assertBodyContains({
      meta: {
        total: 2,
      },
    })
  })

  test('GET /api/matches?tournamentId=X filters by tournament', async ({ client }) => {
    const otherTournament = await Tournament.create({
      name: 'Other Tournament',
      gameType: 'Chess',
      format: 'round_robin',
      status: 'in_progress',
      isTeamBased: false,
      createdBy: user.id,
    })

    await Match.create({
      tournamentId: tournament.id,
      round: 1,
      participant1Id: participant1.id,
      participant2Id: participant2.id,
      status: 'scheduled',
    })

    await Match.create({
      tournamentId: otherTournament.id,
      round: 1,
      status: 'scheduled',
    })

    const response = await client.get(`/api/matches?tournamentId=${tournament.id}`)

    response.assertStatus(200)
    response.assertBodyContains({
      meta: {
        total: 1,
      },
    })
  })

  test('GET /api/matches/:id returns match details', async ({ client }) => {
    const match = await Match.create({
      tournamentId: tournament.id,
      round: 1,
      bracketPosition: 'semifinal-1',
      participant1Id: participant1.id,
      participant2Id: participant2.id,
      status: 'scheduled',
      scheduledAt: DateTime.now().plus({ days: 1 }),
    })

    const response = await client.get(`/api/matches/${match.id}`)

    response.assertStatus(200)
    response.assertBodyContains({
      id: match.id,
      tournamentId: tournament.id,
      round: 1,
      bracketPosition: 'semifinal-1',
    })
  })

  test('POST /api/matches creates a new match when user is tournament creator', async ({
    client,
    assert,
  }) => {
    const response = await client
      .post('/api/matches')
      .bearerToken(authToken)
      .json({
        tournamentId: tournament.id,
        round: 1,
        bracketPosition: 'final',
        participant1Id: participant1.id,
        participant2Id: participant2.id,
        scheduledAt: DateTime.now().plus({ days: 7 }).toISO(),
        location: 'Arena 1',
      })

    response.assertStatus(201)
    response.assertBodyContains({
      tournamentId: tournament.id,
      round: 1,
      bracketPosition: 'final',
      status: 'scheduled',
    })

    const match = await Match.findBy('bracket_position', 'final')
    assert.isNotNull(match)
  })

  test('POST /api/matches returns 403 when user is not tournament creator', async ({
    client,
  }) => {
    const otherUser = await User.create({
      fullName: 'Other User',
      email: 'other@example.com',
      password: 'password123',
    })

    const otherToken = await User.accessTokens.create(otherUser)
    const otherAuthToken = otherToken.value!.release()

    const response = await client
      .post('/api/matches')
      .bearerToken(otherAuthToken)
      .json({
        tournamentId: tournament.id,
        round: 1,
        participant1Id: participant1.id,
        participant2Id: participant2.id,
      })

    response.assertStatus(403)
  })

  test('PUT /api/matches/:id updates match score and winner', async ({ client }) => {
    const match = await Match.create({
      tournamentId: tournament.id,
      round: 1,
      participant1Id: participant1.id,
      participant2Id: participant2.id,
      status: 'in_progress',
    })

    const response = await client
      .put(`/api/matches/${match.id}`)
      .bearerToken(authToken)
      .json({
        participant1Score: 3,
        participant2Score: 1,
        winnerId: participant1.id,
        status: 'completed',
        completedAt: DateTime.now().toISO(),
      })

    response.assertStatus(200)
    response.assertBodyContains({
      participant1Score: 3,
      participant2Score: 1,
      winnerId: participant1.id,
      status: 'completed',
    })
  })

  test('PUT /api/matches/:id returns 403 when user is not tournament creator', async ({
    client,
  }) => {
    const otherUser = await User.create({
      fullName: 'Other User',
      email: 'other@example.com',
      password: 'password123',
    })

    const otherToken = await User.accessTokens.create(otherUser)
    const otherAuthToken = otherToken.value!.release()

    const match = await Match.create({
      tournamentId: tournament.id,
      round: 1,
      participant1Id: participant1.id,
      participant2Id: participant2.id,
      status: 'scheduled',
    })

    const response = await client
      .put(`/api/matches/${match.id}`)
      .bearerToken(otherAuthToken)
      .json({
        participant1Score: 3,
        participant2Score: 1,
      })

    response.assertStatus(403)
  })

  test('DELETE /api/matches/:id deletes match when user is tournament creator', async ({
    client,
    assert,
  }) => {
    const match = await Match.create({
      tournamentId: tournament.id,
      round: 1,
      participant1Id: participant1.id,
      participant2Id: participant2.id,
      status: 'scheduled',
    })

    const response = await client.delete(`/api/matches/${match.id}`).bearerToken(authToken)

    response.assertStatus(204)

    const deletedMatch = await Match.find(match.id)
    assert.isNull(deletedMatch)
  })
})

