// backend/config/swagger.ts
import path from 'node:path'
import url from 'node:url'
import env from '#start/env'

const basePath = path.dirname(url.fileURLToPath(import.meta.url)) + '/../'

export default {
  path: basePath,
  title: env.get('APP_NAME') || 'Chrono Tracker API',
  version: env.get('APP_VERSION') || '1.0.0',
  description: env.get('APP_DESCRIPTION') || '',
  tagIndex: 2,
  productionEnv: 'production',
  info: {
    title: env.get('APP_NAME') || 'Chrono Tracker API',
    version: env.get('APP_VERSION') || '1.0.0',
    description: env.get('APP_DESCRIPTION') || '',
  },
  snakeCase: true,

  debug: false,
  ignore: ['/swagger', '/docs'],
  preferredPutPatch: 'PUT',
  common: {
    parameters: {},
    headers: {},
  },

  // Token-based authentication (Bearer / JWT)
  securitySchemes: {
    BearerAuth: {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      description: 'Provide the JWT token as: `Bearer <token>`',
    },
  },

  authMiddlewares: ['auth', 'auth:api'],
  defaultSecurityScheme: 'BearerAuth',
  persistAuthorization: true,
  showFullPath: false,
}
