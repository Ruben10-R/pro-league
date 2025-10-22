/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import AutoSwagger from 'adonis-autoswagger'
import swagger from '#config/swagger'

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

// returns swagger in YAML
router.get('/swagger', async () => {
  return AutoSwagger.default.docs(router.toJSON(), swagger)
})

// Renders Swagger-UI and passes YAML-output of /swagger
router.get('/docs', async () => {
  return AutoSwagger.default.ui('/swagger', swagger)
})

// health check
router.get('/health', async ({ response }) => {
  return response.ok({ status: 'healthy', timestamp: new Date().toISOString() })
})

// API routes
router
  .group(() => {
    // Tournament routes
    router
      .group(() => {
        router.get('/', '#controllers/tournaments_controller.index')
        router.get('/:id', '#controllers/tournaments_controller.show')
        router.post('/', '#controllers/tournaments_controller.store').use('auth')
        router.put('/:id', '#controllers/tournaments_controller.update').use('auth')
        router.delete('/:id', '#controllers/tournaments_controller.destroy').use('auth')
      })
      .prefix('/tournaments')

    // Team routes
    router
      .group(() => {
        router.get('/', '#controllers/teams_controller.index')
        router.get('/:id', '#controllers/teams_controller.show')
        router.post('/', '#controllers/teams_controller.store').use('auth')
        router.put('/:id', '#controllers/teams_controller.update').use('auth')
        router.delete('/:id', '#controllers/teams_controller.destroy').use('auth')
        router.post('/:id/members', '#controllers/teams_controller.addMember').use('auth')
        router.delete('/:id/members/:userId', '#controllers/teams_controller.removeMember').use('auth')
      })
      .prefix('/teams')

    // Match routes
    router
      .group(() => {
        router.get('/', '#controllers/matches_controller.index')
        router.get('/:id', '#controllers/matches_controller.show')
        router.post('/', '#controllers/matches_controller.store').use('auth')
        router.put('/:id', '#controllers/matches_controller.update').use('auth')
        router.delete('/:id', '#controllers/matches_controller.destroy').use('auth')
      })
      .prefix('/matches')

    // Tournament participant routes
    router
      .group(() => {
        router.get('/tournaments/:tournamentId/participants', '#controllers/participants_controller.index')
        router.post('/tournaments/:tournamentId/participants', '#controllers/participants_controller.store').use('auth')
        router.put('/participants/:id', '#controllers/participants_controller.update').use('auth')
        router.delete('/participants/:id', '#controllers/participants_controller.destroy').use('auth')
      })
  })
  .prefix('/api')

