import * as path from 'path'
import { createAgent } from '../agent-factory'

const AGENT_NAME = 'Chat Agent'

const { toolGraphqlRequest, agentWorkflow } = createAgent({
  agentName: AGENT_NAME,
  agentDescription:
    'Main chat agent (secretary) for user interactions. Delegates specialized tasks to other agents.',
  agentId: 'chat-agent',
  workflowName: 'Agent: Chat',
  versionId: 'agent-chat-v2',
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
    {
      parameters: {
        workflowId: {
          __rl: true,
          mode: 'list',
          value: 'MindLog: Create',
        },
        workflowInputs: {
          mappingMode: 'defineBelow',
          value: {
            type: "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('type', `Mindlog type: Stimulus, Reaction, Action, Error, Result, Conclusion, Evaluation, Correction, Knowledge`, 'string') }}",
            data: "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('data', `Content of the mindlog`, 'string') }}",
            quality:
              "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('quality', `Quality score 0-10 (optional)`, 'number') }}",
          },
          matchingColumns: [],
          schema: [
            {
              id: 'type',
              displayName: 'type',
              required: true,
              defaultMatch: false,
              display: true,
              canBeUsedToMatch: true,
              type: 'string',
            },
            {
              id: 'data',
              displayName: 'data',
              required: true,
              defaultMatch: false,
              display: true,
              canBeUsedToMatch: true,
              type: 'string',
            },
            {
              id: 'quality',
              displayName: 'quality',
              required: false,
              defaultMatch: false,
              display: true,
              canBeUsedToMatch: true,
              type: 'number',
            },
          ],
          attemptToConvertTypes: false,
          convertFieldsToString: false,
        },
      },
      id: 'tool-create-mindlog',
      name: 'Create MindLog Tool',
      type: '@n8n/n8n-nodes-langchain.toolWorkflow',
      typeVersion: 2.2,
      position: [672, 512],
    },
    {
      parameters: {
        workflowId: {
          __rl: true,
          mode: 'list',
          value: 'MindLog: Search',
        },
        workflowInputs: {
          mappingMode: 'defineBelow',
          value: {
            type: "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('type', `Filter by type: Knowledge, Stimulus, Reaction, Action, Result, Conclusion, Evaluation, Correction, Error. Use Knowledge to retrieve stored facts.`, 'string') }}",
            days: "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('days', `Number of days to look back (optional, omit for all time)`, 'number') }}",
            limit:
              "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('limit', `Max results (default 50)`, 'number') }}",
          },
          matchingColumns: [],
          schema: [
            {
              id: 'type',
              displayName: 'type',
              required: false,
              defaultMatch: false,
              display: true,
              canBeUsedToMatch: true,
              type: 'string',
            },
            {
              id: 'days',
              displayName: 'days',
              required: false,
              defaultMatch: false,
              display: true,
              canBeUsedToMatch: true,
              type: 'number',
            },
            {
              id: 'limit',
              displayName: 'limit',
              required: false,
              defaultMatch: false,
              display: true,
              canBeUsedToMatch: true,
              type: 'number',
            },
          ],
          attemptToConvertTypes: false,
          convertFieldsToString: false,
        },
      },
      id: 'tool-search-mindlogs',
      name: 'Search MindLogs Tool',
      type: '@n8n/n8n-nodes-langchain.toolWorkflow',
      typeVersion: 2.2,
      position: [896, 512],
    },
    {
      parameters: {
        workflowId: {
          __rl: true,
          mode: 'list',
          value: 'MindLog: Update',
        },
        workflowInputs: {
          mappingMode: 'defineBelow',
          value: {
            id: "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('id', `Mindlog ID to update`, 'string') }}",
            data: "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('data', `New content`, 'string') }}",
            quality:
              "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('quality', `New quality score (optional)`, 'number') }}",
          },
          matchingColumns: [],
          schema: [
            {
              id: 'id',
              displayName: 'id',
              required: false,
              defaultMatch: false,
              display: true,
              canBeUsedToMatch: true,
              type: 'string',
            },
            {
              id: 'data',
              displayName: 'data',
              required: false,
              defaultMatch: false,
              display: true,
              canBeUsedToMatch: true,
              type: 'string',
            },
            {
              id: 'quality',
              displayName: 'quality',
              required: false,
              defaultMatch: false,
              display: true,
              canBeUsedToMatch: true,
              type: 'number',
            },
          ],
          attemptToConvertTypes: false,
          convertFieldsToString: false,
        },
      },
      id: 'tool-update-mindlog',
      name: 'Update MindLog Tool',
      type: '@n8n/n8n-nodes-langchain.toolWorkflow',
      typeVersion: 2.2,
      position: [1120, 512],
    },
    {
      parameters: {
        workflowId: {
          __rl: true,
          mode: 'list',
          value: 'MindLog: Delete',
        },
        workflowInputs: {
          mappingMode: 'defineBelow',
          value: {
            id: "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('id', `Mindlog ID to delete`, 'string') }}",
          },
          matchingColumns: [],
          schema: [
            {
              id: 'id',
              displayName: 'id',
              required: false,
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
      id: 'tool-delete-mindlog',
      name: 'Delete MindLog Tool',
      type: '@n8n/n8n-nodes-langchain.toolWorkflow',
      typeVersion: 2.2,
      position: [1344, 512],
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
    'Create MindLog Tool': {
      ai_tool: [[{ node: AGENT_NAME, type: 'ai_tool', index: 0 }]],
    },
    'Search MindLogs Tool': {
      ai_tool: [[{ node: AGENT_NAME, type: 'ai_tool', index: 0 }]],
    },
    'Update MindLog Tool': {
      ai_tool: [[{ node: AGENT_NAME, type: 'ai_tool', index: 0 }]],
    },
    'Delete MindLog Tool': {
      ai_tool: [[{ node: AGENT_NAME, type: 'ai_tool', index: 0 }]],
    },
  },
})

export default [toolGraphqlRequest, agentWorkflow]
