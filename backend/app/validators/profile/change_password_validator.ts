import vine from '@vinejs/vine'

/**
 * Validator for changing password
 */
export const changePasswordValidator = vine.compile(
  vine.object({
    currentPassword: vine.string().trim().minLength(1),
    newPassword: vine.string().trim().minLength(8),
  })
)
