import { defineConfig } from 'vitest/config'
import { loadEnv } from 'vite'
import path from 'path'

export default defineConfig(() => {
  // Load .env.test
  const env = loadEnv('test', process.cwd(), '')

  return {
    resolve: {
      alias: {
        src: path.resolve(__dirname, './src'),
        server: path.resolve(__dirname, './server'),
      },
    },
    test: {
      env: {
        ...env,
        GRAPHQL_WS_PORT: env.GRAPHQL_WS_PORT || '4040',
        DATABASE_URL:
          env.DATABASE_URL ||
          'postgresql://postgres:your_supabase_password@localhost:5432/site-boilerplate--tests',
      },
      globals: true,
      environment: 'node',
      include: ['server/**/*.test.ts'],
      setupFiles: ['server/tests/api/setup/globalSetup.ts'],
      testTimeout: 30000,
      hookTimeout: 30000,
      // Run tests sequentially to avoid DB conflicts
      sequence: {
        concurrent: false,
      },
      fileParallelism: false,
    },
  }
})
