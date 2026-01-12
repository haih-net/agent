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
import { createTool, createToolInputs, createAgentTool } from '../helpers'

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

  const codeExecutionNodes: NodeType[] = canExecuteCode
    ? [
        createTool({
          name: 'read_file',
          toolName: 'Read File Tool',
          description:
            'Read a file from the project source code. Returns file content (max 500 lines).',
          workflowName: 'Tool: Read File',
          nodeId: `${agentId}-tool-read-file`,
          position: [1568, 512],
          inputs: createToolInputs([
            {
              name: 'path',
              description:
                "File path to read, e.g. 'src/index.ts' or 'package.json'",
              type: 'string',
              required: true,
            },
          ]),
        }),
        createTool({
          name: 'list_files',
          toolName: 'List Files Tool',
          description:
            'List files and directories in a given path. Returns ls -la output.',
          workflowName: 'Tool: List Files',
          nodeId: `${agentId}-tool-list-files`,
          position: [1792, 512],
          inputs: createToolInputs([
            {
              name: 'path',
              description: "Directory path to list, e.g. '.' or 'src'",
              type: 'string',
              required: true,
            },
          ]),
        }),
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
        createTool({
          name: 'graphql_request',
          toolName: 'GraphQL Request Tool',
          description: `Execute a GraphQL query or mutation against the API. IMPORTANT: All requests are authenticated as ${agentName}, not as the external user.`,
          workflowName: `Tool: GraphQL Request (${agentName})`,
          nodeId: `${agentId}-tool-graphql`,
          position: [224, 512],
          inputs: createToolInputs([
            {
              name: 'query',
              description: 'Required! GraphQL query or mutation string',
              type: 'string',
              required: true,
            },
            {
              name: 'variables',
              description:
                'Variables object for the query, use {} if no variables needed',
              type: 'string',
              required: true,
            },
            {
              name: 'operationName',
              description:
                'Optional: GraphQL operation name to execute specific operation from document',
              type: 'string',
            },
          ]),
        }),
      ]
    : []

  const graphqlToolConnections: ConnectionsType = hasGraphqlTool
    ? {
        'GraphQL Request Tool': {
          ai_tool: [[{ node: agentName, type: 'ai_tool', index: 0 }]],
        },
      }
    : {}

  const defaultAgentNodes: NodeType[] = [
    ...(hasWebSearchAgent
      ? [
          createAgentTool({
            name: 'web_search_agent',
            toolName: 'Web Search Agent Tool',
            description:
              'Delegate web search and research tasks. Use for: internet search, current information, fact-checking, news, fetching web pages. ONLY FOR AUTHENTICATED USERS.',
            workflowName: 'Agent: Web Search',
            nodeId: `${agentId}-tool-web-search-agent`,
            position: [800, 736],
          }),
        ]
      : []),
  ]

  const defaultAgentConnections: ConnectionsType = {
    ...(hasWebSearchAgent && {
      'Web Search Agent Tool': {
        ai_tool: [[{ node: agentName, type: 'ai_tool', index: 0 }]],
      },
    }),
  }

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
    ...defaultAgentNodes,
    ...codeExecutionNodes,
    ...graphqlToolNodes,
    ...additionalNodes,
  ]

  const baseConnections: ConnectionsType = {
    [agentName]: hasWorkflowOutput
      ? { main: [[{ node: 'Workflow Output', type: 'main', index: 0 }]] }
      : { main: [] },
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
    ...defaultAgentConnections,
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
