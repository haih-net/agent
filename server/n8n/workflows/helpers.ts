import * as fs from 'fs'

export function readN8nTemplate(filePath: string): string {
  const content = fs.readFileSync(filePath, 'utf-8')
  return content
    .replace(/\/\*\*[\s\S]*?\*\//g, '')
    .replace(/\/\/\s*@ts-check\s*/g, '')
    .replace(/\/\/\s*@ts-nocheck\s*/g, '')
    .replace(/^\s*\n/gm, '')
    .trim()
}

export const SESSION_ID_EXPRESSION =
  "={{ $('Prepare Context').first().json.sessionId }}"

export const SESSION_ID_SCHEMA = {
  id: 'sessionId',
  displayName: 'sessionId',
  required: true,
  defaultMatch: false,
  display: true,
  canBeUsedToMatch: true,
  type: 'string',
} as const

export const USER_EXPRESSION = '={{ $json.user }}'

export const USER_SCHEMA = {
  id: 'user',
  displayName: 'user',
  required: false,
  defaultMatch: false,
  display: true,
  canBeUsedToMatch: true,
  type: 'object',
} as const

export const REQUEST_SCHEMA = {
  id: 'chatInput',
  displayName: 'message',
  required: true,
  defaultMatch: false,
  display: true,
  canBeUsedToMatch: true,
  type: 'string',
} as const

export interface CreateAgentToolConfig {
  name: string
  toolName: string
  description: string
  workflowName: string
  nodeId: string
  position: [number, number]
  includeUser?: boolean
}

interface SchemaItem {
  id: string
  displayName: string
  required: boolean
  defaultMatch: boolean
  display: boolean
  canBeUsedToMatch: boolean
  type: 'string' | 'number' | 'boolean' | 'object'
}

export function createAgentTool(config: CreateAgentToolConfig) {
  const {
    name,
    toolName,
    description,
    workflowName,
    nodeId,
    position,
    includeUser = true,
  } = config

  const value: Record<string, string> = {
    chatInput: `={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('message', \`Message to ${toolName}\`, 'string') }}`,
    sessionId: SESSION_ID_EXPRESSION,
  }

  const schema: SchemaItem[] = [REQUEST_SCHEMA, SESSION_ID_SCHEMA]

  if (includeUser) {
    value.user = USER_EXPRESSION
    schema.push(USER_SCHEMA)
  }

  return {
    parameters: {
      name,
      description,
      workflowId: {
        __rl: true,
        mode: 'list',
        value: workflowName,
      },
      workflowInputs: {
        mappingMode: 'defineBelow',
        value,
        matchingColumns: [],
        schema,
        attemptToConvertTypes: false,
        convertFieldsToString: false,
      },
    },
    id: nodeId,
    name: toolName,
    type: '@n8n/n8n-nodes-langchain.toolWorkflow',
    typeVersion: 2.2,
    position,
  }
}
