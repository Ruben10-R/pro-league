import { test } from '@japa/runner'

test.group('Auth - Me', (group) => {
  group.each.setup(async ({ context }) => {
    await context.db.truncate()
  })

  test('should get current user data', async ({ client, assert }) => {
    // Register a user
    const registerResponse = await client.post('/api/auth/register').json({
      fullName: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    })

    const token = registerResponse.body().data.token.token

    // Get current user
    const response = await client.get('/api/auth/me').bearerToken(token)

    response.assertStatus(200)
    response.assertBodyContains({ success: true })

    assert.properties(response.body().data, ['id', 'email', 'fullName', 'createdAt'])
    assert.equal(response.body().data.email, 'test@example.com')
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
    // Register and get token
    const registerResponse = await client.post('/api/auth/register').json({
      email: 'test@example.com',
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
