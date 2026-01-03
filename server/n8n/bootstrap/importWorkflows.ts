/* eslint-disable no-console */
import fs from 'fs'
import path from 'path'
import { n8nConfig } from '../config'

const WORKFLOWS_DIR = path.join(__dirname, '../workflows')

interface ApiResponse {
  data: unknown
  cookies?: string
}

async function apiRequest(
  method: string,
  endpoint: string,
  body?: object,
  cookies?: string,
): Promise<ApiResponse> {
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

async function loadWorkflow(entry: string): Promise<object | null> {
  const fullPath = path.join(WORKFLOWS_DIR, entry)
  const stat = fs.statSync(fullPath)

  if (stat.isFile() && entry.endsWith('.json')) {
    return JSON.parse(fs.readFileSync(fullPath, 'utf-8'))
  }

  if (stat.isDirectory()) {
    const indexTs = path.join(fullPath, 'index.ts')
    const indexJs = path.join(fullPath, 'index.js')

    if (fs.existsSync(indexTs) || fs.existsSync(indexJs)) {
      const module = await import(fullPath)
      return module.default || module
    }
  }

  return null
}

interface WorkflowData {
  id: string
  versionId: string
  name: string
  active: boolean
  nodes?: WorkflowNode[]
}

interface WorkflowNode {
  parameters?: {
    workflowId?: {
      __rl?: boolean
      mode?: string
      value?: string
    }
    [key: string]: unknown
  }
  [key: string]: unknown
}

async function resolveWorkflowDependencies(
  idMap: Record<string, string>,
  cookies: string,
): Promise<void> {
  console.log('[bootstrap] Resolving workflow dependencies...')

  for (const [name, id] of Object.entries(idMap)) {
    const { data } = await apiRequest(
      'GET',
      `/rest/workflows/${id}`,
      undefined,
      cookies,
    )
    const wf = (data as { data?: WorkflowData })?.data
    if (!wf || !wf.nodes) {
      continue
    }

    let hasChanges = false
    const resolvedNodes = wf.nodes.map((node) => {
      const workflowId = node.parameters?.workflowId
      if (
        workflowId?.__rl === true &&
        (workflowId.mode === 'list' || workflowId.mode === 'name') &&
        workflowId.value &&
        idMap[workflowId.value]
      ) {
        hasChanges = true
        return {
          ...node,
          parameters: {
            ...node.parameters,
            workflowId: {
              ...workflowId,
              mode: 'id',
              value: idMap[workflowId.value],
            },
          },
        }
      }
      return node
    })

    if (hasChanges) {
      console.log(`[bootstrap] Resolving '${name}' tool references...`)
      const resolved = { ...wf, nodes: resolvedNodes }
      const { data: patchData } = await apiRequest(
        'PATCH',
        `/rest/workflows/${id}`,
        resolved,
        cookies,
      )
      const patchResult = patchData as { data?: { id?: string }; id?: string }
      if (patchResult?.data?.id || patchResult?.id) {
        console.log(`[bootstrap] '${name}' dependencies resolved`)
      } else {
        console.log(`[bootstrap] '${name}' patch response:`, patchData)
      }
    }
  }
}

async function activateWorkflow(
  wfId: string,
  wfName: string,
  cookies: string,
): Promise<void> {
  const { data } = await apiRequest(
    'GET',
    `/rest/workflows/${wfId}`,
    undefined,
    cookies,
  )
  const wf = (data as { data?: WorkflowData })?.data
  if (!wf) {
    console.error(
      `[bootstrap] Failed to get workflow '${wfName}' for activation`,
    )
    return
  }

  const { data: activateData } = await apiRequest(
    'POST',
    `/rest/workflows/${wfId}/activate`,
    { versionId: wf.versionId, name: wf.name },
    cookies,
  )

  const activated = activateData as {
    data?: { active?: boolean }
    active?: boolean
  }
  if (activated?.data?.active || activated?.active) {
    console.log(`[bootstrap] Workflow '${wfName}' activated`)
  } else {
    console.log(
      `[bootstrap] Workflow '${wfName}' activation response:`,
      activateData,
    )
  }
}

export async function importWorkflows(cookies: string): Promise<void> {
  if (!fs.existsSync(WORKFLOWS_DIR)) {
    return
  }

  const entries = fs.readdirSync(WORKFLOWS_DIR)
  if (entries.length === 0) {
    return
  }

  console.log('[bootstrap] Importing workflows...')

  const idMap: Record<string, string> = {}
  const toActivate: { id: string; name: string }[] = []

  for (const entry of entries) {
    try {
      const workflow = await loadWorkflow(entry)
      if (!workflow) {
        continue
      }

      const wf = workflow as { name?: string; active?: boolean }
      console.log(`[bootstrap] Importing workflow: ${wf.name || entry}`)

      const { data } = await apiRequest(
        'POST',
        '/rest/workflows',
        workflow,
        cookies,
      )
      const result = data as { data?: { id?: string }; id?: string }
      const id = result?.data?.id || result?.id

      if (id) {
        const workflowName = wf.name || entry
        console.log(
          `[bootstrap] Workflow imported: ${workflowName} (id: ${id})`,
        )
        idMap[workflowName] = id
        if (wf.active) {
          toActivate.push({ id, name: workflowName })
        }
      } else {
        console.error(`[bootstrap] Failed to import workflow ${entry}:`, data)
      }
    } catch (err) {
      console.error(`[bootstrap] Failed to load workflow ${entry}:`, err)
    }
  }

  if (Object.keys(idMap).length > 0) {
    await resolveWorkflowDependencies(idMap, cookies)
  }

  if (toActivate.length > 0) {
    console.log('[bootstrap] Activating workflows...')
    for (const { id, name } of toActivate) {
      try {
        await activateWorkflow(id, name, cookies)
      } catch (err) {
        console.error(`[bootstrap] Failed to activate workflow '${name}':`, err)
      }
    }
  }
}
