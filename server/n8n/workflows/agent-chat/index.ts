import * as fs from 'fs'
import * as path from 'path'
import { WorkflowBase } from '../interfaces'

const systemMessage = fs.readFileSync(
  path.join(__dirname, 'system-message.md'),
  'utf-8',
)

const workflow: WorkflowBase = {
  name: 'Agent: Chat',
  active: true,
  versionId: 'agent-chat-v2',
  nodes: [
    {
      parameters: {
        options: {
          systemMessage,
          maxIterations: 50,
        },
      },
      id: 'ai-agent',
      name: 'AI Agent',
      type: '@n8n/n8n-nodes-langchain.agent',
      typeVersion: 1.7,
      position: [224, 304],
    },
    {
      parameters: {
        model: 'anthropic/claude-sonnet-4',
        options: {},
      },
      id: 'chat-model',
      name: 'OpenRouter Chat Model',
      type: '@n8n/n8n-nodes-langchain.lmChatOpenRouter',
      typeVersion: 1,
      position: [224, 512],
      credentials: {
        openRouterApi: {
          id: 'FsN0N48lU327xkz6',
          name: 'OpenRouter',
        },
      },
    },
    {
      parameters: {
        sessionIdType: 'customKey',
        sessionKey: '={{ $json.sessionId }}',
        contextWindowLength: 10,
      },
      id: 'simple-memory',
      name: 'Simple Memory',
      type: '@n8n/n8n-nodes-langchain.memoryBufferWindow',
      typeVersion: 1.3,
      position: [64, 512],
    },
    {
      parameters: {
        name: 'api_agent',
        description:
          'Execute GraphQL queries against the platform API. Use this to fetch real data about users, content, etc. Pass a valid GraphQL query string.',
        workflowId: {
          __rl: true,
          mode: 'list',
          value: 'Agent: API',
        },
        workflowInputs: {
          mappingMode: 'defineBelow',
          value: {
            chatInput:
              "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('request', `Describe what data you need from the API. The API agent will construct and execute the appropriate GraphQL query.`, 'string') }}",
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
      position: [384, 512],
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
      id: 'tool-create-mindlog',
      name: 'Create MindLog Tool',
      type: '@n8n/n8n-nodes-langchain.toolWorkflow',
      typeVersion: 2.2,
      position: [544, 512],
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
      position: [704, 512],
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
      position: [864, 512],
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
      position: [1024, 512],
    },
    {
      parameters: {
        options: {},
      },
      type: '@n8n/n8n-nodes-langchain.chatTrigger',
      typeVersion: 1.4,
      position: [-64, 592],
      id: 'chat-trigger',
      name: 'When chat message received',
      webhookId: 'agent-chat-webhook',
    },
    {
      parameters: {
        workflowInputs: {
          values: [
            {
              name: 'chatInput',
              type: 'string',
            },
            {
              name: 'sessionId',
              type: 'string',
            },
          ],
        },
      },
      id: 'execute-workflow-trigger',
      name: 'Execute Workflow Trigger',
      type: 'n8n-nodes-base.executeWorkflowTrigger',
      typeVersion: 1.1,
      position: [-200, 500],
    },
  ],
  connections: {
    'AI Agent': {
      main: [],
    },
    'OpenRouter Chat Model': {
      ai_languageModel: [
        [
          {
            node: 'AI Agent',
            type: 'ai_languageModel',
            index: 0,
          },
        ],
      ],
    },
    'Simple Memory': {
      ai_memory: [
        [
          {
            node: 'AI Agent',
            type: 'ai_memory',
            index: 0,
          },
        ],
      ],
    },
    'API Agent Tool': {
      ai_tool: [
        [
          {
            node: 'AI Agent',
            type: 'ai_tool',
            index: 0,
          },
        ],
      ],
    },
    'Create MindLog Tool': {
      ai_tool: [
        [
          {
            node: 'AI Agent',
            type: 'ai_tool',
            index: 0,
          },
        ],
      ],
    },
    'Search MindLogs Tool': {
      ai_tool: [
        [
          {
            node: 'AI Agent',
            type: 'ai_tool',
            index: 0,
          },
        ],
      ],
    },
    'Update MindLog Tool': {
      ai_tool: [
        [
          {
            node: 'AI Agent',
            type: 'ai_tool',
            index: 0,
          },
        ],
      ],
    },
    'Delete MindLog Tool': {
      ai_tool: [
        [
          {
            node: 'AI Agent',
            type: 'ai_tool',
            index: 0,
          },
        ],
      ],
    },
    'When chat message received': {
      main: [
        [
          {
            node: 'AI Agent',
            type: 'main',
            index: 0,
          },
        ],
      ],
    },
    'Execute Workflow Trigger': {
      main: [
        [
          {
            node: 'AI Agent',
            type: 'main',
            index: 0,
          },
        ],
      ],
    },
  },
  pinData: {},
  settings: {
    executionOrder: 'v1',
  },
  meta: {
    instanceId: 'narasim-dev-agent-chat',
  },
}

export default workflow
