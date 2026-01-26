import * as fs from 'fs'
import * as path from 'path'
import { print } from 'graphql'
import { MyReflexesDocument } from 'src/gql/generated/myReflexes'
import { WorkflowBase } from '../interfaces'
import { getReflectionWorkflowName } from './helpers'
import { getGraphqlRequestWorkflowName } from '../tool-graphql-request/helpers'
import { getModel } from '../helpers'

const myReflexesQuery = print(MyReflexesDocument)

const systemMessageTemplate = fs.readFileSync(
  path.join(__dirname, 'system-message.md'),
  'utf-8',
)

const outputInstructions = fs.readFileSync(
  path.join(__dirname, 'output-instructions.md'),
  'utf-8',
)

const preparePromptTemplate = fs.readFileSync(
  path.join(__dirname, 'preparePrompt.js'),
  'utf-8',
)

export interface ReflectionWorkflowConfig {
  agentName: string
}

export function createReflectionWorkflow(
  cfg: ReflectionWorkflowConfig,
): WorkflowBase {
  const { agentName } = cfg
  const agentSlug = agentName.toLowerCase().replace(/\s+/g, '-')
  const model = getModel(
    process.env.AGENT_REFLECTION_MODEL || 'google/gemini-2.5-flash-lite',
  )

  const preparePromptCode = preparePromptTemplate.replace(
    '$systemMessageTemplate',
    systemMessageTemplate,
  )

  return {
    name: getReflectionWorkflowName(agentName),
    active: true,
    versionId: `reflection-${agentSlug}-v1`,
    nodes: [
      {
        parameters: {
          workflowInputs: {
            values: [
              {
                name: 'agentId',
                type: 'string',
              },
              {
                name: 'chatInput',
                type: 'string',
              },
            ],
          },
        },
        id: 'workflow-trigger',
        name: 'Execute Workflow Trigger',
        type: 'n8n-nodes-base.executeWorkflowTrigger',
        typeVersion: 1.1,
        position: [-400, 300] as [number, number],
      },
      {
        parameters: {},
        type: 'n8n-nodes-base.manualTrigger',
        typeVersion: 1,
        position: [-400, 500] as [number, number],
        id: 'manual-trigger',
        name: 'Manual Trigger',
      },
      {
        parameters: {
          mode: 'manual',
          duplicateItem: false,
          assignments: {
            assignments: [
              {
                id: 'agentId',
                name: 'agentId',
                value: 'test-agent-id',
                type: 'string',
              },
              {
                id: 'chatInput',
                name: 'chatInput',
                value:
                  'Hello! My name is Mike. What can you do? What do you know about me? Can you order me a pizza?',
                type: 'string',
              },
            ],
          },
          options: {},
        },
        id: 'set-test-input',
        name: 'Set Test Input',
        type: 'n8n-nodes-base.set',
        typeVersion: 3.4,
        position: [-200, 500] as [number, number],
      },
      {
        parameters: {
          jsCode: 'return $input.all()',
        },
        id: `reflection-${agentSlug}-merge-trigger`,
        name: 'Merge Trigger',
        type: 'n8n-nodes-base.code',
        typeVersion: 2,
        position: [-100, 300] as [number, number],
      },
      {
        parameters: {
          workflowId: {
            __rl: true,
            mode: 'list',
            value: getGraphqlRequestWorkflowName(agentName),
          },
          workflowInputs: {
            mappingMode: 'defineBelow',
            value: {
              query: myReflexesQuery,
              variables: '={{ {} }}',
              operationName: 'myReflexes',
            },
            matchingColumns: [],
            schema: [
              {
                id: 'query',
                displayName: 'query',
                required: true,
                defaultMatch: false,
                display: true,
                canBeUsedToMatch: true,
                type: 'string',
              },
              {
                id: 'variables',
                displayName: 'variables',
                required: false,
                defaultMatch: false,
                display: true,
                canBeUsedToMatch: true,
                type: 'object',
              },
              {
                id: 'operationName',
                displayName: 'operationName',
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
        id: `reflection-${agentSlug}-fetch-reflexes`,
        name: 'Fetch Reflexes',
        type: 'n8n-nodes-base.executeWorkflow',
        typeVersion: 1.2,
        position: [100, 300] as [number, number],
      },
      {
        parameters: {
          jsCode: preparePromptCode,
        },
        id: `reflection-${agentSlug}-prepare-prompt`,
        name: 'Prepare Prompt',
        type: 'n8n-nodes-base.code',
        typeVersion: 2,
        position: [300, 300] as [number, number],
      },
      {
        parameters: {
          promptType: 'define',
          text: "={{ $('Merge Trigger').first().json.chatInput }}",
          messages: {
            messageValues: [
              {
                message: '={{ $json.systemMessage }}',
              },
              {
                type: 'AIMessagePromptTemplate',
                message: '={{ $json.reflexesList }}',
              },
            ],
          },
          batching: {},
        },
        id: `reflection-${agentSlug}-llm-chain`,
        name: 'Basic LLM Chain',
        type: '@n8n/n8n-nodes-langchain.chainLlm',
        typeVersion: 1.8,
        position: [500, 300] as [number, number],
      },
      {
        parameters: {
          model,
          options: {},
        },
        id: `reflection-${agentSlug}-chat-model`,
        name: 'OpenRouter Chat Model',
        type: '@n8n/n8n-nodes-langchain.lmChatOpenRouter',
        typeVersion: 1,
        position: [500, 520] as [number, number],
        credentials: {
          openRouterApi: {
            id: 'FsN0N48lU327xkz6',
            name: 'OpenRouter',
          },
        },
      },
      {
        parameters: {
          jsCode: `const reflectionResult = $input.first().json.text || 'NO_MATCH';
const outputInstructions = \`${outputInstructions}\`;
const finalOutput = outputInstructions.replace('\${reflectionResult}', reflectionResult);

return [{
  json: {
    instructions: finalOutput,
  }
}];`,
        },
        id: `reflection-${agentSlug}-build-output`,
        name: 'Build Output',
        type: 'n8n-nodes-base.code',
        typeVersion: 2,
        position: [848, 304] as [number, number],
      },
    ],
    connections: {
      'Execute Workflow Trigger': {
        main: [[{ node: 'Merge Trigger', type: 'main', index: 0 }]],
      },
      'Manual Trigger': {
        main: [[{ node: 'Set Test Input', type: 'main', index: 0 }]],
      },
      'Set Test Input': {
        main: [[{ node: 'Merge Trigger', type: 'main', index: 0 }]],
      },
      'Merge Trigger': {
        main: [[{ node: 'Fetch Reflexes', type: 'main', index: 0 }]],
      },
      'Fetch Reflexes': {
        main: [[{ node: 'Prepare Prompt', type: 'main', index: 0 }]],
      },
      'Prepare Prompt': {
        main: [[{ node: 'Basic LLM Chain', type: 'main', index: 0 }]],
      },
      'Basic LLM Chain': {
        main: [[{ node: 'Build Output', type: 'main', index: 0 }]],
      },
      'OpenRouter Chat Model': {
        ai_languageModel: [
          [{ node: 'Basic LLM Chain', type: 'ai_languageModel', index: 0 }],
        ],
      },
    },
    pinData: {},
    settings: {
      executionOrder: 'v1',
    },
    meta: {
      instanceId: `narasim-dev-reflection-${agentSlug}`,
    },
  }
}
