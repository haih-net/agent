import * as path from 'path'
import { createAgent } from '../agent-factory'
import { createAgentTool } from '../helpers'

const AGENT_NAME = 'Tech Lead'
const isDevelopment = process.env.NODE_ENV === 'development'

const { toolGraphqlRequest, agentWorkflow } = createAgent({
  agentName: AGENT_NAME,
  agentDescription:
    'Tech Lead agent responsible for architectural decisions, code review, and technical mentorship.',
  agentId: 'techlead-agent',
  workflowName: 'Agent: Tech Lead',
  versionId: 'agent-techlead-v2',
  credentialId: 'freecode-agent-techlead-cred',
  credentialName: 'FreeCode API - agent-techlead',
  systemMessagePath: path.join(__dirname, 'system-message.md'),
  webhookId: 'agent-techlead-webhook',
  instanceId: 'narasim-dev-agent-techlead',
  model: process.env.AGENT_TECHLEAD_MODEL || 'anthropic/claude-opus-4.5',
  hasWorkflowOutput: true,
  canExecuteCode: isDevelopment,
  workflowInputs: [
    { name: 'chatInput', type: 'string' },
    { name: 'sessionId', type: 'string' },
    { name: 'user', type: 'object' },
  ],
  additionalNodes: [
    createAgentTool({
      name: 'gitlab_agent',
      toolName: 'GitLab Agent Tool',
      description:
        'Get actual project information from GitLab Agent. This is your PRIMARY source for real project state: issues, boards, project status. Use when: (1) you need current project state, (2) you need to check issues or tasks in GitLab, (3) you need to verify what work is in progress. GitLab Agent provides authoritative information about the project.',
      workflowName: 'Agent: GitLab',
      nodeId: 'techlead-tool-gitlab-agent',
      position: [448, 512],
    }),
  ],
  additionalConnections: {
    'GitLab Agent Tool': {
      ai_tool: [[{ node: AGENT_NAME, type: 'ai_tool', index: 0 }]],
    },
  },
})

export default [toolGraphqlRequest, agentWorkflow]
