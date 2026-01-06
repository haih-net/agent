import * as path from 'path'
import { createAgent } from '../agent-factory'

const AGENT_NAME = 'Chat Agent'

const { toolGraphqlRequest, agentWorkflow } = createAgent({
  agentName: AGENT_NAME,
  agentDescription:
    'Main chat agent (secretary) for user interactions. Delegates specialized tasks to other agents.',
  agentId: 'chat-agent',
  workflowName: 'Agent: Chat',
  versionId: 'agent-chat-v3',
  credentialId: 'freecode-agent-chat-cred',
  credentialName: 'FreeCode API - agent-chat',
  systemMessagePath: path.join(__dirname, 'system-message.md'),
  webhookId: 'agent-chat-webhook',
  instanceId: 'narasim-dev-agent-chat',
  hasWorkflowOutput: false,
  workflowInputs: [
    { name: 'chatInput', type: 'string' },
    { name: 'sessionId', type: 'string' },
    { name: 'user', type: 'object' },
  ],
  additionalNodes: [
    {
      parameters: {
        name: 'api_agent',
        description:
          'Delegate API tasks to the API Agent — a specialized agent with deep knowledge of the GraphQL schema and API structure. Use when: (1) you need to fetch data but unsure which query to use, (2) you want the API Agent to construct complex queries for you, (3) you need help understanding available API operations. The API Agent executes requests on ITS OWN behalf (not yours). You can also ask it to explain how to construct a query if you want to execute it yourself via graphql_request.',
        workflowId: {
          __rl: true,
          mode: 'list',
          value: 'Agent: API',
        },
        workflowInputs: {
          mappingMode: 'defineBelow',
          value: {
            chatInput:
              "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('request', `Describe what you need: data to fetch, query to construct, or API operation to understand. The API Agent will help.`, 'string') }}",
          },
          matchingColumns: [],
          schema: [
            {
              id: 'chatInput',
              displayName: 'request',
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
      id: 'tool-api-agent',
      name: 'API Agent Tool',
      type: '@n8n/n8n-nodes-langchain.toolWorkflow',
      typeVersion: 2.2,
      position: [448, 512],
    },
    {
      parameters: {
        name: 'project_manager_agent',
        description:
          'Delegate project and task management to the Project Manager Agent — a specialized agent for managing projects, tasks, team members, and tracking progress. Use when: (1) user asks about projects or tasks, (2) need to create/update/list projects or tasks, (3) need to manage team assignments, (4) need project status reports. The Project Manager Agent executes requests on ITS OWN behalf.',
        workflowId: {
          __rl: true,
          mode: 'list',
          value: 'Agent: Project Manager',
        },
        workflowInputs: {
          mappingMode: 'defineBelow',
          value: {
            chatInput:
              "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('request', `Describe the project/task operation: list projects, create task, update status, assign members, etc.`, 'string') }}",
            user: '={{ $json.user }}',
          },
          matchingColumns: [],
          schema: [
            {
              id: 'chatInput',
              displayName: 'request',
              required: true,
              defaultMatch: false,
              display: true,
              canBeUsedToMatch: true,
              type: 'string',
            },
            {
              id: 'user',
              displayName: 'user',
              required: false,
              defaultMatch: false,
              display: true,
              canBeUsedToMatch: true,
              type: 'object',
            },
          ],
          attemptToConvertTypes: false,
          convertFieldsToString: false,
        },
      },
      id: 'tool-project-manager-agent',
      name: 'Project Manager Agent Tool',
      type: '@n8n/n8n-nodes-langchain.toolWorkflow',
      typeVersion: 2.2,
      position: [448, 672],
    },
    {
      parameters: {
        name: 'pr_manager_agent',
        description:
          'Delegate content/publication management to the PR Manager Agent — a specialized agent for managing topics, articles, and publications. Use when: (1) user asks about topics, articles, or publications, (2) need to create/update/list content, (3) need to manage blog posts or educational materials. The PR Manager Agent executes requests on ITS OWN behalf.',
        workflowId: {
          __rl: true,
          mode: 'list',
          value: 'Agent: PR Manager',
        },
        workflowInputs: {
          mappingMode: 'defineBelow',
          value: {
            chatInput:
              "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('request', `Describe the content operation: list topics, create article, update publication, etc.`, 'string') }}",
            user: '={{ $json.user }}',
          },
          matchingColumns: [],
          schema: [
            {
              id: 'chatInput',
              displayName: 'request',
              required: true,
              defaultMatch: false,
              display: true,
              canBeUsedToMatch: true,
              type: 'string',
            },
            {
              id: 'user',
              displayName: 'user',
              required: false,
              defaultMatch: false,
              display: true,
              canBeUsedToMatch: true,
              type: 'object',
            },
          ],
          attemptToConvertTypes: false,
          convertFieldsToString: false,
        },
      },
      id: 'tool-pr-manager-agent',
      name: 'PR Manager Agent Tool',
      type: '@n8n/n8n-nodes-langchain.toolWorkflow',
      typeVersion: 2.2,
      position: [448, 832],
    },
  ],
  additionalConnections: {
    'API Agent Tool': {
      ai_tool: [[{ node: AGENT_NAME, type: 'ai_tool', index: 0 }]],
    },
    'Project Manager Agent Tool': {
      ai_tool: [[{ node: AGENT_NAME, type: 'ai_tool', index: 0 }]],
    },
    'PR Manager Agent Tool': {
      ai_tool: [[{ node: AGENT_NAME, type: 'ai_tool', index: 0 }]],
    },
  },
})

export default [toolGraphqlRequest, agentWorkflow]
