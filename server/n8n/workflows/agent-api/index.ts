import * as fs from 'fs'
import * as path from 'path'
import { WorkflowBase } from '../interfaces'

const systemMessage = fs.readFileSync(
  path.join(__dirname, 'system-message.md'),
  'utf-8',
)

const workflow: WorkflowBase = {
  name: 'Agent: API',
  active: true,
  versionId: 'agent-api-v3',
  nodes: [
    {
      parameters: {
        options: {
          systemMessage,
          maxIterations: 50,
        },
      },
      id: 'api-agent',
      name: 'API Agent',
      type: '@n8n/n8n-nodes-langchain.agent',
      typeVersion: 1.7,
      position: [224, 304],
    },
    {
      parameters: {
        // model: 'anthropic/claude-opus-4.5',
        model: 'anthropic/claude-sonnet-4',
        options: {},
      },
      id: 'api-chat-model',
      name: 'Sonnet 4.5 Chat Model',
      type: '@n8n/n8n-nodes-langchain.lmChatOpenRouter',
      typeVersion: 1,
      position: [64, 512],
      credentials: {
        openRouterApi: {
          id: 'FsN0N48lU327xkz6',
          name: 'OpenRouter',
        },
      },
    },
    {
      parameters: {
        name: 'graphql_request',
        description: 'Execute a GraphQL query or mutation against the API.',
        workflowId: {
          __rl: true,
          mode: 'list',
          value: 'Tool: GraphQL Request',
        },
        workflowInputs: {
          mappingMode: 'defineBelow',
          value: {
            query:
              "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('query', `Required! GraphQL query or mutation string`, 'string') }}",
            variables:
              "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('variables', `Variables object for the query, use {} if no variables needed`, 'string') }}",
          },
          matchingColumns: ['query'],
          schema: [
            {
              id: 'query',
              displayName: 'query',
              required: false,
              defaultMatch: false,
              display: true,
              canBeUsedToMatch: true,
              type: 'string',
              removed: false,
            },
            {
              id: 'variables',
              displayName: 'variables',
              required: false,
              defaultMatch: false,
              display: true,
              canBeUsedToMatch: true,
              removed: false,
            },
          ],
          attemptToConvertTypes: false,
          convertFieldsToString: false,
        },
      },
      id: 'tool-graphql-request',
      name: 'GraphQL Request Tool',
      type: '@n8n/n8n-nodes-langchain.toolWorkflow',
      typeVersion: 2.2,
      position: [224, 512],
    },
    {
      parameters: {
        name: 'list_gql_files',
        description:
          'List available generated GraphQL TypeScript files in src/gql/generated/ directory. No parameters needed.',
        workflowId: {
          __rl: true,
          mode: 'list',
          value: 'Tool: List Files',
        },
        workflowInputs: {
          mappingMode: 'defineBelow',
          value: {
            path: 'src/gql/generated',
          },
          matchingColumns: [],
          schema: [
            {
              id: 'path',
              displayName: 'path',
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
      id: 'tool-list-gql-files',
      name: 'List GQL Files',
      type: '@n8n/n8n-nodes-langchain.toolWorkflow',
      typeVersion: 2.2,
      position: [384, 512],
    },
    {
      parameters: {
        name: 'read_gql_file',
        description:
          "Read a specific file from src/gql/generated/ directory. Pass only filename like 'types.ts' or 'schema.json'.",
        workflowId: {
          __rl: true,
          mode: 'list',
          value: 'Tool: Read File',
        },
        workflowInputs: {
          mappingMode: 'defineBelow',
          value: {
            path: "={{ 'src/gql/generated/' + $fromAI('filename', `Filename to read, e.g. 'types.ts'`, 'string') }}",
          },
          matchingColumns: [],
          schema: [
            {
              id: 'path',
              displayName: 'path',
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
      id: 'tool-read-gql-file',
      name: 'Read GQL File',
      type: '@n8n/n8n-nodes-langchain.toolWorkflow',
      typeVersion: 2.2,
      position: [544, 512],
    },
    {
      parameters: {
        inputSource: 'passthrough',
      },
      id: 'api-workflow-trigger',
      name: 'Execute Workflow Trigger',
      type: 'n8n-nodes-base.executeWorkflowTrigger',
      typeVersion: 1.1,
      position: [-200, 304],
    },
    {
      parameters: {
        mode: 'manual',
        duplicateItem: false,
        assignments: {
          assignments: [
            {
              id: 'output',
              name: 'output',
              value: '={{ $json.output }}',
              type: 'string',
            },
          ],
        },
        options: {},
      },
      id: 'api-workflow-output',
      name: 'Workflow Output',
      type: 'n8n-nodes-base.set',
      typeVersion: 3.4,
      position: [608, 304],
    },
    {
      parameters: {
        options: {},
      },
      type: '@n8n/n8n-nodes-langchain.chatTrigger',
      typeVersion: 1.4,
      position: [-200, 592],
      id: 'chat-trigger',
      name: 'When chat message received',
      webhookId: 'agent-api-chat',
    },
  ],
  connections: {
    'API Agent': {
      main: [[{ node: 'Workflow Output', type: 'main', index: 0 }]],
    },
    'Sonnet 4.5 Chat Model': {
      ai_languageModel: [
        [{ node: 'API Agent', type: 'ai_languageModel', index: 0 }],
      ],
    },
    'GraphQL Request Tool': {
      ai_tool: [[{ node: 'API Agent', type: 'ai_tool', index: 0 }]],
    },
    'List GQL Files': {
      ai_tool: [[{ node: 'API Agent', type: 'ai_tool', index: 0 }]],
    },
    'Read GQL File': {
      ai_tool: [[{ node: 'API Agent', type: 'ai_tool', index: 0 }]],
    },
    'Execute Workflow Trigger': {
      main: [[{ node: 'API Agent', type: 'main', index: 0 }]],
    },
    'When chat message received': {
      main: [[{ node: 'API Agent', type: 'main', index: 0 }]],
    },
  },
  pinData: {},
  settings: {
    executionOrder: 'v1',
  },
  meta: {
    instanceId: 'narasim-dev-api',
  },
}

export default workflow
