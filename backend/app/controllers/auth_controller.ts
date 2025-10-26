import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { registerValidator } from '#validators/auth/register_validator'
import { loginValidator } from '#validators/auth/login_validator'
import { ErrorMessageKeys, SuccessMessageKeys } from '@pro-league/shared'

export default class AuthController {
  /**
   * Register a new user
   * POST /api/auth/register
   */
  async register({ request, response }: HttpContext) {
    try {
      // Validate request data
      const data = await request.validateUsing(registerValidator)

      // Check if email already exists
      const existingUser = await User.findBy('email', data.email)
      if (existingUser) {
        return response.conflict({
          success: false,
          message: {
            key: ErrorMessageKeys.AUTH_EMAIL_TAKEN,
            params: { email: data.email },
          },
        })
      }

      // Create user
      const user = await User.create(data)

      // Generate access token
      const token = await User.accessTokens.create(user)

      return response.created({
        success: true,
        message: {
          key: SuccessMessageKeys.AUTH_REGISTER_SUCCESS,
          params: {},
        },
        data: {
          user: {
            id: user.id,
            fullName: user.fullName,
            email: user.email,
            createdAt: user.createdAt.toISO(),
            updatedAt: user.updatedAt?.toISO() || null,
          },
          token: {
            type: 'bearer' as const,
            token: token.value!.release(),
          },
        },
      })
    } catch (error) {
      return response.badRequest({
        success: false,
        message: {
          key: ErrorMessageKeys.AUTH_REGISTRATION_FAILED,
          params: {},
        },
      })
    }
  }

  /**
   * Login a user
   * POST /api/auth/login
   */
  async login({ request, response }: HttpContext) {
    try {
      // Validate request data
      const { email, password } = await request.validateUsing(loginValidator)

      // Verify credentials
      const user = await User.verifyCredentials(email, password)

      // Generate access token
      const token = await User.accessTokens.create(user)

      return response.ok({
        success: true,
        message: {
          key: SuccessMessageKeys.AUTH_LOGIN_SUCCESS,
          params: { name: user.fullName || user.email },
        },
        data: {
          user: {
            id: user.id,
            fullName: user.fullName,
            email: user.email,
            createdAt: user.createdAt.toISO(),
            updatedAt: user.updatedAt?.toISO() || null,
          },
          token: {
            type: 'bearer' as const,
            token: token.value!.release(),
          },
        },
      })
    } catch (error) {
      return response.unauthorized({
        success: false,
        message: {
          key: ErrorMessageKeys.AUTH_INVALID_CREDENTIALS,
          params: {},
        },
      })
    }
  }

  /**
   * Logout current user
   * POST /api/auth/logout
   */
  async logout({ auth, response }: HttpContext) {
    try {
      const user = auth.getUserOrFail()
      const token = auth.user?.currentAccessToken

      if (token) {
        await User.accessTokens.delete(user, token.identifier)
      }

      return response.ok({
        success: true,
        message: {
          key: SuccessMessageKeys.AUTH_LOGOUT_SUCCESS,
          params: {},
        },
        data: null,
      })
    } catch (error) {
      return response.badRequest({
        success: false,
        message: {
          key: ErrorMessageKeys.AUTH_LOGOUT_FAILED,
          params: {},
        },
      })
    }
  }

  /**
   * Get current authenticated user
   * GET /api/auth/me
   */
  async me({ auth, response }: HttpContext) {
    try {
      const user = auth.getUserOrFail()

      return response.ok({
        success: true,
        data: {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          createdAt: user.createdAt.toISO(),
          updatedAt: user.updatedAt?.toISO() || null,
        },
      })
    } catch (error) {
      return response.unauthorized({
        success: false,
        message: {
          key: ErrorMessageKeys.AUTH_UNAUTHORIZED,
          params: {},
        },
      })
    }
  }
}
