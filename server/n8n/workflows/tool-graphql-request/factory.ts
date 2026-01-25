import * as fs from 'fs'
import * as path from 'path'
import { WorkflowBase } from '../interfaces'
import { createHandleResponseNode } from '../helpers'
import { getNodeCoordinates } from '../helpers/nodeCoordinates'

const parseInputCode = fs.readFileSync(
  path.join(__dirname, 'parseInput.js'),
  'utf-8',
)

const mergeConfigTemplate = fs.readFileSync(
  path.join(__dirname, 'mergeConfig.js'),
  'utf-8',
)

if (!process.env.GRAPHQL_ENDPOINT) {
  throw new Error('GRAPHQL_ENDPOINT environment variable is required')
}

const config = {
  GRAPHQL_ENDPOINT: process.env.GRAPHQL_ENDPOINT,
}

export interface ToolGraphqlRequestConfig {
  agentName: string
  credentialId: string
  credentialName: string
}

export function createToolGraphqlRequest(
  cfg: ToolGraphqlRequestConfig,
): WorkflowBase {
  const { agentName, credentialId, credentialName } = cfg

  const mergeConfigCode = mergeConfigTemplate.replace(
    '$config',
    JSON.stringify(config, null, 2),
  )

  return {
    name: `Tool: GraphQL Request (${agentName})`,
    active: true,
    versionId: `tool-graphql-request-${agentName.toLowerCase().replace(/\s+/g, '-')}-v1`,
    nodes: [
      {
        parameters: {
          workflowInputs: {
            values: [
              {
                name: 'query',
              },
              {
                name: 'variables',
                type: 'object',
              },
              {
                name: 'operationName',
                type: 'string',
                default: '',
              },
            ],
          },
        },
        id: 'workflow-trigger',
        name: 'Execute Workflow Trigger',
        type: 'n8n-nodes-base.executeWorkflowTrigger',
        typeVersion: 1.1,
        position: getNodeCoordinates('tool-graphql-request-trigger'),
      },
      {
        parameters: {
          jsCode: parseInputCode,
        },
        id: 'parse-input',
        name: 'Parse Input',
        type: 'n8n-nodes-base.code',
        typeVersion: 2,
        position: getNodeCoordinates('tool-graphql-request-parse'),
      },
      {
        parameters: {},
        type: 'n8n-nodes-base.manualTrigger',
        typeVersion: 1,
        position: getNodeCoordinates('tool-graphql-request-manual'),
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
                id: 'query',
                name: 'query',
                value: `query me { me { id username fullname } }`,
                type: 'string',
              },
              {
                id: 'variables',
                name: 'variables',
                value: '={}',
                type: 'object',
              },
              {
                id: 'operationName',
                name: 'operationName',
                value: '',
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
        position: getNodeCoordinates('tool-graphql-request-set-test'),
      },
      {
        parameters: {
          jsCode: mergeConfigCode,
        },
        id: 'merge-config',
        name: 'Merge Config',
        type: 'n8n-nodes-base.code',
        typeVersion: 2,
        position: getNodeCoordinates('tool-graphql-request-merge-config'),
      },
      {
        parameters: {
          method: 'POST',
          url: '={{ $json.endpoint }}',
          authentication: 'predefinedCredentialType',
          nodeCredentialType: 'httpHeaderAuth',
          sendHeaders: true,
          headerParameters: {
            parameters: [
              {
                name: 'Content-Type',
                value: 'application/json',
              },
            ],
          },
          sendBody: true,
          specifyBody: 'json',
          jsonBody:
            '={{ JSON.stringify({ query: $json.query, variables: $json.variables, operationName: $json.operationName || undefined }) }}',
          options: {},
        },
        id: 'http-request',
        name: 'GraphQL Request',
        type: 'n8n-nodes-base.httpRequest',
        typeVersion: 4.2,
        position: getNodeCoordinates('tool-graphql-request-http'),
        credentials: {
          httpHeaderAuth: {
            id: credentialId,
            name: credentialName,
          },
        },
        onError: 'continueRegularOutput',
      },
      createHandleResponseNode({
        nodeId: 'handle-response',
        position: getNodeCoordinates('tool-graphql-request-handle-response'),
      }),
    ],
    connections: {
      'Execute Workflow Trigger': {
        main: [[{ node: 'Parse Input', type: 'main', index: 0 }]],
      },
      'Parse Input': {
        main: [[{ node: 'Merge Config', type: 'main', index: 0 }]],
      },
      'Manual Trigger': {
        main: [[{ node: 'Set Test Input', type: 'main', index: 0 }]],
      },
      'Set Test Input': {
        main: [[{ node: 'Merge Config', type: 'main', index: 0 }]],
      },
      'Merge Config': {
        main: [[{ node: 'GraphQL Request', type: 'main', index: 0 }]],
      },
      'GraphQL Request': {
        main: [[{ node: 'Handle Response', type: 'main', index: 0 }]],
      },
    },
    pinData: {},
    settings: {
      executionOrder: 'v1',
    },
    meta: {
      instanceId: `narasim-dev-tool-graphql-request-${agentName.toLowerCase().replace(/\s+/g, '-')}`,
    },
  }
}
