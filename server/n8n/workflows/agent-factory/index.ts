import { createToolGraphqlRequest } from '../tool-graphql-request/factory'
import {
  AgentFactoryConfig,
  AgentFactoryResult,
  ConnectionsType,
  NodeType,
} from './interfaces'
import { getMindLogNodes } from './nodes/mindLogNodes'
import { getTaskNodes } from './nodes/taskNodes'
import { getTaskProgressNodes } from './nodes/taskProgressNodes'
import { WorkflowBase } from '../interfaces'
import { getBaseNodes } from './nodes/baseNodes'
import {
  getCodeExecutionNodes,
  getCodeExecutionConnections,
} from './tools/codeExecution'
import {
  getFetchRequestNodes,
  getFetchRequestConnections,
} from './tools/fetchRequest'
import { getGraphqlToolNodes, getGraphqlToolConnections } from './tools/graphql'
import {
  getWebSearchAgentNodes,
  getWebSearchAgentConnections,
} from './tools/webSearchAgent'

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
    memorySize = process.env.AGENT_MEMORY_SIZE === 'false'
      ? false
      : parseInt(process.env.AGENT_MEMORY_SIZE || '5'),
    canAccessFileSystem = false,
    canExecuteFetch = false,
    authFromToken = false,
    hasGraphqlTool = false,
    hasTools = true,
    hasWebSearchAgent = false,
    additionalNodes = [],
    additionalConnections = {},
    systemMessagePath,
    webhookId,
    model = process.env.AGENT_DEFAULT_MODEL || 'anthropic/claude-sonnet-4',
    maxIterations = 20,
    agentNodeType = 'orchestrator',
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
                token: '={{ $json.token }}',
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

  const mindLogConnections: ConnectionsType = hasTools
    ? {
        'Create MindLog Tool': {
          ai_tool: [[{ node: agentName, type: 'ai_tool', index: 0 }]],
        },
        'Search MindLogs Tool': {
          ai_tool: [[{ node: agentName, type: 'ai_tool', index: 0 }]],
        },
        'Update MindLog Tool': {
          ai_tool: [[{ node: agentName, type: 'ai_tool', index: 0 }]],
        },
        'Delete MindLog Tool': {
          ai_tool: [[{ node: agentName, type: 'ai_tool', index: 0 }]],
        },
      }
    : {}

  const taskConnections: ConnectionsType = hasTools
    ? {
        'Create Task Tool': {
          ai_tool: [[{ node: agentName, type: 'ai_tool', index: 0 }]],
        },
        'Search Tasks Tool': {
          ai_tool: [[{ node: agentName, type: 'ai_tool', index: 0 }]],
        },
        'Update Task Tool': {
          ai_tool: [[{ node: agentName, type: 'ai_tool', index: 0 }]],
        },
        'Delete Task Tool': {
          ai_tool: [[{ node: agentName, type: 'ai_tool', index: 0 }]],
        },
      }
    : {}

  const taskProgressConnections: ConnectionsType = hasTools
    ? {
        'Create Task Progress Tool': {
          ai_tool: [[{ node: agentName, type: 'ai_tool', index: 0 }]],
        },
        'Search Task Progress Tool': {
          ai_tool: [[{ node: agentName, type: 'ai_tool', index: 0 }]],
        },
        'Delete Task Progress Tool': {
          ai_tool: [[{ node: agentName, type: 'ai_tool', index: 0 }]],
        },
      }
    : {}

  const codeExecutionNodes: NodeType[] = canAccessFileSystem
    ? getCodeExecutionNodes({ agentId, agentName })
    : []

  const codeExecutionConnections: ConnectionsType = canAccessFileSystem
    ? getCodeExecutionConnections({ agentId, agentName })
    : {}

  const fetchRequestNodes: NodeType[] = canExecuteFetch
    ? getFetchRequestNodes({ agentId, agentName })
    : []

  const fetchRequestConnections: ConnectionsType = canExecuteFetch
    ? getFetchRequestConnections({ agentId, agentName })
    : {}

  const graphqlToolNodes: NodeType[] = hasGraphqlTool
    ? getGraphqlToolNodes({ agentId, agentName })
    : []

  const graphqlToolConnections: ConnectionsType = hasGraphqlTool
    ? getGraphqlToolConnections({ agentId, agentName })
    : {}

  const webSearchAgentNodes: NodeType[] = hasWebSearchAgent
    ? getWebSearchAgentNodes({ agentId, agentName })
    : []

  const webSearchAgentConnections: ConnectionsType = hasWebSearchAgent
    ? getWebSearchAgentConnections({ agentId, agentName })
    : {}

  const mindLogNodes = hasTools
    ? getMindLogNodes({
        agentId,
        agentName,
      })
    : []

  const taskNodes = hasTools
    ? getTaskNodes({
        agentId,
        agentName,
      })
    : []

  const taskProgressNodes = hasTools
    ? getTaskProgressNodes({
        agentId,
        agentName,
      })
    : []

  const baseNodes = getBaseNodes({
    agentId,
    agentName,
    agentDescription,
    agentNodeType,
    enableStreaming,
    hasMemory,
    hasTools,
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
    ...taskNodes,
    ...taskProgressNodes,
    ...webSearchAgentNodes,
    ...codeExecutionNodes,
    ...fetchRequestNodes,
    ...graphqlToolNodes,
    ...additionalNodes,
  ]

  const baseConnections: ConnectionsType = {
    [agentName]: hasWorkflowOutput
      ? { main: [[{ node: 'Workflow Output', type: 'main', index: 0 }]] }
      : { main: [] },
    ...(hasWorkflowOutput && {
      'Workflow Output': {
        main: [[{ node: 'If Not Streaming', type: 'main', index: 0 }]],
      },
      'If Not Streaming': {
        main: [[{ node: 'Respond to Webhook', type: 'main', index: 0 }], []],
      },
    }),
    ...(agentNodeType !== 'orchestrator' && {
      'Chat Model': {
        ai_languageModel: [
          [{ node: agentName, type: 'ai_languageModel', index: 0 }],
        ],
      },
    }),
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
    ...(hasTools
      ? {
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
      : {
          'Prepare Context': {
            main: [[{ node: agentName, type: 'main', index: 0 }]],
          },
        }),
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
    ...taskConnections,
    ...taskProgressConnections,
    ...webSearchAgentConnections,
    ...codeExecutionConnections,
    ...fetchRequestConnections,
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
