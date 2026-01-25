import { WorkflowBase } from '../interfaces'
import { getNodeCoordinates } from '../helpers/nodeCoordinates'

const workflow: WorkflowBase = {
  name: 'Test: Execute Script',
  active: false,
  versionId: 'test-execute-script-v1',
  nodes: [
    {
      parameters: {},
      type: 'n8n-nodes-base.manualTrigger',
      typeVersion: 1,
      position: getNodeCoordinates('test-execute-script-trigger'),
      id: 'manual-trigger',
      name: 'Manual Trigger',
    },
    {
      parameters: {
        command: '/home/node/scripts/test-env.sh',
      },
      id: 'exec-script',
      name: 'Execute Script',
      type: 'n8n-nodes-base.executeCommand',
      typeVersion: 1,
      position: getNodeCoordinates('test-execute-script-execute'),
    },
  ],
  connections: {
    'Manual Trigger': {
      main: [[{ node: 'Execute Script', type: 'main', index: 0 }]],
    },
  },
  pinData: {},
  settings: {
    executionOrder: 'v1',
  },
  meta: {
    instanceId: 'narasim-dev-test-execute-script',
  },
}

export default workflow
