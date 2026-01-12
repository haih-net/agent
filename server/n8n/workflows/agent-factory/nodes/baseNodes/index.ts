import * as fs from 'fs'
import * as path from 'path'
import { print } from 'graphql'
import { MeDocument } from 'src/gql/generated/me'
import { AgentFactoryConfig, NodeType } from '../../interfaces'
import type { INodeParameters } from 'n8n-workflow'
import { getFetchMindLogsNode } from './fetchMindLogsNode'

const meUserQuery = print(MeDocument)

type getBaseNodesProps = {
  agentId: string
  agentName: string
  hasMemory: boolean
  hasTools: boolean
  systemMessagePath: string
  memorySize: AgentFactoryConfig['memorySize']
  hasWorkflowOutput: AgentFactoryConfig['hasWorkflowOutput']
  maxIterations: AgentFactoryConfig['maxIterations']
  enableStreaming: AgentFactoryConfig['enableStreaming']
  agentNodeType: AgentFactoryConfig['agentNodeType']
  model: AgentFactoryConfig['model']
  workflowInputs: AgentFactoryConfig['workflowInputs']
  agentDescription: AgentFactoryConfig['agentDescription']
  webhookId: AgentFactoryConfig['webhookId']
}

export function getBaseNodes({
  agentId,
  agentName,
  hasMemory,
  hasTools,
  systemMessagePath,
  memorySize,
  hasWorkflowOutput,
  maxIterations,
  enableStreaming,
  agentNodeType,
  model,
  agentDescription,
  webhookId,
  workflowInputs = [],
}: getBaseNodesProps) {
  const prepareContextTemplate = fs.readFileSync(
    path.join(__dirname, 'prepareContext.js'),
    'utf-8',
  )

  const prepareMindLogsTemplate = fs.readFileSync(
    path.join(__dirname, 'prepareMindLogs.js'),
    'utf-8',
  )

  const baseSystemMessage = fs.readFileSync(
    path.join(__dirname, 'base-system-message.md'),
    'utf-8',
  )

  const customSystemMessage = fs.readFileSync(systemMessagePath, 'utf-8')

  const systemMessage = `${baseSystemMessage}

# Agent-Specific Instructions

${customSystemMessage}`

  const prepareContextCode = prepareContextTemplate.replace(
    '$config',
    JSON.stringify({ agentId }, null, 2),
  )

  const prepareMindLogsCode = prepareMindLogsTemplate.replace(
    '$config',
    JSON.stringify({ agentId }, null, 2),
  )

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
            query: meUserQuery,
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
      position: [-432, 304],
    },
    {
      parameters: {
        jsCode: prepareContextCode,
      },
      id: `${agentId}-prepare-context`,
      name: 'Prepare Context',
      type: 'n8n-nodes-base.code',
      typeVersion: 2,
      position: [-224, 304],
    },
    ...(hasTools
      ? [
          getFetchMindLogsNode({ agentId, agentName }),
          {
            parameters: {
              jsCode: prepareMindLogsCode,
            },
            id: `${agentId}-prepare-mindlogs`,
            name: 'Prepare MindLogs',
            type: 'n8n-nodes-base.code',
            typeVersion: 2,
            position: [192, 304] as [number, number],
          },
        ]
      : []),
    (() => {
      const agentNode: NodeType = {
        parameters: {
          options: {
            systemMessage,
            maxIterations,
            enableStreaming: `={{ $json.enableStreaming === "false" ? false : ${enableStreaming} }}`,
          },
        },
        id: agentId,
        name: agentName,
        type: '@n8n/n8n-nodes-langchain.agent',
        typeVersion: 3.1,
        position: [400, 304],
      }

      if (agentNodeType === 'orchestrator') {
        agentNode.parameters.mode = 'full'
        agentNode.parameters.model = model

        const additionalFields: INodeParameters = {
          systemMessage: `=${systemMessage}`,
          assistantMessages: '={{ $json.assistantMessages }}',
          showToolCalls: true,
          toolChoice: 'auto',
        }

        agentNode.parameters.options = Object.assign(
          agentNode.parameters.options ?? {},
          additionalFields,
        )

        agentNode.type = 'CUSTOM.agentOrchestrator'
        agentNode.typeVersion = 1
        agentNode.credentials = {
          openRouterApi: {
            id: 'FsN0N48lU327xkz6',
            name: 'OpenRouter',
          },
        }
      }

      return agentNode
    })(),
    ...(agentNodeType !== 'orchestrator'
      ? [
          {
            parameters: {
              model,
              options: {},
            },
            id: `${agentId}-chat-model`,
            name: 'Chat Model',
            type: '@n8n/n8n-nodes-langchain.lmChatOpenRouter',
            typeVersion: 1,
            position: [-64, 512] as [number, number],
            credentials: {
              openRouterApi: {
                id: 'FsN0N48lU327xkz6',
                name: 'OpenRouter',
              },
            },
          },
        ]
      : []),
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
      position: [-640, 304],
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
        },
      },
      type: '@n8n/n8n-nodes-langchain.chatTrigger',
      typeVersion: 1.4,
      position: [-640, 592],
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
      position: [440, 720],
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
      position: [728, 304],
    })
  }

  return baseNodes
}
