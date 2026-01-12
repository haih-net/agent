import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
} from 'n8n-workflow'

export class StreamTest implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Stream Test',
    name: 'streamTest',
    icon: 'fa:stream',
    group: ['transform'],
    version: 1,
    description: 'Test node for streaming messages to chat',
    defaults: {
      name: 'Stream Test',
    },
    inputs: ['main'],
    outputs: ['main'],
    properties: [
      {
        displayName: 'Messages',
        name: 'messages',
        type: 'string',
        default: 'Message 1\nMessage 2\nMessage 3',
        description: 'Messages to stream (one per line)',
        typeOptions: {
          rows: 4,
        },
      },
      {
        displayName: 'Delay Between Messages (ms)',
        name: 'delay',
        type: 'number',
        default: 500,
        description: 'Delay between streaming each message',
      },
      {
        displayName: 'Prefix',
        name: 'prefix',
        type: 'string',
        default: '[StreamTest] ',
        description: 'Prefix to add before each message',
      },
    ],
  }

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData()
    const messages = this.getNodeParameter('messages', 0, '') as string
    const delay = this.getNodeParameter('delay', 0, 500) as number
    const prefix = this.getNodeParameter('prefix', 0, '[StreamTest] ') as string

    const messageList = messages.split('\n').filter((m) => m.trim())

    const isStreamingAvailable =
      typeof (this as unknown as { isStreaming?: () => boolean })
        .isStreaming === 'function' &&
      (this as unknown as { isStreaming: () => boolean }).isStreaming()

    if (isStreamingAvailable) {
      ;(
        this as unknown as {
          sendChunk: (type: string, index: number, content?: string) => void
        }
      ).sendChunk('begin', 0)

      for (const msg of messageList) {
        const fullMessage = prefix + msg
        ;(
          this as unknown as {
            sendChunk: (type: string, index: number, content?: string) => void
          }
        ).sendChunk('item', 0, fullMessage + '\n')

        if (delay > 0) {
          await new Promise((resolve) => setTimeout(resolve, delay))
        }
      }

      ;(
        this as unknown as {
          sendChunk: (type: string, index: number, content?: string) => void
        }
      ).sendChunk('end', 0)
    }

    const outputData = items.map((item) => ({
      json: {
        ...item.json,
        streamTest: {
          messagesCount: messageList.length,
          streamingAvailable: isStreamingAvailable,
          messages: messageList.map((m) => prefix + m),
        },
      },
    }))

    return [outputData]
  }
}
