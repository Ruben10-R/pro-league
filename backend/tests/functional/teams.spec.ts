import { test } from '@japa/runner'
import User from '#models/user'
import Team from '#models/team'
import testUtils from '@adonisjs/core/services/test_utils'
import { DateTime } from 'luxon'

test.group('Teams', (group) => {
  let user: User
  let authToken: string

  group.each.setup(async () => {
    await testUtils.db().truncate()

    user = await User.create({
      fullName: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    })

    const token = await User.accessTokens.create(user)
    authToken = token.value!.release()
  })

  test('GET /api/teams returns paginated list of teams', async ({ client }) => {
    const captain = await User.create({
      fullName: 'Captain',
      email: 'captain@example.com',
      password: 'password123',
    })

    await Team.createMany([
      {
        name: 'Team Alpha',
        description: 'First team',
        captainId: captain.id,
      },
      {
        name: 'Team Beta',
        description: 'Second team',
        captainId: captain.id,
      },
    ])

    const response = await client.get('/api/teams')

    response.assertStatus(200)
    response.assertBodyContains({
      meta: {
        total: 2,
        perPage: 10,
        currentPage: 1,
      },
    })
  })

  test('GET /api/teams/:id returns team with members', async ({ client }) => {
    const team = await Team.create({
      name: 'Test Team',
      description: 'Test description',
      captainId: user.id,
    })

    await team.related('members').attach({
      [user.id]: {
        role: 'captain',
        joined_at: DateTime.now().toFormat('yyyy-MM-dd HH:mm:ss'),
        created_at: DateTime.now().toFormat('yyyy-MM-dd HH:mm:ss'),
        updated_at: DateTime.now().toFormat('yyyy-MM-dd HH:mm:ss'),
      },
    })

    const response = await client.get(`/api/teams/${team.id}`)

    response.assertStatus(200)
    response.assertBodyContains({
      id: team.id,
      name: 'Test Team',
      description: 'Test description',
      captainId: user.id,
    })
  })

  test('POST /api/teams creates a new team with authenticated user as captain', async ({
    client,
    assert,
  }) => {
    const response = await client
      .post('/api/teams')
      .bearerToken(authToken)
      .json({
        name: 'New Team',
        description: 'A great team',
        logoUrl: 'https://example.com/logo.png',
      })

    response.assertStatus(201)
    response.assertBodyContains({
      name: 'New Team',
      description: 'A great team',
      captainId: user.id,
    })

    const team = await Team.findBy('name', 'New Team')
    assert.isNotNull(team)
    assert.equal(team!.captainId, user.id)
  })

  test('POST /api/teams requires authentication', async ({ client }) => {
    const response = await client.post('/api/teams').json({
      name: 'New Team',
    })

    response.assertStatus(401)
  })

  test('PUT /api/teams/:id updates team when user is captain', async ({ client }) => {
    const team = await Team.create({
      name: 'Original Team',
      captainId: user.id,
    })

    const response = await client
      .put(`/api/teams/${team.id}`)
      .bearerToken(authToken)
      .json({
        name: 'Updated Team',
        description: 'New description',
      })

    response.assertStatus(200)
    response.assertBodyContains({
      name: 'Updated Team',
      description: 'New description',
    })
  })

  test('PUT /api/teams/:id returns 403 when user is not captain', async ({ client }) => {
    const otherUser = await User.create({
      fullName: 'Other User',
      email: 'other@example.com',
      password: 'password123',
    })

    const team = await Team.create({
      name: 'Test Team',
      captainId: otherUser.id,
    })

    const response = await client
      .put(`/api/teams/${team.id}`)
      .bearerToken(authToken)
      .json({
        name: 'Updated Team',
      })

    response.assertStatus(403)
  })

  test('DELETE /api/teams/:id deletes team when user is captain', async ({ client, assert }) => {
    const team = await Team.create({
      name: 'To Delete',
      captainId: user.id,
    })

    const response = await client.delete(`/api/teams/${team.id}`).bearerToken(authToken)

    response.assertStatus(204)

    const deletedTeam = await Team.find(team.id)
    assert.isNull(deletedTeam)
  })

  test('POST /api/teams/:id/members adds member to team when user is captain', async ({
    client,
  }) => {
    const team = await Team.create({
      name: 'Test Team',
      captainId: user.id,
    })

    const newMember = await User.create({
      fullName: 'New Member',
      email: 'member@example.com',
      password: 'password123',
    })

    const response = await client
      .post(`/api/teams/${team.id}/members`)
      .bearerToken(authToken)
      .json({
        userId: newMember.id,
        role: 'member',
      })

    response.assertStatus(200)
  })

  test('POST /api/teams/:id/members returns 403 when user is not captain', async ({ client }) => {
    const otherUser = await User.create({
      fullName: 'Other User',
      email: 'other@example.com',
      password: 'password123',
    })

    const team = await Team.create({
      name: 'Test Team',
      captainId: otherUser.id,
    })

    const newMember = await User.create({
      fullName: 'New Member',
      email: 'member@example.com',
      password: 'password123',
    })

    const response = await client
      .post(`/api/teams/${team.id}/members`)
      .bearerToken(authToken)
      .json({
        userId: newMember.id,
        role: 'member',
      })

    response.assertStatus(403)
  })

  test('DELETE /api/teams/:id/members/:userId removes member from team', async ({
    client,
    assert,
  }) => {
    const team = await Team.create({
      name: 'Test Team',
      captainId: user.id,
    })

    const member = await User.create({
      fullName: 'Member',
      email: 'member@example.com',
      password: 'password123',
    })

    await team.related('members').attach({
      [member.id]: {
        role: 'member',
        joined_at: DateTime.now().toFormat('yyyy-MM-dd HH:mm:ss'),
        created_at: DateTime.now().toFormat('yyyy-MM-dd HH:mm:ss'),
        updated_at: DateTime.now().toFormat('yyyy-MM-dd HH:mm:ss'),
      },
    })

    const response = await client
      .delete(`/api/teams/${team.id}/members/${member.id}`)
      .bearerToken(authToken)

    response.assertStatus(200)
  })
})

