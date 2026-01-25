import { WorkflowBase } from '../interfaces'
import { getNodeCoordinates } from '../helpers/nodeCoordinates'
import { getReflectionWorkflowName } from './helpers'

export interface ReflectionWorkflowConfig {
  agentName: string
}

export function createReflectionWorkflow(
  cfg: ReflectionWorkflowConfig,
): WorkflowBase {
  const { agentName } = cfg

  return {
    name: getReflectionWorkflowName(agentName),
    active: true,
    versionId: `reflection-${agentName.toLowerCase().replace(/\s+/g, '-')}-v1`,
    nodes: [
      {
        parameters: {
          workflowInputs: {
            values: [
              {
                name: 'agentId',
                type: 'string',
              },
            ],
          },
        },
        id: 'workflow-trigger',
        name: 'Execute Workflow Trigger',
        type: 'n8n-nodes-base.executeWorkflowTrigger',
        typeVersion: 1.1,
        position: getNodeCoordinates('reflection-trigger'),
      },
      {
        parameters: {},
        type: 'n8n-nodes-base.manualTrigger',
        typeVersion: 1,
        position: getNodeCoordinates('reflection-manual'),
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
            ],
          },
          options: {},
        },
        id: 'set-test-input',
        name: 'Set Test Input',
        type: 'n8n-nodes-base.set',
        typeVersion: 3.4,
        position: getNodeCoordinates('reflection-set-test'),
      },
      {
        parameters: {
          jsCode: 'return $input.all()',
        },
        id: 'process-reflection',
        name: 'Process Reflection',
        type: 'n8n-nodes-base.code',
        typeVersion: 2,
        position: getNodeCoordinates('reflection-process'),
      },
    ],
    connections: {
      'Execute Workflow Trigger': {
        main: [[{ node: 'Process Reflection', type: 'main', index: 0 }]],
      },
      'Manual Trigger': {
        main: [[{ node: 'Set Test Input', type: 'main', index: 0 }]],
      },
      'Set Test Input': {
        main: [[{ node: 'Process Reflection', type: 'main', index: 0 }]],
      },
    },
    pinData: {},
    settings: {
      executionOrder: 'v1',
    },
    meta: {
      instanceId: `narasim-dev-reflection-${agentName.toLowerCase().replace(/\s+/g, '-')}`,
    },
  }
}
