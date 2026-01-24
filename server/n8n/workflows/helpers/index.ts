import * as fs from 'fs'
import * as path from 'path'
import { NodeType } from '../agent-factory/interfaces'

const handleResponseCode = fs.readFileSync(
  path.join(__dirname, '../../helper-nodes/handleResponse/index.js'),
  'utf-8',
)

export interface HandleResponseNodeConfig {
  nodeId: string
  nodeName?: string
  position: [number, number]
}

export function createHandleResponseNode(
  config: HandleResponseNodeConfig,
): NodeType {
  const { nodeId, nodeName = 'Handle Response', position } = config

  return {
    parameters: {
      jsCode: handleResponseCode,
    },
    id: nodeId,
    name: nodeName,
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position,
  }
}

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

export interface SchemaItem {
  id: string
  displayName: string
  required: boolean
  defaultMatch: boolean
  display: boolean
  canBeUsedToMatch: boolean
  type: 'string' | 'number' | 'boolean' | 'object'
}

export type InputType = 'string' | 'number' | 'boolean' | 'object'

export interface ToolInputDef {
  name: string
  description: string
  type: InputType
  required?: boolean
}

export interface StaticInputDef {
  name: string
  value: string
  type: InputType
  required?: boolean
}

export function createStaticInputs(inputs: StaticInputDef[]): {
  value: Record<string, string>
  schema: SchemaItem[]
} {
  const value: Record<string, string> = {}
  const schema: SchemaItem[] = []

  for (const input of inputs) {
    value[input.name] = input.value
    schema.push({
      id: input.name,
      displayName: input.name,
      required: input.required ?? false,
      defaultMatch: false,
      display: true,
      canBeUsedToMatch: true,
      type: input.type,
    })
  }

  return { value, schema }
}

export function createToolInputs(inputs: ToolInputDef[]): {
  value: Record<string, string>
  schema: SchemaItem[]
} {
  const value: Record<string, string> = {}
  const schema: SchemaItem[] = []

  for (const input of inputs) {
    value[input.name] =
      `={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('${input.name}', \`${input.description}\`, '${input.type}') }}`
    schema.push({
      id: input.name,
      displayName: input.name,
      required: input.required ?? false,
      defaultMatch: false,
      display: true,
      canBeUsedToMatch: true,
      type: input.type,
    })
  }

  return { value, schema }
}

export interface CreateToolConfig {
  name: string
  toolName: string
  description: string
  workflowName: string
  nodeId: string
  position: [number, number]
  inputs?: {
    value: Record<string, string>
    schema: SchemaItem[]
  }
}

export interface CreateAgentToolConfig {
  name: string
  toolName: string
  description: string
  workflowName: string
  nodeId: string
  position: [number, number]
  includeUser?: boolean
}

export function createTool(config: CreateToolConfig): NodeType {
  const {
    name,
    toolName,
    description,
    workflowName,
    nodeId,
    position,
    inputs,
  } = config

  return {
    parameters: {
      name,
      description,
      workflowId: {
        __rl: true,
        mode: 'list' as const,
        value: workflowName,
      },
      workflowInputs: {
        mappingMode: 'defineBelow' as const,
        value: inputs?.value ?? {},
        matchingColumns: [],
        schema: inputs?.schema ?? [],
        attemptToConvertTypes: false,
        convertFieldsToString: false,
      },
    },
    id: nodeId,
    name: toolName,
    type: '@n8n/n8n-nodes-langchain.toolWorkflow' as const,
    typeVersion: 2.2,
    position,
  }
}

export function getModel(specificModel?: string): string {
  return (
    specificModel ||
    process.env.AGENT_DEFAULT_MODEL ||
    'anthropic/claude-haiku-4.5'
  )
}

export function createAgentTool(config: CreateAgentToolConfig): NodeType {
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

  return createTool({
    name,
    toolName,
    description,
    workflowName,
    nodeId,
    position,
    inputs: { value, schema },
  })
}
