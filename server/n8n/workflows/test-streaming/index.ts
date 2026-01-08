import { WorkflowBase } from '../interfaces'

type NodeType = WorkflowBase['nodes'][number]
type ConnectionsType = WorkflowBase['connections']

export interface TestStreamingConfig {
  workflowName: string
  versionId: string
  webhookId: string
  instanceId: string
}

export function createTestStreamingWorkflow(
  config: TestStreamingConfig,
): WorkflowBase {
  const { workflowName, versionId, webhookId, instanceId } = config

  const nodes: NodeType[] = [
    {
      parameters: {
        public: true,
        mode: 'webhook',
        options: {
          responseMode: 'streaming',
        },
      },
      type: '@n8n/n8n-nodes-langchain.chatTrigger',
      typeVersion: 1.4,
      position: [-400, 300],
      id: 'test-streaming-chat-trigger',
      name: 'Chat Trigger',
      webhookId,
    },
    {
      parameters: {
        jsCode: `
const chatInput = $input.first().json.chatInput;
const sessionId = $input.first().json.sessionId;

return [{
  json: {
    chatInput,
    sessionId,
    timestamp: new Date().toISOString(),
  }
}];
`,
      },
      id: 'test-streaming-prepare',
      name: 'Prepare Input',
      type: 'n8n-nodes-base.code',
      typeVersion: 2,
      position: [-200, 300],
    },
    {
      parameters: {
        messages:
          'Processing your request...\nAnalyzing data...\nGenerating response...',
        delay: 300,
        prefix: '🔄 ',
      },
      id: 'test-streaming-stream-test',
      name: 'Stream Test',
      type: 'n8n-nodes-freecode-custom.streamTest',
      typeVersion: 1,
      position: [0, 300],
    },
    {
      parameters: {
        options: {
          systemMessage: 'You are a helpful assistant. Respond briefly.',
          maxIterations: 5,
        },
      },
      id: 'test-streaming-agent',
      name: 'AI Agent',
      type: '@n8n/n8n-nodes-langchain.agent',
      typeVersion: 3.1,
      position: [200, 300],
    },
    {
      parameters: {
        model: 'anthropic/claude-sonnet-4',
        options: {},
      },
      id: 'test-streaming-chat-model',
      name: 'Chat Model',
      type: '@n8n/n8n-nodes-langchain.lmChatOpenRouter',
      typeVersion: 1,
      position: [100, 500],
      credentials: {
        openRouterApi: {
          id: 'FsN0N48lU327xkz6',
          name: 'OpenRouter',
        },
      },
    },
  ]

  const connections: ConnectionsType = {
    'Chat Trigger': {
      main: [[{ node: 'Prepare Input', type: 'main', index: 0 }]],
    },
    'Prepare Input': {
      main: [[{ node: 'Stream Test', type: 'main', index: 0 }]],
    },
    'Stream Test': {
      main: [[{ node: 'AI Agent', type: 'main', index: 0 }]],
    },
    'Chat Model': {
      ai_languageModel: [
        [{ node: 'AI Agent', type: 'ai_languageModel', index: 0 }],
      ],
    },
  }

  return {
    name: workflowName,
    active: true,
    versionId,
    nodes,
    connections,
    pinData: {},
    settings: {
      executionOrder: 'v1',
    },
    meta: {
      instanceId,
    },
  }
}
