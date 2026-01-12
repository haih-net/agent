import { http, HttpResponse } from 'msw'
import { setupWorker } from 'msw/browser'

const globalApiHandler = http.all('/api/*', () => {
  return HttpResponse.text('Not found', {
    status: 404,
  })
})

export const worker = setupWorker(globalApiHandler)

let initialized = false
let initializing = false

export const isMswInitialized = () => initialized

export const isMswInitializing = () => initializing

export const initializeMsw = async () => {
  if (initialized) {
    return worker
  }

  if (initializing) {
    return worker
  }

  initializing = true

  try {
    await worker.start({
      onUnhandledRequest: 'bypass',
    })

    initialized = true
    initializing = false

    // eslint-disable-next-line no-console
    console.log('MSW worker started successfully')
  } catch (error) {
    console.error('Failed to start MSW worker:', error)
    initializing = false
  }

  return worker
}
