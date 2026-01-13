import * as path from 'path'
import { createAgent } from '../agent-factory'
import { createTool, createStaticInputs } from '../helpers'

const AGENT_NAME = 'API Agent'
const agentId = 'api-agent'

const apiToolNodes = [
  createTool({
    name: 'list_gql_files',
    toolName: 'List GQL Files',
    description:
      'List available generated GraphQL TypeScript files in src/gql/generated/ directory. No parameters needed.',
    workflowName: 'Tool: List Files',
    nodeId: `${agentId}-tool-list-gql-files`,
    position: [448, 512],
    inputs: createStaticInputs([
      {
        name: 'path',
        value: 'src/gql/generated',
        type: 'string',
        required: true,
      },
    ]),
  }),
  createTool({
    name: 'read_gql_file',
    toolName: 'Read GQL File',
    description:
      "Read a specific file from src/gql/generated/ directory. Pass only filename like 'types.ts' or 'schema.json'.",
    workflowName: 'Tool: Read File',
    nodeId: `${agentId}-tool-read-gql-file`,
    position: [672, 512],
    inputs: createStaticInputs([
      {
        name: 'path',
        value:
          "={{ 'src/gql/generated/' + $fromAI('filename', `Filename to read, e.g. 'types.ts'`, 'string') }}",
        type: 'string',
        required: true,
      },
    ]),
  }),
]

const { toolGraphqlRequest, agentWorkflow } = createAgent({
  agentName: AGENT_NAME,
  agentDescription:
    'Specialized agent with deep knowledge of the GraphQL schema and API structure.',
  agentId,
  workflowName: 'Agent: API',
  versionId: 'agent-api-v3',
  credentialId: 'freecode-agent-api-cred',
  credentialName: 'FreeCode API - agent-api',
  systemMessagePath: path.join(__dirname, 'system-message.md'),
  webhookId: 'agent-api-chat',
  instanceId: 'narasim-dev-api',
  hasGraphqlTool: true,
  additionalNodes: apiToolNodes,
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
