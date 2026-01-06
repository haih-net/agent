import * as path from 'path'
import { createAgent } from '../agent-factory'

const AGENT_NAME = 'PR Manager Agent'

const { toolGraphqlRequest, agentWorkflow } = createAgent({
  agentName: AGENT_NAME,
  agentDescription:
    'Specialized agent for managing topics, articles, and publications.',
  agentId: 'pr-manager-agent',
  workflowName: 'Agent: PR Manager',
  versionId: 'agent-pr-manager-v1',
  credentialId: 'freecode-agent-pr-manager-cred',
  credentialName: 'FreeCode API - agent-pr-manager',
  systemMessagePath: path.join(__dirname, 'system-message.md'),
  webhookId: 'agent-pr-manager-chat',
  instanceId: 'narasim-dev-pr-manager',
  workflowInputs: [
    { name: 'chatInput', type: 'string' },
    { name: 'sessionId', type: 'string' },
    { name: 'user', type: 'object' },
  ],
  additionalNodes: [
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
            sessionId:
              "={{ [($json.agentId || ''), ($json.sessionId || '')].filter(v => v).join('_') }}",
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
            {
              id: 'sessionId',
              displayName: 'sessionId',
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
  ],
  additionalConnections: {
    'Chat Agent Tool': {
      ai_tool: [[{ node: AGENT_NAME, type: 'ai_tool', index: 0 }]],
    },
  },
})

export default [toolGraphqlRequest, agentWorkflow]
