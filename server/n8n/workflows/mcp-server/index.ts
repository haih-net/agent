import { WorkflowBase } from '../interfaces'

const toolSendMessage: WorkflowBase = {
  name: 'Tool: Send Message (MCP)',
  active: true,
  versionId: 'tool-send-message-mcp-v1',
  nodes: [
    {
      parameters: {
        workflowInputs: {
          values: [
            {
              name: 'message',
              type: 'string',
            },
            {
              name: 'sessionId',
              type: 'string',
            },
            {
              name: 'token',
              type: 'string',
            },
          ],
        },
      },
      id: 'workflow-trigger',
      name: 'Execute Workflow Trigger',
      type: 'n8n-nodes-base.executeWorkflowTrigger',
      typeVersion: 1.1,
      position: [0, 200],
    },
    {
      parameters: {
        conditions: {
          options: {
            caseSensitive: true,
            leftValue: '',
            typeValidation: 'strict',
          },
          conditions: [
            {
              id: 'token-exists',
              leftValue: '={{ $json.token }}',
              rightValue: '',
              operator: {
                type: 'string',
                operation: 'notEmpty',
              },
            },
          ],
          combinator: 'and',
        },
        options: {},
      },
      id: 'check-token',
      name: 'Has Token?',
      type: 'n8n-nodes-base.if',
      typeVersion: 2.2,
      position: [200, 200],
    },
    {
      parameters: {
        workflowId: {
          __rl: true,
          mode: 'name',
          value: 'Tool: Get User Data',
        },
        workflowInputs: {
          mappingMode: 'defineBelow',
          value: {
            token: '={{ $json.token }}',
          },
          matchingColumns: [],
          schema: [
            {
              id: 'token',
              displayName: 'token',
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
      id: 'get-user-data',
      name: 'Get User Data',
      type: 'n8n-nodes-base.executeWorkflow',
      typeVersion: 1.2,
      position: [400, 100],
    },
    {
      parameters: {
        mode: 'manual',
        duplicateItem: false,
        assignments: {
          assignments: [
            {
              id: 'user',
              name: 'user',
              value: '={{ $json.data?.me || null }}',
              type: 'object',
            },
            {
              id: 'message',
              name: 'message',
              value: '={{ $("Execute Workflow Trigger").item.json.message }}',
              type: 'string',
            },
            {
              id: 'sessionId',
              name: 'sessionId',
              value: '={{ $("Execute Workflow Trigger").item.json.sessionId }}',
              type: 'string',
            },
          ],
        },
        options: {},
      },
      id: 'set-user',
      name: 'Set User',
      type: 'n8n-nodes-base.set',
      typeVersion: 3.4,
      position: [600, 100],
    },
    {
      parameters: {
        mode: 'manual',
        duplicateItem: false,
        assignments: {
          assignments: [
            {
              id: 'user',
              name: 'user',
              value: '={{ null }}',
              type: 'object',
            },
            {
              id: 'message',
              name: 'message',
              value: '={{ $json.message }}',
              type: 'string',
            },
            {
              id: 'sessionId',
              name: 'sessionId',
              value: '={{ $json.sessionId }}',
              type: 'string',
            },
          ],
        },
        options: {},
      },
      id: 'set-no-user',
      name: 'Set No User',
      type: 'n8n-nodes-base.set',
      typeVersion: 3.4,
      position: [400, 300],
    },
    {
      parameters: {
        workflowId: {
          __rl: true,
          mode: 'name',
          value: 'Agent: Chat',
        },
        workflowInputs: {
          mappingMode: 'defineBelow',
          value: {
            chatInput: '={{ $json.message }}',
            sessionId: '=mcp_{{ $json.sessionId }}',
            user: '={{ $json.user }}',
          },
          matchingColumns: [],
          schema: [
            {
              id: 'chatInput',
              displayName: 'chatInput',
              required: true,
              defaultMatch: false,
              display: true,
              canBeUsedToMatch: true,
              type: 'string',
            },
            {
              id: 'sessionId',
              displayName: 'sessionId',
              required: false,
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
      id: 'call-chat-agent',
      name: 'Call Chat Agent',
      type: 'n8n-nodes-base.executeWorkflow',
      typeVersion: 1.2,
      position: [800, 200],
    },
  ],
  connections: {
    'Execute Workflow Trigger': {
      main: [[{ node: 'Has Token?', type: 'main', index: 0 }]],
    },
    'Has Token?': {
      main: [
        [{ node: 'Get User Data', type: 'main', index: 0 }],
        [{ node: 'Set No User', type: 'main', index: 0 }],
      ],
    },
    'Get User Data': {
      main: [[{ node: 'Set User', type: 'main', index: 0 }]],
    },
    'Set User': {
      main: [[{ node: 'Call Chat Agent', type: 'main', index: 0 }]],
    },
    'Set No User': {
      main: [[{ node: 'Call Chat Agent', type: 'main', index: 0 }]],
    },
  },
  pinData: {},
  settings: {
    executionOrder: 'v1',
  },
  meta: {
    instanceId: 'narasim-dev-tool-send-message-mcp',
  },
}

const mcpServerWorkflow: WorkflowBase = {
  name: 'MCP Server',
  active: true,
  versionId: 'mcp-server-v6',
  nodes: [
    {
      parameters: {
        path: 'mcp',
        options: {
          authentication: 'headerAuth',
        },
      },
      id: 'mcp-trigger',
      name: 'MCP Trigger',
      type: '@n8n/n8n-nodes-langchain.mcpTrigger',
      typeVersion: 2,
      position: [368, 96],
      webhookId: 'mcp-server-webhook',
    },
    {
      parameters: {
        name: 'send_message',
        description: 'Send a message to the AI agent for assistance',
        workflowId: {
          __rl: true,
          mode: 'name',
          value: 'Tool: Send Message (MCP)',
        },
        workflowInputs: {
          mappingMode: 'defineBelow',
          value: {
            message:
              "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('message', 'The message to send to the AI agent', 'string') }}",
            sessionId:
              "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('sessionId', 'The session ID for maintaining conversation context', 'string') }}",
            token:
              "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('token', 'JWT authentication token (or empty string)', 'string') }}",
          },
          matchingColumns: [],
          schema: [
            {
              id: 'message',
              displayName: 'message',
              required: true,
              defaultMatch: false,
              display: true,
              canBeUsedToMatch: true,
              type: 'string',
            },
            {
              id: 'sessionId',
              displayName: 'sessionId',
              required: false,
              defaultMatch: false,
              display: true,
              canBeUsedToMatch: true,
              type: 'string',
            },
            {
              id: 'token',
              displayName: 'token',
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
      id: 'tool-send-message',
      name: 'Send Message',
      type: '@n8n/n8n-nodes-langchain.toolWorkflow',
      typeVersion: 2.2,
      position: [680, 200],
    },
  ],
  connections: {
    'Send Message': {
      ai_tool: [
        [
          {
            node: 'MCP Trigger',
            type: 'ai_tool',
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
  meta: {},
}

export default [toolSendMessage, mcpServerWorkflow]
