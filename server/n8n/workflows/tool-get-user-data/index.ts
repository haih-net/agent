import { print } from 'graphql'
import { MeDocument } from 'src/gql/generated/me'
import { WorkflowBase } from '../interfaces'
import { getNodeCoordinates } from '../helpers/nodeCoordinates'

const getUserDataQuery = print(MeDocument)

if (!process.env.GRAPHQL_ENDPOINT) {
  throw new Error('GRAPHQL_ENDPOINT environment variable is required')
}

const testUserToken = process.env.TEST_USER_TOKEN || ''

const toolGetUserData: WorkflowBase = {
  name: 'Tool: Get User Data',
  active: true,
  versionId: 'tool-get-user-data-v1',
  nodes: [
    {
      parameters: {
        workflowInputs: {
          values: [
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
      position: [-400, 300],
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
              value: getUserDataQuery,
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
              value: '={{ $json.token }}',
              type: 'string',
            },
          ],
        },
        options: {},
      },
      id: 'set-query',
      name: 'Set Query',
      type: 'n8n-nodes-base.set',
      typeVersion: 3.4,
      position: getNodeCoordinates('tool-get-user-data-set-query'),
    },
    {
      parameters: {},
      type: 'n8n-nodes-base.manualTrigger',
      typeVersion: 1,
      position: getNodeCoordinates('tool-get-user-data-manual'),
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
      position: [0, 500],
    },
    {
      parameters: {
        method: 'POST',
        url: process.env.GRAPHQL_ENDPOINT,
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
      position: [400, 300],
    },
  ],
  connections: {
    'Execute Workflow Trigger': {
      main: [[{ node: 'Set Query', type: 'main', index: 0 }]],
    },
    'Set Query': {
      main: [[{ node: 'GraphQL Request', type: 'main', index: 0 }]],
    },
    'Manual Trigger': {
      main: [[{ node: 'Set Test Input', type: 'main', index: 0 }]],
    },
    'Set Test Input': {
      main: [[{ node: 'Set Query', type: 'main', index: 0 }]],
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
    instanceId: 'narasim-dev-tool-get-user-data',
  },
}

export default [toolGetUserData]
