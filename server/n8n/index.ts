/* eslint-disable no-console */
import { spawn, ChildProcess } from 'child_process'
import path from 'path'
import { n8nConfig } from './config'

const PROJECT_DIR = process.cwd()

let n8nProcess: ChildProcess | null = null

export async function initN8n(): Promise<void> {
  const n8nBin = path.resolve(PROJECT_DIR, 'node_modules/.bin/n8n')
  console.log(`[n8n] Starting on port ${n8nConfig.port}...`)

  return new Promise<void>((resolve, reject) => {
    let resolved = false

    n8nProcess = spawn(n8nBin, ['start'], {
      stdio: ['ignore', 'pipe', 'pipe'],
      cwd: PROJECT_DIR,
      env: {
        ...process.env,
        N8N_USER_FOLDER: n8nConfig.n8nUserFolder,
        N8N_PORT: String(n8nConfig.port),
        N8N_CUSTOM_EXTENSIONS: path.resolve(
          PROJECT_DIR,
          'server/n8n/custom-nodes',
        ),
      },
      detached: true,
    })

    n8nProcess.stdout?.on('data', (data) => {
      const str = data.toString()
      process.stdout.write(`[n8n] ${str}`)

      if (!resolved && str.includes('Editor is now accessible')) {
        resolved = true
        console.log(`[n8n] Ready at http://localhost:${n8nConfig.port}`)
        resolve()
      }
    })

    n8nProcess.stderr?.on('data', (data) => {
      process.stderr.write(`[n8n] ${data}`)
    })

    n8nProcess.on('error', (err) => {
      console.error('[n8n] Failed to start:', err)
      if (!resolved) {
        reject(err)
      }
    })

    n8nProcess.on('exit', (code) => {
      console.log(`[n8n] Exited with code ${code}`)
      n8nProcess = null
      if (!resolved) {
        reject(new Error(`[n8n] Process exited with code ${code} before ready`))
      }
    })

    setTimeout(() => {
      if (!resolved) {
        reject(new Error('[n8n] Timeout waiting for n8n to be ready (120s)'))
      }
    }, 120000)
  })
}

export async function stopN8n(): Promise<void> {
  if (!n8nProcess || !n8nProcess.pid) {
    return
  }

  const pid = n8nProcess.pid
  console.log(`[n8n] Killing process tree (pid: ${pid})...`)

  try {
    process.kill(-pid, 'SIGTERM')
  } catch {
    // fallback
  }

  try {
    n8nProcess.kill('SIGTERM')
  } catch {
    // ignore
  }

  await new Promise<void>((resolve) => {
    const timeout = setTimeout(() => {
      try {
        process.kill(-pid, 'SIGKILL')
      } catch {
        // ignore
      }
      resolve()
    }, 3000)

    if (n8nProcess) {
      n8nProcess.once('exit', () => {
        clearTimeout(timeout)
        resolve()
      })
    } else {
      clearTimeout(timeout)
      resolve()
    }
  })

  n8nProcess = null
}

export function isN8nRunning(): boolean {
  return n8nProcess !== null
}
