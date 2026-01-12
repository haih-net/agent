import 'dotenv/config'
import express from 'express'
import { createProxyMiddleware } from 'http-proxy-middleware'
import './prisma'
import { setupGraphqlServer } from './graphqlServer'
import { initN8n, stopN8n } from './n8n'
import { runBootstrap } from './n8n/bootstrap'

const withN8N = process.env.N8N_ENABLED === 'true'

const cwd = process.cwd()
const port = (process.env.PORT && parseInt(process.env.PORT, 10)) || 3000
const dev = process.env.NODE_ENV !== 'production'
const apiOnly = process.env.API_ONLY === 'true'

let stopGraphql: (() => Promise<void>) | null = null
let stopping = false

function setupShutdown() {
  const shutdown = async (signal: string) => {
    if (stopping) {
      return
    }
    stopping = true
    // eslint-disable-next-line no-console
    console.log(`\n[server] Received ${signal}, shutting down...`)

    await stopN8n()

    if (stopGraphql) {
      await stopGraphql()
    }

    process.exit(0)
  }

  process.on('SIGINT', () => shutdown('SIGINT'))
  process.on('SIGTERM', () => shutdown('SIGTERM'))
}

async function startServer() {
  setupShutdown()

  if (withN8N) {
    // Start n8n as child process (waits for API to be ready)
    await initN8n()

    // Run bootstrap (create owner, import credentials if needed)
    await runBootstrap()
  }

  // Start GraphQL server with WebSocket support
  const { port: graphqlPort, stop } = await setupGraphqlServer()
  stopGraphql = stop

  // If API_ONLY mode, we're done
  if (apiOnly) {
    return
  }

  // Otherwise, start full server with Next.js
  const next = (await import('next')).default
  const app = next({ dev })
  const handle = app.getRequestHandler()

  await app.prepare()

  const server = express()

  // Static files from shared (uploads, not tracked)
  server.use('/shared', express.static(cwd + '/shared'))

  // Proxy /api to GraphQL server (HTTP + WebSocket)
  server.use(
    '/api',
    createProxyMiddleware({
      target: `http://localhost:${graphqlPort}/api`,
      changeOrigin: true,
      ws: false,
    }),
  )

  // Next.js handles everything else
  server.get('*', (req, res) => {
    return handle(req, res)
  })

  server.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Ready on http://localhost:${port}, API at /api`)
  })
}

startServer().catch((err) => {
  console.error('Failed to start server:', err)
  process.exit(1)
})
