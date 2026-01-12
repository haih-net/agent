import { execSync } from 'child_process'
import { beforeAll } from 'vitest'

beforeAll(async () => {
  // eslint-disable-next-line no-console
  console.log('🔄 Resetting test database...')

  try {
    // Reset and push schema to test database
    execSync('npx prisma db push --force-reset --accept-data-loss', {
      stdio: 'inherit',
      env: {
        ...process.env,
        DATABASE_URL: process.env.DATABASE_URL,
      },
    })

    // eslint-disable-next-line no-console
    console.log('✅ Test database ready')
  } catch (error) {
    console.error('❌ Failed to setup test database:', error)
    throw error
  }
})
