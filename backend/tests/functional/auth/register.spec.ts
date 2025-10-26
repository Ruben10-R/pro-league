import { test } from '@japa/runner'
import { ErrorMessageKeys, SuccessMessageKeys } from '@pro-league/shared'
import testUtils from '@adonisjs/core/services/test_utils'

test.group('Auth - Register', (group) => {
  // Clean up database after each test
  group.each.setup(async () => {
    await testUtils.db().truncate()
  })

  test('should register a new user with valid data', async ({ client, assert }) => {
    const response = await client.post('/api/auth/register').json({
      fullName: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
    })

    response.assertStatus(201)
    response.assertBodyContains({
      success: true,
      message: {
        key: SuccessMessageKeys.AUTH_REGISTER_SUCCESS,
      },
    })

    assert.properties(response.body().data, ['user', 'token'])
    assert.properties(response.body().data.user, ['id', 'email', 'fullName', 'createdAt'])
    assert.equal(response.body().data.user.email, 'john@example.com')
    assert.equal(response.body().data.user.fullName, 'John Doe')
    assert.properties(response.body().data.token, ['type', 'token'])
    assert.equal(response.body().data.token.type, 'bearer')
  })

  test('should register a user without fullName', async ({ client, assert }) => {
    const response = await client.post('/api/auth/register').json({
      email: 'janewithoutname@example.com',
      password: 'password123',
    })

    response.assertStatus(201)
    assert.equal(response.body().data.user.fullName, null)
  })

  test('should reject registration with duplicate email', async ({ client }) => {
    // First registration
    await client.post('/api/auth/register').json({
      email: 'duplicate@example.com',
      password: 'password123',
    })

    // Second registration with same email
    const response = await client.post('/api/auth/register').json({
      email: 'duplicate@example.com',
      password: 'password456',
    })

    response.assertStatus(409)
    response.assertBodyContains({
      success: false,
      message: {
        key: ErrorMessageKeys.AUTH_EMAIL_TAKEN,
      },
    })
  })

  test('should reject registration with invalid email', async ({ client }) => {
    const response = await client.post('/api/auth/register').json({
      email: 'not-an-email',
      password: 'password123',
    })

    response.assertStatus(400)
  })

  test('should reject registration with short password', async ({ client }) => {
    const response = await client.post('/api/auth/register').json({
      email: 'shortpass@example.com',
      password: 'short',
    })

    response.assertStatus(400)
  })

  test('should reject registration with missing email', async ({ client }) => {
    const response = await client.post('/api/auth/register').json({
      password: 'password123',
    })

    response.assertStatus(400)
  })

  test('should reject registration with missing password', async ({ client }) => {
    const response = await client.post('/api/auth/register').json({
      email: 'nopassword@example.com',
    })

    response.assertStatus(400)
  })

  test('should normalize email to lowercase', async ({ client, assert }) => {
    const response = await client.post('/api/auth/register').json({
      email: 'UPPERCASE@EXAMPLE.COM',
      password: 'password123',
    })

    response.assertStatus(201)
    assert.equal(response.body().data.user.email, 'uppercase@example.com')
  })

  test('should hash password before storing', async ({ client, assert }) => {
    const password = 'password123'
    const response = await client.post('/api/auth/register').json({
      email: 'hashedpass@example.com',
      password,
    })

    response.assertStatus(201)

    // Password should not be in response
    assert.notExists(response.body().data.user.password)
  })
})
