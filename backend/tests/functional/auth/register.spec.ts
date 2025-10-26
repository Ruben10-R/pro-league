import { test } from '@japa/runner'
import { ErrorMessageKeys, SuccessMessageKeys } from '@pro-league/shared'
import testUtils from '@adonisjs/core/services/test_utils'

test.group('Auth - Register', (group) => {
  // Reset database before each test
  group.each.setup(async () => {
    await testUtils.db().truncate()
  })

  // Tag tests for filtering
  group.tap((test) => test.tags(['@auth', '@register']))

  test('should register a new user with valid data', async ({ client, assert }) => {
    const uniqueEmail = `john-${Date.now()}@example.com`
    const response = await client.post('/api/auth/register').json({
      fullName: 'John Doe',
      email: uniqueEmail,
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
    assert.equal(response.body().data.user.email, uniqueEmail)
    assert.equal(response.body().data.user.fullName, 'John Doe')
    assert.properties(response.body().data.token, ['type', 'token'])
    assert.equal(response.body().data.token.type, 'bearer')
  })

  test('should register a user without fullName', async ({ client, assert }) => {
    const uniqueEmail = `janewithoutname-${Date.now()}@example.com`
    const response = await client.post('/api/auth/register').json({
      email: uniqueEmail,
      password: 'password123',
    })

    response.assertStatus(201)
    assert.equal(response.body().data.user.fullName, null)
  })

  test('should reject registration with duplicate email', async ({ client }) => {
    const uniqueEmail = `duplicate-${Date.now()}@example.com`
    // First registration
    await client.post('/api/auth/register').json({
      email: uniqueEmail,
      password: 'password123',
    })

    // Second registration with same email
    const response = await client.post('/api/auth/register').json({
      email: uniqueEmail,
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

    response.assertStatus(422)
  })

  test('should reject registration with short password', async ({ client }) => {
    const uniqueEmail = `shortpass-${Date.now()}@example.com`
    const response = await client.post('/api/auth/register').json({
      email: uniqueEmail,
      password: 'short',
    })

    response.assertStatus(422)
  })

  test('should reject registration with missing email', async ({ client }) => {
    const response = await client.post('/api/auth/register').json({
      password: 'password123',
    })

    response.assertStatus(422)
  })

  test('should reject registration with missing password', async ({ client }) => {
    const uniqueEmail = `nopassword-${Date.now()}@example.com`
    const response = await client.post('/api/auth/register').json({
      email: uniqueEmail,
    })

    response.assertStatus(422)
  })

  test('should normalize email to lowercase', async ({ client, assert }) => {
    const uniqueEmail = `UPPERCASE-${Date.now()}@EXAMPLE.COM`
    const response = await client.post('/api/auth/register').json({
      email: uniqueEmail,
      password: 'password123',
    })

    response.assertStatus(201)
    assert.equal(response.body().data.user.email, uniqueEmail.toLowerCase())
  })

  test('should hash password before storing', async ({ client, assert }) => {
    const password = 'password123'
    const uniqueEmail = `hashedpass-${Date.now()}@example.com`
    const response = await client.post('/api/auth/register').json({
      email: uniqueEmail,
      password,
    })

    response.assertStatus(201)

    // Password should not be in response
    assert.notExists(response.body().data.user.password)
  })
})
