import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
} from 'n8n-workflow'
import { ExecuteContext } from '../../helpers'
import { executeValidatorMode } from './helpers/executeValidatorMode'
import { executeFullMode } from './helpers/executeFullMode'

export class AgentOrchestrator implements INodeType {
  // constructor() {
  //   throw new Error(`[DEBUG] AgentOrchestrator constructor! this keys: ${Object.keys(this).join(', ')}`)
  // }

  description: INodeTypeDescription = {
    displayName: 'Agent Orchestrator',
    name: 'agentOrchestrator',
    icon: 'fa:brain',
    iconColor: 'black',
    group: ['transform'],
    version: 1,
    description:
      'Custom agent orchestrator with multi-message support, streaming, and tool routing',
    defaults: {
      name: 'Agent Orchestrator',
      color: '#404040',
    },
    credentials: [
      {
        name: 'openRouterApi',
        required: true,
      },
    ],
    inputs: [
      'main',
      {
        type: 'ai_memory',
        displayName: 'Memory',
        required: false,
        maxConnections: 1,
      },
      {
        type: 'ai_tool',
        displayName: 'Tool',
        required: false,
      },
    ],
    outputs: ['main'],
    properties: [
      {
        displayName: 'Model',
        name: 'model',
        type: 'string',
        default: 'anthropic/claude-sonnet-4',
        description:
          'OpenRouter model name (e.g., anthropic/claude-sonnet-4, openai/gpt-4o)',
      },
      {
        displayName: 'Mode',
        name: 'mode',
        type: 'options',
        options: [
          {
            name: 'Full Agent',
            value: 'full',
            description: 'Standard agent with tool execution loop',
          },
          {
            name: 'Validator',
            value: 'validator',
            description:
              'Single LLM call, returns tool calls without execution',
          },
          {
            name: 'Nested',
            value: 'nested',
            description: 'Multi-agent orchestration with streaming',
          },
        ],
        default: 'full',
      },
      {
        displayName: 'Options',
        name: 'options',
        type: 'collection',
        default: {},
        placeholder: 'Add Option',
        options: [
          {
            displayName: 'System Message',
            name: 'systemMessage',
            type: 'string',
            default: '',
            typeOptions: {
              rows: 6,
            },
            description:
              'System message for the agent. Supports expressions like {{ $json.field }}',
          },
          {
            displayName: 'Max Iterations',
            name: 'maxIterations',
            type: 'number',
            default: 10,
            description: 'Maximum number of tool call iterations',
          },
          {
            displayName: 'Enable Streaming',
            name: 'enableStreaming',
            type: 'boolean',
            default: true,
          },
          {
            displayName: 'Show Tool Calls',
            name: 'showToolCalls',
            type: 'boolean',
            default: true,
            description: 'Stream tool call notifications to user',
          },
          {
            displayName: 'Tool Choice',
            name: 'toolChoice',
            type: 'options',
            options: [
              { name: 'Auto', value: 'auto' },
              { name: 'Required', value: 'required' },
              { name: 'None', value: 'none' },
            ],
            default: 'auto',
          },
          {
            displayName: 'Assistant Messages',
            name: 'assistantMessages',
            type: 'json',
            default: '[]',
            description:
              'Array of assistant messages for internal dialogue. Format: [{"role": "assistant", "content": "..."}]',
          },
        ],
      },
    ],
  }

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const ctx = this as unknown as ExecuteContext
    const items = ctx.getInputData()
    const mode = ctx.getNodeParameter('mode', 0, 'full') as string

    switch (mode) {
      case 'validator':
        return await executeValidatorMode(ctx, items)
      case 'nested':
        return await executeFullMode(ctx, items)
      default:
        return await executeFullMode(ctx, items)
    }
  }
}
