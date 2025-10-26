import { assert } from '@japa/assert'
import { apiClient } from '@japa/api-client'
import app from '@adonisjs/core/services/app'
import type { Config } from '@japa/runner/types'
import { pluginAdonisJS } from '@japa/plugin-adonisjs'
import testUtils from '@adonisjs/core/services/test_utils'
import db from '@adonisjs/lucid/services/db'

/**
 * This file is imported by the "bin/test.ts" entrypoint file
 */

/**
 * Configure Japa plugins in the plugins array.
 * Learn more - https://japa.dev/docs/runner-config#plugins-optional
 */
export const plugins: Config['plugins'] = [assert(), apiClient(), pluginAdonisJS(app)]

/**
 * Configure lifecycle function to run before and after all the
 * tests.
 *
 * The setup functions are executed before all the tests
 * The teardown functions are executed after all the tests
 */
export const runnerHooks: Required<Pick<Config, 'setup' | 'teardown'>> = {
  setup: [
    // Set up fresh test database before all tests
    async () => {
      console.log('🔄 Setting up test database...')

      // Ensure we're in test environment
      if (app.nodeEnvironment !== 'test') {
        throw new Error('Tests must run in test environment')
      }

      // Run migrations to create schema (idempotent)
      await testUtils.db().migrate()

      console.log('✅ Test database ready')
    },
  ],
  teardown: [
    // Clean up after all tests complete
    async () => {
      console.log('🧹 Cleaning up test database...')

      // Close all database connections
      await db.manager.closeAll()

      console.log('✅ Test database cleaned')
    },
  ],
}

/**
 * Configure suites by tapping into the test suite instance.
 * Learn more - https://japa.dev/docs/test-suites#lifecycle-hooks
 */
export const configureSuite: Config['configureSuite'] = (suite) => {
  if (['browser', 'functional', 'e2e', 'unit'].includes(suite.name)) {
    return suite
      .setup(() => testUtils.httpServer().start())
      .setup(() => testUtils.db().truncate()) // Clean database before each suite
  }
}

export const reporters: Config['reporters'] = {
  activated: ['spec'],
}
