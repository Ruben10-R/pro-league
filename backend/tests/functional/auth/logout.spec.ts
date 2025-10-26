import { test } from '@japa/runner'
import { SuccessMessageKeys, ErrorMessageKeys } from '@pro-league/shared'
import testUtils from '@adonisjs/core/services/test_utils'

test.group('Auth - Logout', (group) => {
  group.each.setup(async () => {
    await testUtils.db().truncate()
  })

  test('should logout authenticated user', async ({ client }) => {
    // Register and get token
    const registerResponse = await client.post('/api/auth/register').json({
      email: 'logoutuser@example.com',
      password: 'password123',
    })

    const token = registerResponse.body().data.token.token

    // Logout
    const response = await client.post('/api/auth/logout').bearerToken(token)

    response.assertStatus(200)
    response.assertBodyContains({
      success: true,
      message: {
        key: SuccessMessageKeys.AUTH_LOGOUT_SUCCESS,
      },
    })
  })

  test('should reject logout without token', async ({ client }) => {
    const response = await client.post('/api/auth/logout')

    response.assertStatus(401)
  })

  test('should reject logout with invalid token', async ({ client }) => {
    const response = await client.post('/api/auth/logout').bearerToken('invalid-token')

    response.assertStatus(401)
  })

  test('should invalidate token after logout', async ({ client }) => {
    // Register and get token
    const registerResponse = await client.post('/api/auth/register').json({
      email: 'invalidatetoken@example.com',
      password: 'password123',
    })

    const token = registerResponse.body().data.token.token

    // Logout
    await client.post('/api/auth/logout').bearerToken(token)

    // Try to access protected route with same token
    const meResponse = await client.get('/api/auth/me').bearerToken(token)

    meResponse.assertStatus(401)
  })
})
