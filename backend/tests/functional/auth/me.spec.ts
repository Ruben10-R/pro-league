import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'

test.group('Auth - Me', (group) => {
  group.each.setup(async () => {
    await testUtils.db().truncate()
  })

  // Tag tests for filtering
  group.tap((test) => test.tags(['@auth', '@me']))

  test('should get current user data', async ({ client, assert }) => {
    // Register to get user and token
    const registerResponse = await client.post('/api/auth/register').json({
      fullName: 'Test User',
      email: 'meuser@example.com',
      password: 'password123',
    })

    const token = registerResponse.body().data.token.token

    // Get current user
    const response = await client.get('/api/auth/me').bearerToken(token)

    response.assertStatus(200)
    response.assertBodyContains({ success: true })

    assert.properties(response.body().data, ['id', 'email', 'fullName', 'createdAt'])
    assert.equal(response.body().data.email, 'meuser@example.com')
    assert.equal(response.body().data.fullName, 'Test User')
    assert.notExists(response.body().data.password)
  })

  test('should reject request without token', async ({ client }) => {
    const response = await client.get('/api/auth/me')

    response.assertStatus(401)
  })

  test('should reject request with invalid token', async ({ client }) => {
    const response = await client.get('/api/auth/me').bearerToken('invalid-token')

    response.assertStatus(401)
  })

  test('should reject request with expired/revoked token', async ({ client }) => {
    // Register to get user and token
    const registerResponse = await client.post('/api/auth/register').json({
      email: 'revokedtoken@example.com',
      password: 'password123',
    })

    const token = registerResponse.body().data.token.token

    // Logout (revoke token)
    await client.post('/api/auth/logout').bearerToken(token)

    // Try to access with revoked token
    const response = await client.get('/api/auth/me').bearerToken(token)

    response.assertStatus(401)
  })
})
