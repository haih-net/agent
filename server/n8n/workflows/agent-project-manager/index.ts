import * as path from 'path'
import { createAgent } from '../agent-factory'
import { createAgentTool } from '../helpers'

const AGENT_NAME = 'Project Manager Agent'

const { toolGraphqlRequest, agentWorkflow } = createAgent({
  agentName: AGENT_NAME,
  agentDescription:
    'Specialized agent for managing projects, tasks, team members, and tracking progress.',
  agentId: 'project-manager-agent',
  workflowName: 'Agent: Project Manager',
  versionId: 'agent-project-manager-v3',
  credentialId: 'freecode-agent-project-manager-cred',
  credentialName: 'FreeCode API - agent-project-manager',
  systemMessagePath: path.join(__dirname, 'system-message.md'),
  webhookId: 'agent-project-manager-chat',
  instanceId: 'narasim-dev-project-manager',
  model: process.env.AGENT_PROJECT_MANAGER_MODEL || 'anthropic/claude-opus-4.5',
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
        'Send a message to the Chat Agent for assistance with user communication or general questions.',
      workflowName: 'Agent: Chat',
      nodeId: 'tool-chat-agent',
      position: [448, 512],
    }),
    createAgentTool({
      name: 'techlead_agent',
      toolName: 'Tech Lead Tool',
      description:
        'Delegate technical tasks to the Tech Lead. The Tech Lead manages the development team (Senior, Middle, Junior developers and QA Engineer) and makes architectural decisions.',
      workflowName: 'Agent: Tech Lead',
      nodeId: 'tool-techlead-agent',
      position: [448, 672],
    }),
    createAgentTool({
      name: 'senior_dev_agent',
      toolName: 'Senior Developer Tool',
      description:
        'Delegate complex development tasks to the Senior Developer. Note: Senior Developer reports to Tech Lead.',
      workflowName: 'Agent: Senior Developer',
      nodeId: 'tool-senior-dev-agent',
      position: [448, 832],
    }),
    createAgentTool({
      name: 'middle_dev_agent',
      toolName: 'Middle Developer Tool',
      description:
        'Delegate development tasks to the Middle Developer. Note: Middle Developer reports to Tech Lead.',
      workflowName: 'Agent: Middle Developer',
      nodeId: 'tool-middle-dev-agent',
      position: [448, 992],
    }),
    createAgentTool({
      name: 'junior_dev_agent',
      toolName: 'Junior Developer Tool',
      description:
        'Delegate simple development tasks to the Junior Developer. Note: Junior Developer reports to Tech Lead.',
      workflowName: 'Agent: Junior Developer',
      nodeId: 'tool-junior-dev-agent',
      position: [448, 1152],
    }),
    createAgentTool({
      name: 'qa_engineer_agent',
      toolName: 'QA Engineer Tool',
      description:
        'Delegate testing and quality assurance tasks to the QA Engineer. Note: QA Engineer reports to Tech Lead.',
      workflowName: 'Agent: QA Engineer',
      nodeId: 'tool-qa-engineer-agent',
      position: [448, 1312],
    }),
    createAgentTool({
      name: 'gitlab_agent',
      toolName: 'GitLab Agent Tool',
      description:
        'Get actual project information from GitLab Agent. This is your PRIMARY source for real project state: issues, boards, project status. Use when: (1) you need current project state, (2) you need to check issues or tasks in GitLab, (3) you need to verify what work is in progress. GitLab Agent provides authoritative information about the project.',
      workflowName: 'Agent: GitLab',
      nodeId: 'tool-gitlab-agent',
      position: [448, 1472],
    }),
  ],
  additionalConnections: {
    'Chat Agent Tool': {
      ai_tool: [[{ node: AGENT_NAME, type: 'ai_tool', index: 0 }]],
    },
    'Tech Lead Tool': {
      ai_tool: [[{ node: AGENT_NAME, type: 'ai_tool', index: 0 }]],
    },
    'Senior Developer Tool': {
      ai_tool: [[{ node: AGENT_NAME, type: 'ai_tool', index: 0 }]],
    },
    'Middle Developer Tool': {
      ai_tool: [[{ node: AGENT_NAME, type: 'ai_tool', index: 0 }]],
    },
    'Junior Developer Tool': {
      ai_tool: [[{ node: AGENT_NAME, type: 'ai_tool', index: 0 }]],
    },
    'QA Engineer Tool': {
      ai_tool: [[{ node: AGENT_NAME, type: 'ai_tool', index: 0 }]],
    },
    'GitLab Agent Tool': {
      ai_tool: [[{ node: AGENT_NAME, type: 'ai_tool', index: 0 }]],
    },
  },
})

export default [toolGraphqlRequest, agentWorkflow]
