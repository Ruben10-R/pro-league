import { test } from '@japa/runner'
import User from '#models/user'
import Tournament from '#models/tournament'
import testUtils from '@adonisjs/core/services/test_utils'
import { DateTime } from 'luxon'

test.group('Tournaments', (group) => {
  let user: User
  let authToken: string

  group.each.setup(async () => {
    await testUtils.db().truncate()

    // Create a test user and get auth token
    user = await User.create({
      fullName: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    })

    const token = await User.accessTokens.create(user)
    authToken = token.value!.release()
  })

  test('GET /api/tournaments returns paginated list of tournaments', async ({ client }) => {
    // Create some tournaments
    await Tournament.createMany([
      {
        name: 'Tournament 1',
        gameType: 'FIFA',
        format: 'single_elimination',
        status: 'draft',
        isTeamBased: false,
        createdBy: user.id,
      },
      {
        name: 'Tournament 2',
        gameType: 'League of Legends',
        format: 'double_elimination',
        status: 'registration_open',
        isTeamBased: true,
        createdBy: user.id,
      },
    ])

    const response = await client.get('/api/tournaments')

    response.assertStatus(200)
    response.assertBodyContains({
      meta: {
        total: 2,
        perPage: 10,
        currentPage: 1,
      },
    })
  })

  test('GET /api/tournaments?status=draft filters by status', async ({ client }) => {
    await Tournament.createMany([
      {
        name: 'Draft Tournament',
        gameType: 'FIFA',
        format: 'single_elimination',
        status: 'draft',
        isTeamBased: false,
        createdBy: user.id,
      },
      {
        name: 'Open Tournament',
        gameType: 'Chess',
        format: 'round_robin',
        status: 'registration_open',
        isTeamBased: false,
        createdBy: user.id,
      },
    ])

    const response = await client.get('/api/tournaments?status=draft')

    response.assertStatus(200)
    response.assertBodyContains({
      meta: {
        total: 1,
      },
    })
  })

  test('GET /api/tournaments/:id returns tournament details', async ({ client }) => {
    const tournament = await Tournament.create({
      name: 'Test Tournament',
      description: 'Test description',
      gameType: 'FIFA',
      format: 'single_elimination',
      status: 'draft',
      isTeamBased: false,
      createdBy: user.id,
    })

    const response = await client.get(`/api/tournaments/${tournament.id}`)

    response.assertStatus(200)
    response.assertBodyContains({
      id: tournament.id,
      name: 'Test Tournament',
      description: 'Test description',
      gameType: 'FIFA',
    })
  })

  test('GET /api/tournaments/:id returns 404 for non-existent tournament', async ({
    client,
  }) => {
    const response = await client.get('/api/tournaments/99999')

    response.assertStatus(404)
  })

  test('POST /api/tournaments creates a new tournament when authenticated', async ({
    client,
    assert,
  }) => {
    const response = await client
      .post('/api/tournaments')
      .bearerToken(authToken)
      .json({
        name: 'New Tournament',
        description: 'A great tournament',
        gameType: 'FIFA 24',
        format: 'single_elimination',
        isTeamBased: false,
        maxParticipants: 16,
        rules: 'Standard rules apply',
        prizes: '1st: $1000',
        registrationStart: DateTime.now().toISO(),
        registrationEnd: DateTime.now().plus({ days: 7 }).toISO(),
        startDate: DateTime.now().plus({ days: 14 }).toISO(),
        endDate: DateTime.now().plus({ days: 21 }).toISO(),
      })

    response.assertStatus(201)
    response.assertBodyContains({
      name: 'New Tournament',
      gameType: 'FIFA 24',
      status: 'draft',
      createdBy: user.id,
    })

    const tournament = await Tournament.findBy('name', 'New Tournament')
    assert.isNotNull(tournament)
  })

  test('POST /api/tournaments requires authentication', async ({ client }) => {
    const response = await client.post('/api/tournaments').json({
      name: 'New Tournament',
      gameType: 'FIFA',
      format: 'single_elimination',
      isTeamBased: false,
    })

    response.assertStatus(401)
  })

  test('PUT /api/tournaments/:id updates tournament when user is creator', async ({
    client,
  }) => {
    const tournament = await Tournament.create({
      name: 'Original Name',
      gameType: 'FIFA',
      format: 'single_elimination',
      status: 'draft',
      isTeamBased: false,
      createdBy: user.id,
    })

    const response = await client
      .put(`/api/tournaments/${tournament.id}`)
      .bearerToken(authToken)
      .json({
        name: 'Updated Name',
        status: 'registration_open',
      })

    response.assertStatus(200)
    response.assertBodyContains({
      name: 'Updated Name',
      status: 'registration_open',
    })
  })

  test('PUT /api/tournaments/:id returns 403 when user is not creator', async ({ client }) => {
    const otherUser = await User.create({
      fullName: 'Other User',
      email: 'other@example.com',
      password: 'password123',
    })

    const tournament = await Tournament.create({
      name: 'Test Tournament',
      gameType: 'FIFA',
      format: 'single_elimination',
      status: 'draft',
      isTeamBased: false,
      createdBy: otherUser.id,
    })

    const response = await client
      .put(`/api/tournaments/${tournament.id}`)
      .bearerToken(authToken)
      .json({
        name: 'Updated Name',
      })

    response.assertStatus(403)
  })

  test('DELETE /api/tournaments/:id deletes tournament when user is creator', async ({
    client,
    assert,
  }) => {
    const tournament = await Tournament.create({
      name: 'To Delete',
      gameType: 'FIFA',
      format: 'single_elimination',
      status: 'draft',
      isTeamBased: false,
      createdBy: user.id,
    })

    const response = await client
      .delete(`/api/tournaments/${tournament.id}`)
      .bearerToken(authToken)

    response.assertStatus(204)

    const deletedTournament = await Tournament.find(tournament.id)
    assert.isNull(deletedTournament)
  })

  test('DELETE /api/tournaments/:id returns 403 when user is not creator', async ({
    client,
  }) => {
    const otherUser = await User.create({
      fullName: 'Other User',
      email: 'other@example.com',
      password: 'password123',
    })

    const tournament = await Tournament.create({
      name: 'Test Tournament',
      gameType: 'FIFA',
      format: 'single_elimination',
      status: 'draft',
      isTeamBased: false,
      createdBy: otherUser.id,
    })

    const response = await client
      .delete(`/api/tournaments/${tournament.id}`)
      .bearerToken(authToken)

    response.assertStatus(403)
  })
})

