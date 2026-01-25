import { WorkflowBase } from '../interfaces'
import { getNodeCoordinates } from '../helpers/nodeCoordinates'

const workflow: WorkflowBase = {
  name: 'Telegram handler',
  active: true,
  versionId: 'telegram-handler-v1',
  nodes: [
    {
      parameters: {
        updates: ['message'],
        additionalFields: {},
      },
      type: 'n8n-nodes-base.telegramTrigger',
      typeVersion: 1.2,
      position: getNodeCoordinates('telegram-handler-trigger'),
      id: '84a7ea82-543a-4a47-8c73-29842967364e',
      name: 'Telegram Trigger',
      webhookId: 'bc85068c-cea5-4861-b59f-c23fb590e037',
      credentials: {
        telegramApi: {
          id: 'telegram-n8n_selfhost_dev_bot',
          name: 'n8n_selfhost_dev_bot',
        },
      },
    },
    {
      parameters: {
        workflowId: {
          __rl: true,
          value: 'Agent: Chat',
          mode: 'list',
        },
        workflowInputs: {
          mappingMode: 'defineBelow',
          value: {
            chatInput: '={{ $json.text }}',
            sessionId:
              "=telegram_{{ $('Telegram Trigger').item.json.message.from.id }}",
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
              required: true,
              defaultMatch: false,
              display: true,
              canBeUsedToMatch: true,
              type: 'string',
            },
          ],
          attemptToConvertTypes: false,
          convertFieldsToString: true,
        },
        options: {},
      },
      type: 'n8n-nodes-base.executeWorkflow',
      typeVersion: 1.3,
      position: getNodeCoordinates('telegram-handler-call-agent'),
      id: '8ee9f394-ef2c-4c25-be66-f1f82393c708',
      name: 'Call Agent Chat',
    },
    {
      parameters: {
        chatId: "={{ $('Telegram Trigger').item.json.message.chat.id }}",
        text: '={{ $json.output }}',
        additionalFields: {
          appendAttribution: false,
        },
      },
      type: 'n8n-nodes-base.telegram',
      typeVersion: 1.2,
      position: getNodeCoordinates('telegram-handler-send-message'),
      id: '3549918f-3af6-4a82-822e-70264fd9cce5',
      name: 'Send a text message',
      webhookId: '9386633b-3703-4064-b670-bfccb22fdd12',
      credentials: {
        telegramApi: {
          id: 'telegram-n8n_selfhost_dev_bot',
          name: 'n8n_selfhost_dev_bot',
        },
      },
    },
    {
      parameters: {
        resource: 'audio',
        operation: 'transcribe',
        options: {},
      },
      id: 'c4b6a446-3f29-4401-aeb6-09df50aef173',
      name: 'Speech to Text',
      type: '@n8n/n8n-nodes-langchain.openAi',
      position: getNodeCoordinates('telegram-handler-speech-to-text'),
      typeVersion: 1.3,
      credentials: {
        openAiApi: {
          id: 'openai-api',
          name: 'OpenAI',
        },
      },
    },
    {
      parameters: {
        fields: {
          values: [
            {
              name: 'text',
              stringValue: '={{ $json?.message?.text || "" }}',
            },
          ],
        },
        options: {},
      },
      id: 'b54fc250-e436-4c2b-93e1-369e56c6ae79',
      name: 'Voice or Text',
      type: 'n8n-nodes-base.set',
      position: getNodeCoordinates('telegram-handler-voice-or-text'),
      typeVersion: 3.2,
    },
    {
      parameters: {
        resource: 'file',
        fileId: "={{ $('Telegram Trigger').item.json.message.voice.file_id }}",
        additionalFields: {},
      },
      id: 'd6db8d3d-517c-4397-93fa-ed535cf309fa',
      name: 'Get Voice File',
      type: 'n8n-nodes-base.telegram',
      position: getNodeCoordinates('telegram-handler-get-voice'),
      webhookId: '24273e7e-6133-415e-8627-a9d6dc0f107c',
      typeVersion: 1.1,
      credentials: {
        telegramApi: {
          id: 'telegram-n8n_selfhost_dev_bot',
          name: 'n8n_selfhost_dev_bot',
        },
      },
    },
    {
      parameters: {
        content: '## Process Telegram Request\n',
        height: 359,
        width: 544,
        color: 5,
      },
      id: '6b5ee1a9-bddb-41da-987e-d76708d7e583',
      name: 'Sticky Note',
      type: 'n8n-nodes-base.stickyNote',
      position: getNodeCoordinates('telegram-handler-sticky-note'),
      typeVersion: 1,
    },
    {
      parameters: {
        conditions: {
          options: {
            version: 2,
            leftValue: '',
            caseSensitive: true,
            typeValidation: 'strict',
          },
          combinator: 'and',
          conditions: [
            {
              id: 'a0bf9719-4272-46f6-ab3b-eda6f7b44fd8',
              operator: {
                type: 'string',
                operation: 'empty',
                singleValue: true,
              },
              leftValue: '={{ $json.message.text }}',
              rightValue: '',
            },
          ],
        },
        options: {},
      },
      id: '4f0f7bc5-a077-4645-aeec-44948fbd116a',
      name: 'If1',
      type: 'n8n-nodes-base.if',
      position: getNodeCoordinates('telegram-handler-if'),
      typeVersion: 2.2,
    },
  ],
  connections: {
    'Telegram Trigger': {
      main: [[{ node: 'Voice or Text', type: 'main', index: 0 }]],
    },
    'Call Agent Chat': {
      main: [[{ node: 'Send a text message', type: 'main', index: 0 }]],
    },
    'Speech to Text': {
      main: [[{ node: 'Call Agent Chat', type: 'main', index: 0 }]],
    },
    'Voice or Text': {
      main: [[{ node: 'If1', type: 'main', index: 0 }]],
    },
    'Get Voice File': {
      main: [[{ node: 'Speech to Text', type: 'main', index: 0 }]],
    },
    If1: {
      main: [
        [{ node: 'Get Voice File', type: 'main', index: 0 }],
        [{ node: 'Call Agent Chat', type: 'main', index: 0 }],
      ],
    },
  },
  pinData: {},
  meta: {
    instanceId:
      'b395e642078f5ed10edbf1c29001e3a2243f8ee6445e6cb97bb7046023115b31',
  },
}

export default workflow
