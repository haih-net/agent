import * as path from 'path'
import { createAgent } from '../agent-factory'
import {
  SESSION_ID_EXPRESSION,
  SESSION_ID_SCHEMA,
  USER_EXPRESSION,
  USER_SCHEMA,
} from '../helpers'

const AGENT_NAME = 'Project Manager Agent'

function createAgentTool(
  name: string,
  toolName: string,
  description: string,
  workflowName: string,
  nodeId: string,
  position: [number, number],
) {
  return {
    parameters: {
      name,
      description,
      workflowId: {
        __rl: true,
        mode: 'list',
        value: workflowName,
      },
      workflowInputs: {
        mappingMode: 'defineBelow',
        value: {
          chatInput: `={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('message', \`Message to send to ${toolName}\`, 'string') }}`,
          sessionId: SESSION_ID_EXPRESSION,
          user: USER_EXPRESSION,
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
          SESSION_ID_SCHEMA,
          USER_SCHEMA,
        ],
        attemptToConvertTypes: false,
        convertFieldsToString: false,
      },
    },
    id: nodeId,
    name: toolName,
    type: '@n8n/n8n-nodes-langchain.toolWorkflow',
    typeVersion: 2.2,
    position,
  }
}

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
  model: 'anthropic/claude-opus-4.5',
  workflowInputs: [
    { name: 'chatInput', type: 'string' },
    { name: 'sessionId', type: 'string' },
    { name: 'user', type: 'object' },
  ],
  additionalNodes: [
    createAgentTool(
      'chat_agent',
      'Chat Agent Tool',
      'Send a message to the Chat Agent for assistance with user communication or general questions.',
      'Agent: Chat',
      'tool-chat-agent',
      [448, 512],
    ),
    createAgentTool(
      'techlead_agent',
      'Tech Lead Tool',
      'Delegate technical tasks to the Tech Lead. The Tech Lead manages the development team (Senior, Middle, Junior developers and QA Engineer) and makes architectural decisions.',
      'Agent: Tech Lead',
      'tool-techlead-agent',
      [448, 672],
    ),
    createAgentTool(
      'senior_dev_agent',
      'Senior Developer Tool',
      'Delegate complex development tasks to the Senior Developer. Note: Senior Developer reports to Tech Lead.',
      'Agent: Senior Developer',
      'tool-senior-dev-agent',
      [448, 832],
    ),
    createAgentTool(
      'middle_dev_agent',
      'Middle Developer Tool',
      'Delegate development tasks to the Middle Developer. Note: Middle Developer reports to Tech Lead.',
      'Agent: Middle Developer',
      'tool-middle-dev-agent',
      [448, 992],
    ),
    createAgentTool(
      'junior_dev_agent',
      'Junior Developer Tool',
      'Delegate simple development tasks to the Junior Developer. Note: Junior Developer reports to Tech Lead.',
      'Agent: Junior Developer',
      'tool-junior-dev-agent',
      [448, 1152],
    ),
    createAgentTool(
      'qa_engineer_agent',
      'QA Engineer Tool',
      'Delegate testing and quality assurance tasks to the QA Engineer. Note: QA Engineer reports to Tech Lead.',
      'Agent: QA Engineer',
      'tool-qa-engineer-agent',
      [448, 1312],
    ),
    createAgentTool(
      'gitlab_agent',
      'GitLab Agent Tool',
      'Get actual project information from GitLab Agent. This is your PRIMARY source for real project state: issues, boards, project status. Use when: (1) you need current project state, (2) you need to check issues or tasks in GitLab, (3) you need to verify what work is in progress. GitLab Agent provides authoritative information about the project.',
      'Agent: GitLab',
      'tool-gitlab-agent',
      [448, 1472],
    ),
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
