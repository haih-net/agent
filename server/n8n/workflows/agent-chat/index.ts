import * as path from 'path'
import { createAgent } from '../agent-factory'
import { createAgentTool } from '../helpers'

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
  model: process.env.AGENT_CHAT_MODEL || 'anthropic/claude-opus-4.5',
  hasWorkflowOutput: true,
  authFromToken: true,
  agentNodeType: 'orchestrator',
  additionalNodes: [
    createAgentTool({
      name: 'api_agent',
      toolName: 'API Agent Tool',
      description:
        'Delegate API tasks to the API Agent — LAST RESORT. Use only for API schema questions or when specialized agents cannot help.',
      workflowName: 'Agent: API',
      nodeId: 'tool-api-agent',
      position: [700, 512],
      includeUser: false,
    }),
    createAgentTool({
      name: 'project_manager_agent',
      toolName: 'Project Manager Agent Tool',
      description:
        'Delegate project and task management. Use for: projects, tasks, team, progress tracking.',
      workflowName: 'Agent: Project Manager',
      nodeId: 'tool-project-manager-agent',
      position: [880, 512],
    }),
    createAgentTool({
      name: 'pr_manager_agent',
      toolName: 'PR Manager Agent Tool',
      description:
        'Delegate content/publication management. Use for: topics, articles, publications, blog posts.',
      workflowName: 'Agent: PR Manager',
      nodeId: 'tool-pr-manager-agent',
      position: [1060, 512],
    }),
    createAgentTool({
      name: 'web_search_agent',
      toolName: 'Web Search Agent Tool',
      description:
        'Delegate web search and research tasks. Use for: internet search, current information, fact-checking, news, fetching web pages. ONLY FOR AUTHENTICATED USERS.',
      workflowName: 'Agent: Web Search',
      nodeId: 'tool-web-search-agent',
      position: [1240, 512],
    }),
    createAgentTool({
      name: 'marketing_director_agent',
      toolName: 'Marketing Director Agent Tool',
      description:
        'Delegate marketing strategy and research tasks. Use for: market research, competitor analysis, promotional strategies, content strategy. ONLY FOR AUTHENTICATED USERS.',
      workflowName: 'Agent: Marketing Director',
      nodeId: 'tool-marketing-director-agent',
      position: [1420, 512],
    }),
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
    'Web Search Agent Tool': {
      ai_tool: [[{ node: 'Chat Agent', type: 'ai_tool', index: 0 }]],
    },
    'Marketing Director Agent Tool': {
      ai_tool: [[{ node: 'Chat Agent', type: 'ai_tool', index: 0 }]],
    },
  },
})

export default [toolGraphqlRequest, agentWorkflow]
