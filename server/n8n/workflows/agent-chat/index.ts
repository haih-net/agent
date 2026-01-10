import * as path from 'path'
import { createAgent } from '../agent-factory'
import {
  SESSION_ID_EXPRESSION,
  SESSION_ID_SCHEMA,
  USER_EXPRESSION,
  USER_SCHEMA,
} from '../helpers'

const { toolGraphqlRequest, agentWorkflow } = createAgent({
  agentName: 'Chat Agent',
  agentDescription:
    'Main chat agent for freecode.academy. Handles user conversations and delegates to specialized agents.',
  agentId: 'chat-agent',
  workflowName: 'Agent: Chat',
  versionId: 'agent-chat-v7',
  credentialId: 'freecode-agent-chat-cred',
  credentialName: 'FreeCode API - agent-chat',
  systemMessagePath: path.join(__dirname, 'system-message.md'),
  webhookId: 'agent-chat-webhook',
  instanceId: 'narasim-dev-agent-chat',
  hasWorkflowOutput: true,
  authFromToken: true,
  hasGraphqlTool: false,
  agentNodeType: 'orchestrator',
  additionalNodes: [
    {
      parameters: {
        name: 'api_agent',
        description:
          'Delegate API tasks to the API Agent — LAST RESORT. Use only for API schema questions or when specialized agents cannot help.',
        workflowId: {
          __rl: true,
          mode: 'list',
          value: 'Agent: API',
        },
        workflowInputs: {
          mappingMode: 'defineBelow',
          value: {
            chatInput:
              "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('request', `Describe what you need from the API.`, 'string') }}",
            sessionId: SESSION_ID_EXPRESSION,
          },
          matchingColumns: [],
          schema: [
            {
              id: 'chatInput',
              displayName: 'request',
              required: true,
              defaultMatch: false,
              display: true,
              canBeUsedToMatch: true,
              type: 'string',
            },
            SESSION_ID_SCHEMA,
          ],
          attemptToConvertTypes: false,
          convertFieldsToString: false,
        },
      },
      id: 'tool-api-agent',
      name: 'API Agent Tool',
      type: '@n8n/n8n-nodes-langchain.toolWorkflow',
      typeVersion: 2.2,
      position: [448, 512],
    },
    {
      parameters: {
        name: 'project_manager_agent',
        description:
          'Delegate project and task management. Use for: projects, tasks, team, progress tracking.',
        workflowId: {
          __rl: true,
          mode: 'list',
          value: 'Agent: Project Manager',
        },
        workflowInputs: {
          mappingMode: 'defineBelow',
          value: {
            chatInput:
              "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('request', `Describe the project/task operation.`, 'string') }}",
            sessionId: SESSION_ID_EXPRESSION,
            user: USER_EXPRESSION,
          },
          matchingColumns: [],
          schema: [
            {
              id: 'chatInput',
              displayName: 'request',
              required: true,
              defaultMatch: false,
              display: true,
              canBeUsedToMatch: true,
              type: 'string',
            },
            SESSION_ID_SCHEMA,
            USER_SCHEMA,
          ],
          attemptToConvertTypes: false,
          convertFieldsToString: false,
        },
      },
      id: 'tool-project-manager-agent',
      name: 'Project Manager Agent Tool',
      type: '@n8n/n8n-nodes-langchain.toolWorkflow',
      typeVersion: 2.2,
      position: [448, 672],
    },
    {
      parameters: {
        name: 'pr_manager_agent',
        description:
          'Delegate content/publication management. Use for: topics, articles, publications, blog posts.',
        workflowId: {
          __rl: true,
          mode: 'list',
          value: 'Agent: PR Manager',
        },
        workflowInputs: {
          mappingMode: 'defineBelow',
          value: {
            chatInput:
              "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('request', `Describe the content operation.`, 'string') }}",
            sessionId: SESSION_ID_EXPRESSION,
            user: USER_EXPRESSION,
          },
          matchingColumns: [],
          schema: [
            {
              id: 'chatInput',
              displayName: 'request',
              required: true,
              defaultMatch: false,
              display: true,
              canBeUsedToMatch: true,
              type: 'string',
            },
            SESSION_ID_SCHEMA,
            USER_SCHEMA,
          ],
          attemptToConvertTypes: false,
          convertFieldsToString: false,
        },
      },
      id: 'tool-pr-manager-agent',
      name: 'PR Manager Agent Tool',
      type: '@n8n/n8n-nodes-langchain.toolWorkflow',
      typeVersion: 2.2,
      position: [448, 832],
    },
  ],
  additionalConnections: {
    'API Agent Tool': {
      ai_tool: [[{ node: 'Chat Agent', type: 'ai_tool', index: 0 }]],
    },
    'Project Manager Agent Tool': {
      ai_tool: [[{ node: 'Chat Agent', type: 'ai_tool', index: 0 }]],
    },
    'PR Manager Agent Tool': {
      ai_tool: [[{ node: 'Chat Agent', type: 'ai_tool', index: 0 }]],
    },
  },
})

export default [toolGraphqlRequest, agentWorkflow]
