import * as path from 'path'
import { createAgent } from '../agent-factory'
import {
  SESSION_ID_EXPRESSION,
  SESSION_ID_SCHEMA,
  USER_EXPRESSION,
  USER_SCHEMA,
} from '../helpers'

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
  model: 'anthropic/claude-opus-4.5',
  hasWorkflowOutput: true,
  canExecuteCode: isDevelopment,
  workflowInputs: [
    { name: 'chatInput', type: 'string' },
    { name: 'sessionId', type: 'string' },
    { name: 'user', type: 'object' },
  ],
  additionalNodes: [
    {
      parameters: {
        name: 'gitlab_agent',
        description:
          'Get actual project information from GitLab Agent. This is your PRIMARY source for real project state: issues, boards, project status. Use when: (1) you need current project state, (2) you need to check issues or tasks in GitLab, (3) you need to verify what work is in progress. GitLab Agent provides authoritative information about the project.',
        workflowId: {
          __rl: true,
          mode: 'list',
          value: 'Agent: GitLab',
        },
        workflowInputs: {
          mappingMode: 'defineBelow',
          value: {
            chatInput:
              "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('message', `Request to GitLab Agent`, 'string') }}",
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
      id: 'techlead-tool-gitlab-agent',
      name: 'GitLab Agent Tool',
      type: '@n8n/n8n-nodes-langchain.toolWorkflow',
      typeVersion: 2.2,
      position: [448, 512],
    },
  ],
  additionalConnections: {
    'GitLab Agent Tool': {
      ai_tool: [[{ node: AGENT_NAME, type: 'ai_tool', index: 0 }]],
    },
  },
})

export default [toolGraphqlRequest, agentWorkflow]
