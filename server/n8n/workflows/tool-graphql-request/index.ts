import * as fs from 'fs'
import * as path from 'path'
import { WorkflowBase } from '../interfaces'

const parseInputCode = fs.readFileSync(
  path.join(__dirname, 'parseInput.js'),
  'utf-8',
)

const workflow: WorkflowBase = {
  name: 'Tool: GraphQL Request',
  active: true,
  versionId: 'tool-graphql-request-v3',
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
          ],
        },
      },
      id: 'workflow-trigger',
      name: 'Execute Workflow Trigger',
      type: 'n8n-nodes-base.executeWorkflowTrigger',
      typeVersion: 1.1,
      position: [-200, 304],
    },
    {
      parameters: {
        jsCode: parseInputCode,
      },
      id: 'parse-input',
      name: 'Parse Input',
      type: 'n8n-nodes-base.code',
      typeVersion: 2,
      position: [0, 304],
    },
    {
      parameters: {},
      type: 'n8n-nodes-base.manualTrigger',
      typeVersion: 1,
      position: [-200, 504],
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
              value: `query users {
                freeCodeUsers(take: 3) {
                  id
                  username
                  fullname
                }
              }`,
              type: 'string',
            },
            {
              id: 'variables',
              name: 'variables',
              value: '={}',
              type: 'object',
            },
          ],
        },
        options: {},
      },
      id: 'set-test-input',
      name: 'Set Test Input',
      type: 'n8n-nodes-base.set',
      typeVersion: 3.4,
      position: [0, 504],
    },
    {
      parameters: {
        workflowId: {
          __rl: true,
          mode: 'list',
          value: 'Tool: Get Config',
        },
      },
      id: 'get-config',
      name: 'Get Config',
      type: 'n8n-nodes-base.executeWorkflow',
      typeVersion: 1.2,
      position: [200, 304],
    },
    {
      parameters: {
        jsCode: `const config = $input.first().json;

let triggerData = {};

if ($('Parse Input').isExecuted) {
  triggerData = $('Parse Input').first().json;
} else if ($('Set Test Input').isExecuted) {
  triggerData = $('Set Test Input').first().json;
}

return [{
  json: {
    query: triggerData.query || '',
    variables: triggerData.variables || {},
    endpoint: config.GRAPHQL_ENDPOINT,
  }
}];`,
      },
      id: 'merge-config',
      name: 'Merge Config',
      type: 'n8n-nodes-base.code',
      typeVersion: 2,
      position: [400, 304],
    },
    {
      parameters: {
        method: 'POST',
        url: '={{ $json.endpoint }}',
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
          '={{ JSON.stringify({ query: $json.query, variables: $json.variables }) }}',
      },
      id: 'http-request',
      name: 'GraphQL Request',
      type: 'n8n-nodes-base.httpRequest',
      typeVersion: 4.2,
      position: [600, 304],
    },
  ],
  connections: {
    'Execute Workflow Trigger': {
      main: [[{ node: 'Parse Input', type: 'main', index: 0 }]],
    },
    'Parse Input': {
      main: [[{ node: 'Get Config', type: 'main', index: 0 }]],
    },
    'Manual Trigger': {
      main: [[{ node: 'Set Test Input', type: 'main', index: 0 }]],
    },
    'Set Test Input': {
      main: [[{ node: 'Get Config', type: 'main', index: 0 }]],
    },
    'Get Config': {
      main: [[{ node: 'Merge Config', type: 'main', index: 0 }]],
    },
    'Merge Config': {
      main: [[{ node: 'GraphQL Request', type: 'main', index: 0 }]],
    },
  },
  pinData: {},
  settings: {
    executionOrder: 'v1',
  },
  meta: {
    instanceId: 'narasim-dev-tool-graphql-request',
  },
}

export default workflow
