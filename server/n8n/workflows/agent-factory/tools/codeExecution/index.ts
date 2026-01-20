import { createTool, createToolInputs } from '../../../helpers'
import { ConnectionsType, NodeType } from '../../interfaces'

interface CodeExecutionToolsConfig {
  agentId: string
  agentName: string
}

export function getCodeExecutionNodes(
  config: CodeExecutionToolsConfig,
): NodeType[] {
  const { agentId } = config

  return [
    createTool({
      name: 'read_file',
      toolName: 'Read File Tool',
      description:
        'Read a file from the project source code. Returns file content (max 500 lines).',
      workflowName: 'Tool: Read File',
      nodeId: `${agentId}-tool-read-file`,
      position: [1568, 512],
      inputs: createToolInputs([
        {
          name: 'path',
          description:
            "File path to read, e.g. 'src/index.ts' or 'package.json'",
          type: 'string',
          required: true,
        },
      ]),
    }),
    createTool({
      name: 'list_files',
      toolName: 'List Files Tool',
      description:
        'List files and directories in a given path. Returns ls -la output.',
      workflowName: 'Tool: List Files',
      nodeId: `${agentId}-tool-list-files`,
      position: [1792, 512],
      inputs: createToolInputs([
        {
          name: 'path',
          description: "Directory path to list, e.g. '.' or 'src'",
          type: 'string',
          required: true,
        },
      ]),
    }),
  ]
}

export function getCodeExecutionConnections(
  config: CodeExecutionToolsConfig,
): ConnectionsType {
  const { agentName } = config

  return {
    'Read File Tool': {
      ai_tool: [[{ node: agentName, type: 'ai_tool', index: 0 }]],
    },
    'List Files Tool': {
      ai_tool: [[{ node: agentName, type: 'ai_tool', index: 0 }]],
    },
  }
}
