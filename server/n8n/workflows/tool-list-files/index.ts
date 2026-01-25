import { WorkflowBase } from '../interfaces'
import { getNodeCoordinates } from '../helpers/nodeCoordinates'

const workflow: WorkflowBase = {
  name: 'Tool: List Files',
  active: true,
  versionId: 'tool-list-files-v2',
  nodes: [
    {
      parameters: {
        inputSource: 'passthrough',
      },
      id: 'workflow-trigger',
      name: 'Execute Workflow Trigger',
      type: 'n8n-nodes-base.executeWorkflowTrigger',
      typeVersion: 1.1,
      position: getNodeCoordinates('tool-list-files-trigger'),
    },
    {
      parameters: {},
      type: 'n8n-nodes-base.manualTrigger',
      typeVersion: 1,
      position: getNodeCoordinates('tool-list-files-manual'),
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
              id: 'path',
              name: 'path',
              value: 'src/gql/generated',
              type: 'string',
            },
          ],
        },
        options: {},
      },
      id: 'set-test-path',
      name: 'Set Test Path',
      type: 'n8n-nodes-base.set',
      typeVersion: 3.4,
      position: getNodeCoordinates('tool-list-files-set-test'),
    },
    {
      parameters: {
        command: '=ls -la {{ $json.path }} 2>&1',
      },
      id: 'exec-list',
      name: 'List Files',
      type: 'n8n-nodes-base.executeCommand',
      typeVersion: 1,
      position: getNodeCoordinates('tool-list-files-execute'),
    },
  ],
  connections: {
    'Execute Workflow Trigger': {
      main: [[{ node: 'List Files', type: 'main', index: 0 }]],
    },
    'Manual Trigger': {
      main: [[{ node: 'Set Test Path', type: 'main', index: 0 }]],
    },
    'Set Test Path': {
      main: [[{ node: 'List Files', type: 'main', index: 0 }]],
    },
  },
  pinData: {},
  settings: {
    executionOrder: 'v1',
  },
  meta: {
    instanceId: 'narasim-dev-tool-list-files',
  },
}

export default workflow
