import { test } from '@japa/runner'
import { ErrorMessageKeys, SuccessMessageKeys } from '@pro-league/shared'
import testUtils from '@adonisjs/core/services/test_utils'

test.group('Auth - Login', (group) => {
  // Clean up database before each test
  group.each.setup(async () => {
    await testUtils.db().truncate()
  })

  test('should login with valid credentials', async ({ client, assert }) => {
    // First, register a user
    await client.post('/api/auth/register').json({
      fullName: 'Jane Doe',
      email: 'jane@example.com',
      password: 'password123',
    })

    // Then login
    const response = await client.post('/api/auth/login').json({
      email: 'jane@example.com',
      password: 'password123',
    })

    response.assertStatus(200)
    response.assertBodyContains({
      success: true,
      message: {
        key: SuccessMessageKeys.AUTH_LOGIN_SUCCESS,
      },
    })

    assert.properties(response.body().data, ['user', 'token'])
    assert.properties(response.body().data.user, ['id', 'email', 'fullName'])
    assert.equal(response.body().data.user.email, 'jane@example.com')
    assert.properties(response.body().data.token, ['type', 'token'])
    assert.equal(response.body().data.token.type, 'bearer')
  })

  test('should reject login with invalid email', async ({ client }) => {
    const response = await client.post('/api/auth/login').json({
      email: 'nonexistent@example.com',
      password: 'password123',
    })

    response.assertStatus(401)
    response.assertBodyContains({
      success: false,
      message: {
        key: ErrorMessageKeys.AUTH_INVALID_CREDENTIALS,
      },
    })
  })

  test('should reject login with invalid password', async ({ client }) => {
    // Register a user
    await client.post('/api/auth/register').json({
      email: 'test@example.com',
      password: 'password123',
    })

    // Try to login with wrong password
    const response = await client.post('/api/auth/login').json({
      email: 'test@example.com',
      password: 'wrongpassword',
    })

    response.assertStatus(401)
    response.assertBodyContains({
      success: false,
      message: {
        key: ErrorMessageKeys.AUTH_INVALID_CREDENTIALS,
      },
    })
  })

  test('should reject login with missing email', async ({ client }) => {
    const response = await client.post('/api/auth/login').json({
      password: 'password123',
    })

    response.assertStatus(400)
  })

  test('should reject login with missing password', async ({ client }) => {
    const response = await client.post('/api/auth/login').json({
      email: 'test@example.com',
    })

    response.assertStatus(400)
  })

  test('should handle email case insensitively', async ({ client, assert }) => {
    // Register with lowercase
    await client.post('/api/auth/register').json({
      email: 'test@example.com',
      password: 'password123',
    })

    // Login with uppercase
    const response = await client.post('/api/auth/login').json({
      email: 'TEST@EXAMPLE.COM',
      password: 'password123',
    })

    response.assertStatus(200)
    assert.equal(response.body().data.user.email, 'test@example.com')
  })

  test('should generate different tokens for multiple logins', async ({ client, assert }) => {
    // Register a user
    await client.post('/api/auth/register').json({
      email: 'test@example.com',
      password: 'password123',
    })

    // First login
    const response1 = await client.post('/api/auth/login').json({
      email: 'test@example.com',
      password: 'password123',
    })

    // Second login
    const response2 = await client.post('/api/auth/login').json({
      email: 'test@example.com',
      password: 'password123',
    })

    assert.notEqual(response1.body().data.token.token, response2.body().data.token.token)
  })
})
