import { createToolGraphqlRequest } from '../tool-graphql-request/factory'
import {
  AgentFactoryConfig,
  AgentFactoryResult,
  ConnectionsType,
  NodeType,
} from './interfaces'
import { getMindLogNodes } from './nodes/mindLogNodes'
import { WorkflowBase } from '../interfaces'
import { getBaseNodes } from './nodes/baseNodes'

export function createAgent(config: AgentFactoryConfig): AgentFactoryResult {
  const {
    agentId,
    agentName,
    agentDescription,
    workflowName,
    versionId,
    credentialId,
    credentialName,
    instanceId,
    hasWorkflowOutput = true,
    memorySize = 10,
    canExecuteCode = false,
    authFromToken = false,
    hasGraphqlTool = true,
    additionalNodes = [],
    additionalConnections = {},
    systemMessagePath,
    webhookId,
    model = 'anthropic/claude-sonnet-4',
    maxIterations = 20,
    agentNodeType = 'default',
    enableStreaming = true,
    workflowInputs = [
      { name: 'chatInput', type: 'string' },
      { name: 'sessionId', type: 'string' },
      { name: 'user', type: 'object' },
    ],
  } = config

  const hasMemory = typeof memorySize === 'number' && memorySize > 0

  const toolGraphqlRequest = createToolGraphqlRequest({
    agentName,
    credentialId,
    credentialName,
  })

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
          position: [-432, 592],
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
          position: [-224, 592],
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

  const mindLogConnections: ConnectionsType = {
    'Create MindLog Tool': {
      ai_tool: [[{ node: agentName, type: 'ai_tool', index: 0 }]],
    },
    'Search MindLogs Tool': {
      ai_tool: [[{ node: agentName, type: 'ai_tool', index: 0 }]],
    },
    'Update MindLog Tool': {
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

  const graphqlToolNodes: NodeType[] = hasGraphqlTool
    ? [
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
      ]
    : []

  const graphqlToolConnections: ConnectionsType = hasGraphqlTool
    ? {
        'GraphQL Request Tool': {
          ai_tool: [[{ node: agentName, type: 'ai_tool', index: 0 }]],
        },
      }
    : {}

  const mindLogNodes = getMindLogNodes({
    agentId,
    agentName,
  })

  const baseNodes = getBaseNodes({
    agentId,
    agentName,
    agentDescription,
    agentNodeType,
    enableStreaming,
    hasMemory,
    hasWorkflowOutput,
    maxIterations,
    memorySize,
    model,
    systemMessagePath,
    webhookId,
    workflowInputs,
  })

  const nodes: NodeType[] = [
    ...baseNodes,
    ...authNodes,
    ...mindLogNodes,
    ...codeExecutionNodes,
    ...graphqlToolNodes,
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
      main: [[{ node: 'Fetch MindLogs', type: 'main', index: 0 }]],
    },
    'Fetch MindLogs': {
      main: [[{ node: 'Prepare MindLogs', type: 'main', index: 0 }]],
    },
    'Prepare MindLogs': {
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
    ...graphqlToolConnections,
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
