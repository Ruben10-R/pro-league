import vine from '@vinejs/vine'

/**
 * Validator for user registration
 */
export const registerValidator = vine.compile(
  vine.object({
    fullName: vine.string().trim().minLength(2).maxLength(255).optional(),
    email: vine.string().trim().email().normalizeEmail().maxLength(254),
    password: vine.string().minLength(8).maxLength(255),
  })
)
