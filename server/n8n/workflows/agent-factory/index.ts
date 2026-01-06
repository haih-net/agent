import * as fs from 'fs'
import * as path from 'path'
import { WorkflowBase } from '../interfaces'
import { createToolGraphqlRequest } from '../tool-graphql-request/factory'

const prepareContextTemplate = fs.readFileSync(
  path.join(__dirname, 'prepareContext.js'),
  'utf-8',
)

type NodeType = WorkflowBase['nodes'][number]
type ConnectionsType = WorkflowBase['connections']

export interface WorkflowInputValue {
  name: string
  type?: 'string' | 'object' | 'number' | 'boolean' | 'any'
  default?: string | number | boolean
}

export interface AgentFactoryConfig {
  agentName: string
  agentDescription: string
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
  memorySize?: number | false
  canExecuteCode?: boolean
  authFromToken?: boolean
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
    agentDescription,
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
    memorySize = 10,
    canExecuteCode = false,
    authFromToken = false,
    additionalNodes = [],
    additionalConnections = {},
  } = config

  const hasMemory = typeof memorySize === 'number' && memorySize > 0

  const systemMessage = fs.readFileSync(systemMessagePath, 'utf-8')

  const prepareContextCode = prepareContextTemplate.replace(
    '$config',
    JSON.stringify({ agentId }, null, 2),
  )

  const toolGraphqlRequest = createToolGraphqlRequest({
    agentName,
    credentialId,
    credentialName,
  })

  const baseNodes: NodeType[] = [
    {
      parameters: {
        workflowId: {
          __rl: true,
          mode: 'list',
          value: `Tool: GraphQL Request (${agentName})`,
        },
        workflowInputs: {
          mappingMode: 'defineBelow',
          value: {
            query:
              'query freeCodeMeUser($fullInfo: Boolean = true) { freeCodeMe { ...FreeCodeUserNoNesting } } fragment FreeCodeUserNoNesting on FreeCodeUser { id username fullname createdAt intro @include(if: $fullInfo) content @include(if: $fullInfo) }',
          },
          matchingColumns: [],
          schema: [
            {
              id: 'query',
              displayName: 'query',
              required: true,
              defaultMatch: false,
              display: true,
              canBeUsedToMatch: true,
              type: 'string',
            },
          ],
          attemptToConvertTypes: false,
          convertFieldsToString: false,
        },
      },
      id: `${agentId}-get-agent-data`,
      name: 'Get Agent Data',
      type: 'n8n-nodes-base.executeWorkflow',
      typeVersion: 1.2,
      position: [-224, 304],
    },
    {
      parameters: {
        jsCode: prepareContextCode,
      },
      id: `${agentId}-prepare-context`,
      name: 'Prepare Context',
      type: 'n8n-nodes-base.code',
      typeVersion: 2,
      position: [-16, 304],
    },
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
      position: [-64, 512],
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
      position: [-432, 304],
    },
    {
      parameters: {
        // public: true enables external webhook access (without it returns 404)
        public: true,
        // mode: 'webhook' for embedded chat / direct webhook calls (vs 'hostedChat' for n8n-served page)
        mode: 'webhook',
        availableInChat: true,
        agentName,
        agentDescription,
        options: {
          allowFileUploads: true,
          responseMode: 'streaming',
        },
      },
      type: '@n8n/n8n-nodes-langchain.chatTrigger',
      typeVersion: 1.4,
      position: [-432, 592],
      id: `${agentId}-chat-trigger`,
      name: 'When chat message received',
      webhookId,
    },
  ]

  if (hasMemory) {
    baseNodes.push({
      parameters: {
        sessionIdType: 'customKey',
        sessionKey: '={{ $json.sessionId }}',
        contextWindowLength: memorySize,
      },
      id: `${agentId}-memory`,
      name: 'Simple Memory',
      type: '@n8n/n8n-nodes-langchain.memoryBufferWindow',
      typeVersion: 1.3,
      position: [320, 720],
    })
  }

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

  const authNodes: NodeType[] = authFromToken
    ? [
        {
          parameters: {
            workflowId: {
              __rl: true,
              mode: 'name',
              value: 'Tool: Get User By Token',
            },
            workflowInputs: {
              mappingMode: 'defineBelow',
              value: {
                token: '={{ $json.body.token }}',
              },
              matchingColumns: [],
              schema: [
                {
                  id: 'token',
                  displayName: 'token',
                  required: false,
                  defaultMatch: false,
                  display: true,
                  canBeUsedToMatch: true,
                  type: 'string',
                },
              ],
              attemptToConvertTypes: false,
              convertFieldsToString: false,
            },
          },
          id: `${agentId}-get-user-by-token`,
          name: 'Get User By Token',
          type: 'n8n-nodes-base.executeWorkflow',
          typeVersion: 1.2,
          position: [-224, 592],
        },
        {
          parameters: {
            mode: 'manual',
            duplicateItem: false,
            assignments: {
              assignments: [
                {
                  id: 'user',
                  name: 'user',
                  value: '={{ $json.user }}',
                  type: 'object',
                },
                {
                  id: 'chatInput',
                  name: 'chatInput',
                  value:
                    '={{ $("When chat message received").item.json.chatInput }}',
                  type: 'string',
                },
                {
                  id: 'sessionId',
                  name: 'sessionId',
                  value:
                    '={{ $("When chat message received").item.json.sessionId }}',
                  type: 'string',
                },
              ],
            },
            options: {},
          },
          id: `${agentId}-set-auth-context`,
          name: 'Set Auth Context',
          type: 'n8n-nodes-base.set',
          typeVersion: 3.4,
          position: [-16, 592],
        },
      ]
    : []

  const authConnections: ConnectionsType = authFromToken
    ? {
        'Get User By Token': {
          main: [[{ node: 'Set Auth Context', type: 'main', index: 0 }]],
        },
        'Set Auth Context': {
          main: [[{ node: 'Get Agent Data', type: 'main', index: 0 }]],
        },
      }
    : {}

  const mindLogNodes: NodeType[] = [
    {
      parameters: {
        name: 'create_mindlog',
        description:
          'Create a MindLog entry. Types: Knowledge (useful new information worth remembering), Error (any error that occurred). Use Knowledge only for genuinely useful new facts/patterns. Use Error always when any error occurs.',
        workflowId: {
          __rl: true,
          mode: 'list',
          value: `Tool: GraphQL Request (${agentName})`,
        },
        workflowInputs: {
          mappingMode: 'defineBelow',
          value: {
            query:
              'mutation createFreeCodeMindLog($data: FreeCodeMindLogCreateInput!) { response: createFreeCodeMindLog(data: $data) { success message data { id type data createdAt } } }',
            variables:
              "={{ JSON.stringify({ data: { type: $fromAI('type', 'Knowledge or Error', 'string'), data: $fromAI('data', 'Content to save', 'string') } }) }}",
          },
          matchingColumns: [],
          schema: [
            {
              id: 'query',
              displayName: 'query',
              required: true,
              defaultMatch: false,
              display: true,
              canBeUsedToMatch: true,
              type: 'string',
            },
            {
              id: 'variables',
              displayName: 'variables',
              required: true,
              defaultMatch: false,
              display: true,
              canBeUsedToMatch: true,
              type: 'string',
            },
          ],
          attemptToConvertTypes: false,
          convertFieldsToString: false,
        },
      },
      id: `${agentId}-tool-create-mindlog`,
      name: 'Create MindLog Tool',
      type: '@n8n/n8n-nodes-langchain.toolWorkflow',
      typeVersion: 2.2,
      position: [672, 512],
    },
    {
      parameters: {
        name: 'search_mindlogs',
        description:
          'Search MindLog entries. Filter by type: Knowledge or Error.',
        workflowId: {
          __rl: true,
          mode: 'list',
          value: `Tool: GraphQL Request (${agentName})`,
        },
        workflowInputs: {
          mappingMode: 'defineBelow',
          value: {
            query:
              'query freeCodeMyMindLogs($where: FreeCodeMindLogWhereInput, $take: Int) { freeCodeMyMindLogs(where: $where, take: $take) { id type data createdAt } freeCodeMyMindLogsCount(where: $where) }',
            variables:
              "={{ JSON.stringify({ where: $fromAI('type', 'Filter by type (optional): Knowledge or Error', 'string') ? { type: $fromAI('type', '', 'string') } : undefined, take: $fromAI('limit', 'Max results (default 50)', 'number') || 50 }) }}",
          },
          matchingColumns: [],
          schema: [
            {
              id: 'query',
              displayName: 'query',
              required: true,
              defaultMatch: false,
              display: true,
              canBeUsedToMatch: true,
              type: 'string',
            },
            {
              id: 'variables',
              displayName: 'variables',
              required: true,
              defaultMatch: false,
              display: true,
              canBeUsedToMatch: true,
              type: 'string',
            },
          ],
          attemptToConvertTypes: false,
          convertFieldsToString: false,
        },
      },
      id: `${agentId}-tool-search-mindlogs`,
      name: 'Search MindLogs Tool',
      type: '@n8n/n8n-nodes-langchain.toolWorkflow',
      typeVersion: 2.2,
      position: [896, 512],
    },
  ]

  const mindLogConnections: ConnectionsType = {
    'Create MindLog Tool': {
      ai_tool: [[{ node: agentName, type: 'ai_tool', index: 0 }]],
    },
    'Search MindLogs Tool': {
      ai_tool: [[{ node: agentName, type: 'ai_tool', index: 0 }]],
    },
  }

  const codeExecutionNodes: NodeType[] = canExecuteCode
    ? [
        {
          parameters: {
            name: 'read_file',
            description:
              'Read a file from the project source code. Returns file content (max 500 lines).',
            workflowId: {
              __rl: true,
              mode: 'list',
              value: 'Tool: Read File',
            },
            workflowInputs: {
              mappingMode: 'defineBelow',
              value: {
                path: "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('path', `File path to read, e.g. 'src/index.ts' or 'package.json'`, 'string') }}",
              },
              matchingColumns: [],
              schema: [
                {
                  id: 'path',
                  displayName: 'path',
                  required: true,
                  defaultMatch: false,
                  display: true,
                  canBeUsedToMatch: true,
                  type: 'string',
                },
              ],
              attemptToConvertTypes: false,
              convertFieldsToString: false,
            },
          },
          id: `${agentId}-tool-read-file`,
          name: 'Read File Tool',
          type: '@n8n/n8n-nodes-langchain.toolWorkflow',
          typeVersion: 2.2,
          position: [1568, 512],
        },
        {
          parameters: {
            name: 'list_files',
            description:
              'List files and directories in a given path. Returns ls -la output.',
            workflowId: {
              __rl: true,
              mode: 'list',
              value: 'Tool: List Files',
            },
            workflowInputs: {
              mappingMode: 'defineBelow',
              value: {
                path: "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('path', `Directory path to list, e.g. '.' or 'src'`, 'string') }}",
              },
              matchingColumns: [],
              schema: [
                {
                  id: 'path',
                  displayName: 'path',
                  required: true,
                  defaultMatch: false,
                  display: true,
                  canBeUsedToMatch: true,
                  type: 'string',
                },
              ],
              attemptToConvertTypes: false,
              convertFieldsToString: false,
            },
          },
          id: `${agentId}-tool-list-files`,
          name: 'List Files Tool',
          type: '@n8n/n8n-nodes-langchain.toolWorkflow',
          typeVersion: 2.2,
          position: [1792, 512],
        },
      ]
    : []

  const codeExecutionConnections: ConnectionsType = canExecuteCode
    ? {
        'Read File Tool': {
          ai_tool: [[{ node: agentName, type: 'ai_tool', index: 0 }]],
        },
        'List Files Tool': {
          ai_tool: [[{ node: agentName, type: 'ai_tool', index: 0 }]],
        },
      }
    : {}

  const nodes: NodeType[] = [
    ...baseNodes,
    ...authNodes,
    ...mindLogNodes,
    ...codeExecutionNodes,
    ...additionalNodes,
  ]

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
      main: [[{ node: 'Get Agent Data', type: 'main', index: 0 }]],
    },
    'When chat message received': {
      main: [
        [
          {
            node: authFromToken ? 'Get User By Token' : 'Get Agent Data',
            type: 'main',
            index: 0,
          },
        ],
      ],
    },
    'Get Agent Data': {
      main: [[{ node: 'Prepare Context', type: 'main', index: 0 }]],
    },
    'Prepare Context': {
      main: [[{ node: agentName, type: 'main', index: 0 }]],
    },
  }

  if (hasMemory) {
    baseConnections['Simple Memory'] = {
      ai_memory: [[{ node: agentName, type: 'ai_memory', index: 0 }]],
    }
  }

  const connections: ConnectionsType = {
    ...baseConnections,
    ...authConnections,
    ...mindLogConnections,
    ...codeExecutionConnections,
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
