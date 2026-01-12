import { n8nConfig } from '../config'

export async function n8nApiRequest(
  method: string,
  endpoint: string,
  body?: object,
  cookies?: string,
): Promise<{ data: unknown; cookies?: string }> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (cookies) {
    headers['Cookie'] = cookies
  }

  const res = await fetch(`http://localhost:${n8nConfig.port}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  const setCookie = res.headers.get('set-cookie') || undefined
  const data = await res.json().catch(() => ({}))

  return { data, cookies: setCookie }
}
