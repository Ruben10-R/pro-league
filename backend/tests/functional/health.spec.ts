import { test } from '@japa/runner'

test.group('Health', () => {
  test('GET /health returns 200 with healthy status', async ({ client }) => {
    const response = await client.get('/health')

    response.assertStatus(200)
    response.assertBodyContains({
      status: 'healthy',
    })
  })
})
