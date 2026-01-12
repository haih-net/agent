import * as path from 'path'
import { createAgent } from '../agent-factory'
import { createAgentTool } from '../helpers'

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
    createAgentTool({
      name: 'chat_agent',
      toolName: 'Chat Agent Tool',
      description:
        'Send a message to the Chat Agent for assistance. Use when you need help with user communication, general questions, or tasks outside content management scope.',
      workflowName: 'Agent: Chat',
      nodeId: 'tool-chat-agent',
      position: [448, 512],
      includeUser: false,
    }),
  ],
  additionalConnections: {
    'Chat Agent Tool': {
      ai_tool: [[{ node: AGENT_NAME, type: 'ai_tool', index: 0 }]],
    },
  },
})

export default [toolGraphqlRequest, agentWorkflow]
