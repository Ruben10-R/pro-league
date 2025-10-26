import User from '#models/user'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    // Create test users for testing purposes
    await User.updateOrCreateMany('email', [
      {
        email: 'test@example.com',
        password: 'password123',
        fullName: 'Test User',
      },
      {
        email: 'admin@example.com',
        password: 'admin123',
        fullName: 'Admin User',
      },
    ])
  }
}
