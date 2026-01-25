import { WorkflowBase } from '../interfaces'
import { getNodeCoordinates } from '../helpers/nodeCoordinates'

const workflow: WorkflowBase = {
  name: 'Loop: Runner',
  active: false,
  versionId: 'loop-runner-v1',
  nodes: [
    {
      parameters: {
        events: ['activate', 'init'],
      },
      type: 'n8n-nodes-base.n8nTrigger',
      typeVersion: 1,
      position: getNodeCoordinates('loop-runner-trigger'),
      id: 'loop-runner-trigger',
      name: 'n8n Trigger',
    },
    {
      parameters: {
        workflowId: {
          __rl: true,
          mode: 'name',
          value: 'Loop: Handler',
        },
      },
      type: 'n8n-nodes-base.executeWorkflow',
      typeVersion: 1.2,
      position: getNodeCoordinates('loop-runner-execute'),
      id: 'loop-runner-execute-handler',
      name: 'Execute Handler',
    },
    {
      parameters: {
        amount: 5,
        unit: 'seconds',
      },
      type: 'n8n-nodes-base.wait',
      typeVersion: 1.1,
      position: getNodeCoordinates('loop-runner-wait'),
      id: 'loop-runner-wait',
      name: 'Wait 5s',
    },
  ],
  connections: {
    'n8n Trigger': {
      main: [[{ node: 'Execute Handler', type: 'main', index: 0 }]],
    },
    'Execute Handler': {
      main: [[{ node: 'Wait 5s', type: 'main', index: 0 }]],
    },
    'Wait 5s': {
      main: [[{ node: 'Execute Handler', type: 'main', index: 0 }]],
    },
  },
  pinData: {},
  settings: {
    executionOrder: 'v1',
    saveDataSuccessExecution: 'none',
    saveExecutionProgress: false,
  },
  meta: {
    instanceId: 'narasim-dev-loop-runner',
  },
}

export default workflow
