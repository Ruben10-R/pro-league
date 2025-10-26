import vine from '@vinejs/vine'

/**
 * Validator for updating user profile
 */
export const updateProfileValidator = vine.compile(
  vine.object({
    fullName: vine.string().trim().minLength(2).maxLength(255).optional(),
  })
)
