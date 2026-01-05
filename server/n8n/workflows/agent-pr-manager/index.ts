import * as fs from 'fs'
import * as path from 'path'
import { WorkflowBase } from '../interfaces'
import { createToolGraphqlRequest } from '../tool-graphql-request/factory'

const systemMessage = fs.readFileSync(
  path.join(__dirname, 'system-message.md'),
  'utf-8',
)

const AGENT_NAME = 'PR Manager Agent'
const CREDENTIAL_ID = 'freecode-agent-pr-manager-cred'
const CREDENTIAL_NAME = 'FreeCode API - agent-pr-manager'

const toolGraphqlRequest = createToolGraphqlRequest({
  agentName: AGENT_NAME,
  credentialId: CREDENTIAL_ID,
  credentialName: CREDENTIAL_NAME,
})

const agentWorkflow: WorkflowBase = {
  name: 'Agent: PR Manager',
  active: true,
  versionId: 'agent-pr-manager-v1',
  nodes: [
    {
      parameters: {
        options: {
          systemMessage,
          maxIterations: 20,
        },
      },
      id: 'pr-manager-agent',
      name: 'PR Manager Agent',
      type: '@n8n/n8n-nodes-langchain.agent',
      typeVersion: 3.1,
      position: [224, 304],
    },
    {
      parameters: {
        model: 'anthropic/claude-sonnet-4',
        options: {},
      },
      id: 'pr-chat-model',
      name: 'Sonnet 4 Chat Model',
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
        description:
          'Execute a GraphQL query or mutation against the API for content management (topics/publications). IMPORTANT: All requests are authenticated as PR Manager Agent, not as the external user.',
        workflowId: {
          __rl: true,
          mode: 'list',
          value: `Tool: GraphQL Request (${AGENT_NAME})`,
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
      id: 'tool-graphql-request',
      name: 'GraphQL Request Tool',
      type: '@n8n/n8n-nodes-langchain.toolWorkflow',
      typeVersion: 2.2,
      position: [224, 512],
    },
    {
      parameters: {
        name: 'chat_agent',
        description:
          'Send a message to the Chat Agent for assistance. Use when you need help with user communication, general questions, or tasks outside content management scope.',
        workflowId: {
          __rl: true,
          mode: 'list',
          value: 'Agent: Chat',
        },
        workflowInputs: {
          mappingMode: 'defineBelow',
          value: {
            chatInput:
              "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('message', `Message to send to Chat Agent for assistance`, 'string') }}",
          },
          matchingColumns: [],
          schema: [
            {
              id: 'chatInput',
              displayName: 'message',
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
      id: 'tool-chat-agent',
      name: 'Chat Agent Tool',
      type: '@n8n/n8n-nodes-langchain.toolWorkflow',
      typeVersion: 2.2,
      position: [448, 512],
    },
    {
      parameters: {
        workflowInputs: {
          values: [
            {
              name: 'chatInput',
              type: 'string',
            },
            {
              name: 'user',
              type: 'object',
            },
          ],
        },
      },
      id: 'pr-workflow-trigger',
      name: 'Execute Workflow Trigger',
      type: 'n8n-nodes-base.executeWorkflowTrigger',
      typeVersion: 1.1,
      position: [-200, 304],
    },
    {
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
      id: 'pr-workflow-output',
      name: 'Workflow Output',
      type: 'n8n-nodes-base.set',
      typeVersion: 3.4,
      position: [608, 304],
    },
    {
      parameters: {
        options: {},
      },
      type: '@n8n/n8n-nodes-langchain.chatTrigger',
      typeVersion: 1.4,
      position: [-200, 592],
      id: 'chat-trigger',
      name: 'When chat message received',
      webhookId: 'agent-pr-manager-chat',
    },
  ],
  connections: {
    'PR Manager Agent': {
      main: [[{ node: 'Workflow Output', type: 'main', index: 0 }]],
    },
    'Sonnet 4 Chat Model': {
      ai_languageModel: [
        [{ node: 'PR Manager Agent', type: 'ai_languageModel', index: 0 }],
      ],
    },
    'GraphQL Request Tool': {
      ai_tool: [[{ node: 'PR Manager Agent', type: 'ai_tool', index: 0 }]],
    },
    'Chat Agent Tool': {
      ai_tool: [[{ node: 'PR Manager Agent', type: 'ai_tool', index: 0 }]],
    },
    'Execute Workflow Trigger': {
      main: [[{ node: 'PR Manager Agent', type: 'main', index: 0 }]],
    },
    'When chat message received': {
      main: [[{ node: 'PR Manager Agent', type: 'main', index: 0 }]],
    },
  },
  pinData: {},
  settings: {
    executionOrder: 'v1',
  },
  meta: {
    instanceId: 'narasim-dev-pr-manager',
  },
}

export default [toolGraphqlRequest, agentWorkflow]
