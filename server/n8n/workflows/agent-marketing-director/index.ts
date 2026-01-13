import * as path from 'path'
import { createAgent } from '../agent-factory'
import { createAgentTool } from '../helpers'

const AGENT_NAME = 'Marketing Director Agent'

const { toolGraphqlRequest, agentWorkflow } = createAgent({
  agentName: AGENT_NAME,
  agentDescription:
    'Marketing Director responsible for strategic marketing decisions, market research, and promotional activities.',
  agentId: 'marketing-director-agent',
  workflowName: 'Agent: Marketing Director',
  versionId: 'agent-marketing-director-v1',
  credentialId: 'freecode-agent-marketing-director-cred',
  credentialName: 'FreeCode API - agent-marketing-director',
  systemMessagePath: path.join(__dirname, 'system-message.md'),
  webhookId: 'agent-marketing-director-chat',
  instanceId: 'narasim-dev-marketing-director',
  model:
    process.env.AGENT_MARKETING_DIRECTOR_MODEL || 'anthropic/claude-sonnet-4',
  workflowInputs: [
    { name: 'chatInput', type: 'string' },
    { name: 'sessionId', type: 'string' },
    { name: 'user', type: 'object' },
  ],
  additionalNodes: [
    createAgentTool({
      name: 'web_search_agent',
      toolName: 'Web Search Agent Tool',
      description:
        'Delegate web search and research tasks. Use for: internet search, market research, competitor analysis, trends, news, fetching web pages.',
      workflowName: 'Agent: Web Search',
      nodeId: 'tool-web-search-agent',
      position: [448, 512],
    }),
  ],
  additionalConnections: {
    'Web Search Agent Tool': {
      ai_tool: [[{ node: AGENT_NAME, type: 'ai_tool', index: 0 }]],
    },
  },
})

export default [toolGraphqlRequest, agentWorkflow]
