import * as path from 'path'
import { createAgent } from '../agent-factory'

const AGENT_NAME = 'Web Search Agent'

const { toolGraphqlRequest, agentWorkflow } = createAgent({
  agentName: AGENT_NAME,
  agentDescription:
    'Specialized agent for web search and research using Perplexity Sonar. Provides real-time information from the internet with citations.',
  agentId: 'web-search-agent',
  workflowName: 'Agent: Web Search',
  versionId: 'agent-web-search-v1',
  credentialId: 'freecode-agent-web-search-cred',
  credentialName: 'FreeCode API - agent-web-search',
  systemMessagePath: path.join(__dirname, 'system-message.md'),
  webhookId: 'agent-web-search-chat',
  instanceId: 'narasim-dev-web-search',
  model: 'perplexity/sonar-reasoning-pro',
  hasGraphqlTool: false,
  hasTools: false,
  memorySize: 0,
  workflowInputs: [
    { name: 'chatInput', type: 'string' },
    { name: 'sessionId', type: 'string' },
    { name: 'user', type: 'object' },
  ],
})

export default [toolGraphqlRequest, agentWorkflow]
