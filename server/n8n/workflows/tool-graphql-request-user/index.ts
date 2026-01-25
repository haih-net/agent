import * as fs from 'fs'
import * as path from 'path'
import { WorkflowBase } from '../interfaces'
import { getNodeCoordinates } from '../helpers/nodeCoordinates'

const parseInputCode = fs.readFileSync(
  path.join(__dirname, '../tool-graphql-request/parseInput.js'),
  'utf-8',
)

const mergeConfigTemplate = fs.readFileSync(
  path.join(__dirname, '../tool-graphql-request/mergeConfig.js'),
  'utf-8',
)

if (!process.env.GRAPHQL_ENDPOINT) {
  throw new Error('GRAPHQL_ENDPOINT environment variable is required')
}

const config = {
  GRAPHQL_ENDPOINT: process.env.GRAPHQL_ENDPOINT,
}

const testUserToken = process.env.TEST_USER_TOKEN || ''

const mergeConfigCode = mergeConfigTemplate.replace(
  '$config',
  JSON.stringify(config, null, 2),
)

const toolGraphqlRequestUser: WorkflowBase = {
  name: 'Tool: GraphQL Request With Token (User)',
  active: true,
  versionId: 'tool-graphql-request-with-token-user-v1',
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
              type: 'any',
            },
            {
              name: 'token',
            },
          ],
        },
      },
      id: 'workflow-trigger',
      name: 'Execute Workflow Trigger',
      type: 'n8n-nodes-base.executeWorkflowTrigger',
      typeVersion: 1.1,
      position: getNodeCoordinates('tool-graphql-request-user-trigger'),
    },
    {
      parameters: {
        jsCode: parseInputCode,
      },
      id: 'parse-input',
      name: 'Parse Input',
      type: 'n8n-nodes-base.code',
      typeVersion: 2,
      position: getNodeCoordinates('tool-graphql-request-user-parse'),
    },
    {
      parameters: {},
      type: 'n8n-nodes-base.manualTrigger',
      typeVersion: 1,
      position: getNodeCoordinates('tool-graphql-request-user-manual'),
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
              id: 'token',
              name: 'token',
              value: testUserToken,
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
      position: getNodeCoordinates('tool-graphql-request-user-set-test'),
    },
    {
      parameters: {
        jsCode: mergeConfigCode,
      },
      id: 'merge-config',
      name: 'Merge Config',
      type: 'n8n-nodes-base.code',
      typeVersion: 2,
      position: getNodeCoordinates('tool-graphql-request-user-merge-config'),
    },
    {
      parameters: {
        method: 'POST',
        url: '={{ $json.endpoint }}',
        authentication: 'genericCredentialType',
        genericAuthType: 'none',
        sendHeaders: true,
        headerParameters: {
          parameters: [
            {
              name: 'Content-Type',
              value: 'application/json',
            },
            {
              name: 'Authorization',
              value: '={{ $json.token }}',
            },
          ],
        },
        sendBody: true,
        specifyBody: 'json',
        jsonBody:
          '={{ JSON.stringify({ query: $json.query, variables: $json.variables }) }}',
        options: {},
      },
      id: 'http-request',
      name: 'GraphQL Request',
      type: 'n8n-nodes-base.httpRequest',
      typeVersion: 4.2,
      position: getNodeCoordinates('tool-graphql-request-user-http'),
    },
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
  },
  pinData: {},
  settings: {
    executionOrder: 'v1',
    saveDataErrorExecution:
      process.env.NODE_ENV === 'development' ? 'all' : 'none',
    saveDataSuccessExecution:
      process.env.NODE_ENV === 'development' ? 'all' : 'none',
    saveManualExecutions: false,
    saveExecutionProgress: true,
  },
  meta: {
    instanceId: 'narasim-dev-tool-graphql-request-with-token-user',
  },
}

export default [toolGraphqlRequestUser]
