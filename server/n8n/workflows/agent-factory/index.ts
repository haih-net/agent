import * as fs from 'fs'
import { WorkflowBase } from '../interfaces'
import { createToolGraphqlRequest } from '../tool-graphql-request/factory'

type NodeType = WorkflowBase['nodes'][number]
type ConnectionsType = WorkflowBase['connections']

export interface WorkflowInputValue {
  name: string
  type?: 'string' | 'object' | 'number' | 'boolean' | 'any'
  default?: string | number | boolean
}

export interface AgentFactoryConfig {
  agentName: string
  agentId: string
  workflowName: string
  versionId: string
  credentialId: string
  credentialName: string
  systemMessagePath: string
  webhookId: string
  instanceId: string
  workflowInputs?: WorkflowInputValue[]
  hasWorkflowOutput?: boolean
  model?: string
  maxIterations?: number
  additionalNodes?: NodeType[]
  additionalConnections?: ConnectionsType
}

export interface AgentFactoryResult {
  toolGraphqlRequest: WorkflowBase
  agentWorkflow: WorkflowBase
}

export function createAgent(config: AgentFactoryConfig): AgentFactoryResult {
  const {
    agentName,
    agentId,
    workflowName,
    versionId,
    credentialId,
    credentialName,
    systemMessagePath,
    webhookId,
    instanceId,
    workflowInputs = [{ name: 'chatInput', type: 'string' }],
    hasWorkflowOutput = true,
    model = 'anthropic/claude-sonnet-4',
    maxIterations = 20,
    additionalNodes = [],
    additionalConnections = {},
  } = config

  const systemMessage = fs.readFileSync(systemMessagePath, 'utf-8')

  const toolGraphqlRequest = createToolGraphqlRequest({
    agentName,
    credentialId,
    credentialName,
  })

  const baseNodes: NodeType[] = [
    {
      parameters: {
        options: {
          systemMessage,
          maxIterations,
        },
      },
      id: agentId,
      name: agentName,
      type: '@n8n/n8n-nodes-langchain.agent',
      typeVersion: 3.1,
      position: [224, 304],
    },
    {
      parameters: {
        model,
        options: {},
      },
      id: `${agentId}-chat-model`,
      name: 'Chat Model',
      type: '@n8n/n8n-nodes-langchain.lmChatOpenRouter',
      typeVersion: 1,
      position: [64, 512],
      credentials: {
        openRouterApi: {
          id: 'FsN0N48lU327xkz6',
          name: 'OpenRouter',
        },
      },
    },
    {
      parameters: {
        name: 'graphql_request',
        description: `Execute a GraphQL query or mutation against the API. IMPORTANT: All requests are authenticated as ${agentName}, not as the external user.`,
        workflowId: {
          __rl: true,
          mode: 'list',
          value: `Tool: GraphQL Request (${agentName})`,
        },
        workflowInputs: {
          mappingMode: 'defineBelow',
          value: {
            query:
              "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('query', `Required! GraphQL query or mutation string`, 'string') }}",
            variables:
              "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('variables', `Variables object for the query, use {} if no variables needed`, 'string') }}",
            operationName:
              "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('operationName', `Optional: GraphQL operation name to execute specific operation from document`, 'string') }}",
          },
          matchingColumns: ['query'],
          schema: [
            {
              id: 'query',
              displayName: 'query',
              required: true,
              defaultMatch: false,
              display: true,
              canBeUsedToMatch: true,
              type: 'string',
              removed: false,
            },
            {
              id: 'variables',
              displayName: 'variables',
              required: true,
              defaultMatch: false,
              display: true,
              canBeUsedToMatch: true,
              removed: false,
            },
            {
              id: 'operationName',
              displayName: 'operationName',
              required: false,
              defaultMatch: false,
              display: true,
              canBeUsedToMatch: true,
              type: 'string',
              removed: false,
            },
          ],
          attemptToConvertTypes: false,
          convertFieldsToString: false,
        },
      },
      id: `${agentId}-tool-graphql`,
      name: 'GraphQL Request Tool',
      type: '@n8n/n8n-nodes-langchain.toolWorkflow',
      typeVersion: 2.2,
      position: [224, 512],
    },
    {
      parameters: {
        workflowInputs: {
          values: workflowInputs.map((input) => ({
            name: input.name,
            type: input.type || 'string',
            ...(input.default !== undefined && { default: input.default }),
          })),
        },
      },
      id: `${agentId}-workflow-trigger`,
      name: 'Execute Workflow Trigger',
      type: 'n8n-nodes-base.executeWorkflowTrigger',
      typeVersion: 1.1,
      position: [-200, 304],
    },
    {
      parameters: {
        options: {},
      },
      type: '@n8n/n8n-nodes-langchain.chatTrigger',
      typeVersion: 1.4,
      position: [-200, 592],
      id: `${agentId}-chat-trigger`,
      name: 'When chat message received',
      webhookId,
    },
  ]

  if (hasWorkflowOutput) {
    baseNodes.push({
      parameters: {
        mode: 'manual',
        duplicateItem: false,
        assignments: {
          assignments: [
            {
              id: 'output',
              name: 'output',
              value: '={{ $json.output }}',
              type: 'string',
            },
          ],
        },
        options: {},
      },
      id: `${agentId}-workflow-output`,
      name: 'Workflow Output',
      type: 'n8n-nodes-base.set',
      typeVersion: 3.4,
      position: [608, 304],
    })
  }

  const nodes: NodeType[] = [...baseNodes, ...additionalNodes]

  const baseConnections: ConnectionsType = {
    [agentName]: hasWorkflowOutput
      ? { main: [[{ node: 'Workflow Output', type: 'main', index: 0 }]] }
      : { main: [] },
    'Chat Model': {
      ai_languageModel: [
        [{ node: agentName, type: 'ai_languageModel', index: 0 }],
      ],
    },
    'GraphQL Request Tool': {
      ai_tool: [[{ node: agentName, type: 'ai_tool', index: 0 }]],
    },
    'Execute Workflow Trigger': {
      main: [[{ node: agentName, type: 'main', index: 0 }]],
    },
    'When chat message received': {
      main: [[{ node: agentName, type: 'main', index: 0 }]],
    },
  }

  const connections: ConnectionsType = {
    ...baseConnections,
    ...additionalConnections,
  }

  const agentWorkflow: WorkflowBase = {
    name: workflowName,
    active: true,
    versionId,
    nodes,
    connections,
    pinData: {},
    settings: {
      executionOrder: 'v1',
    },
    meta: {
      instanceId,
    },
  }

  return {
    toolGraphqlRequest,
    agentWorkflow,
  }
}
