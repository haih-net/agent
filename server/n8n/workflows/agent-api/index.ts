import * as path from 'path'
import { createAgent } from '../agent-factory'

const AGENT_NAME = 'API Agent'

const { toolGraphqlRequest, agentWorkflow } = createAgent({
  agentName: AGENT_NAME,
  agentDescription:
    'Specialized agent with deep knowledge of the GraphQL schema and API structure.',
  agentId: 'api-agent',
  workflowName: 'Agent: API',
  versionId: 'agent-api-v3',
  credentialId: 'freecode-agent-api-cred',
  credentialName: 'FreeCode API - agent-api',
  systemMessagePath: path.join(__dirname, 'system-message.md'),
  webhookId: 'agent-api-chat',
  instanceId: 'narasim-dev-api',
  hasGraphqlTool: true,
  additionalNodes: [
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
      position: [448, 512],
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
      position: [672, 512],
    },
  ],
  additionalConnections: {
    'List GQL Files': {
      ai_tool: [[{ node: AGENT_NAME, type: 'ai_tool', index: 0 }]],
    },
    'Read GQL File': {
      ai_tool: [[{ node: AGENT_NAME, type: 'ai_tool', index: 0 }]],
    },
  },
})

export default [toolGraphqlRequest, agentWorkflow]
