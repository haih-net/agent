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
  model: 'anthropic/claude-opus-4.5',
  hasWorkflowOutput: true,
  authFromToken: true,
  hasGraphqlTool: false,
  agentNodeType: 'orchestrator',
  additionalNodes: [
    createAgentTool({
      name: 'api_agent',
      toolName: 'API Agent Tool',
      description:
        'Delegate API tasks to the API Agent — LAST RESORT. Use only for API schema questions or when specialized agents cannot help.',
      workflowName: 'Agent: API',
      nodeId: 'tool-api-agent',
      position: [448, 512],
      includeUser: false,
    }),
    createAgentTool({
      name: 'project_manager_agent',
      toolName: 'Project Manager Agent Tool',
      description:
        'Delegate project and task management. Use for: projects, tasks, team, progress tracking.',
      workflowName: 'Agent: Project Manager',
      nodeId: 'tool-project-manager-agent',
      position: [448, 672],
    }),
    createAgentTool({
      name: 'pr_manager_agent',
      toolName: 'PR Manager Agent Tool',
      description:
        'Delegate content/publication management. Use for: topics, articles, publications, blog posts.',
      workflowName: 'Agent: PR Manager',
      nodeId: 'tool-pr-manager-agent',
      position: [448, 832],
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
  },
})

export default [toolGraphqlRequest, agentWorkflow]
