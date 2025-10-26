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
import { middleware } from '#start/kernel'

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

// Auth routes
const AuthController = () => import('#controllers/auth_controller')
const ProfileController = () => import('#controllers/profile_controller')

router
  .group(() => {
    // Public routes
    router.post('/register', [AuthController, 'register'])
    router.post('/login', [AuthController, 'login'])

    // Protected routes
    router
      .group(() => {
        router.post('/logout', [AuthController, 'logout'])
        router.get('/me', [AuthController, 'me'])
      })
      .use(middleware.auth())
  })
  .prefix('/api/auth')

// Profile routes (protected)
router
  .group(() => {
    router.get('/', [ProfileController, 'show'])
    router.put('/', [ProfileController, 'update'])
    router.put('/password', [ProfileController, 'changePassword'])
  })
  .prefix('/api/profile')
  .use(middleware.auth())
