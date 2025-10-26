import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import hash from '@adonisjs/core/services/hash'
import { updateProfileValidator } from '#validators/profile/update_profile_validator'
import { changePasswordValidator } from '#validators/profile/change_password_validator'
import type { IApiResponse, IUser, IUpdateProfile, IChangePassword } from '@pro-league/shared'
import { SuccessMessageKeys, ErrorMessageKeys } from '@pro-league/shared'

export default class ProfileController {
  /**
   * Get current user's profile
   * GET /api/profile
   */
  async show({ auth, response }: HttpContext): Promise<IApiResponse<IUser>> {
    const user: User = auth.user!

    return response.ok({
      success: true,
      message: {
        key: SuccessMessageKeys.PROFILE_RETRIEVED,
        params: {},
      },
      data: user.serialize() as IUser,
    })
  }

  /**
   * Update user profile (name)
   * PUT /api/profile
   */
  async update({ auth, request, response }: HttpContext): Promise<IApiResponse<IUser>> {
    const user: User = auth.user!
    const payload = await request.validateUsing(updateProfileValidator)

    // Update user
    if (payload.fullName !== undefined) {
      user.fullName = payload.fullName || null
    }

    await user.save()

    return response.ok({
      success: true,
      message: {
        key: SuccessMessageKeys.PROFILE_UPDATED,
        params: {},
      },
      data: user.serialize() as IUser,
    })
  }

  /**
   * Change user password
   * PUT /api/profile/password
   */
  async changePassword({ auth, request, response }: HttpContext): Promise<IApiResponse<null>> {
    const user: User = auth.user!
    const payload = await request.validateUsing(changePasswordValidator)

    // Verify current password
    const isValidPassword = await hash.verify(user.password, payload.currentPassword)

    if (!isValidPassword) {
      return response.badRequest({
        success: false,
        message: {
          key: ErrorMessageKeys.INVALID_CURRENT_PASSWORD,
          params: {},
        },
      })
    }

    // Update password
    user.password = payload.newPassword
    await user.save()

    return response.ok({
      success: true,
      message: {
        key: SuccessMessageKeys.PASSWORD_CHANGED,
        params: {},
      },
      data: null,
    })
  }
}
