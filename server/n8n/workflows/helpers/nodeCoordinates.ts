export type NodeId =
  | 'merge-trigger'
  | 'get-agent-data'
  | 'prepare-context'
  | 'reflection'
  | 'fetch-mindlogs'
  | 'merge'
  | 'merge-context'
  | 'agent'
  | 'workflow-trigger'
  | 'chat-trigger'
  | 'memory'
  | 'workflow-output'
  | 'if-not-streaming'
  | 'respond-webhook'
  | 'get-user-by-token'
  | 'set-auth-context'
  | 'tool-create-mindlog'
  | 'tool-update-mindlog'
  | 'tool-delete-mindlog'
  | 'tool-search-mindlogs'
  | 'tool-create-task'
  | 'tool-update-task'
  | 'tool-delete-task'
  | 'tool-search-tasks'
  | 'tool-create-task-work-log'
  | 'tool-search-task-work-log'
  | 'tool-delete-task-work-log'
  | 'tool-kb-concept'
  | 'tool-kb-fact'
  | 'tool-kb-fact-participation'
  | 'tool-kb-fact-projection'
  | 'tool-kb-knowledge-space'
  | 'tool-ex-reflex'
  | 'tool-ex-reaction'
  | 'tool-web-search-agent'
  | 'tool-fetch'
  | 'tool-read-file'
  | 'tool-list-files'
  | 'tool-graphql'
  | 'tool-get-user-by-token-trigger'
  | 'tool-get-user-by-token-manual'
  | 'tool-get-user-by-token-set-test'
  | 'tool-get-user-by-token-prepare'
  | 'tool-get-user-by-token-check'
  | 'tool-get-user-by-token-http'
  | 'tool-get-user-by-token-set-user'
  | 'tool-get-user-by-token-set-no-user'
  | 'tool-get-config-trigger'
  | 'tool-get-config-manual'
  | 'tool-get-config-code'
  | 'tool-fetch-request-trigger'
  | 'tool-fetch-request-manual'
  | 'tool-fetch-request-set-test'
  | 'tool-fetch-request-http'
  | 'tool-get-user-data-trigger'
  | 'tool-get-user-data-set-query'
  | 'tool-get-user-data-manual'
  | 'tool-get-user-data-http'
  | 'tool-graphql-request-trigger'
  | 'tool-graphql-request-parse'
  | 'tool-graphql-request-manual'
  | 'tool-graphql-request-set-test'
  | 'tool-graphql-request-merge-config'
  | 'tool-graphql-request-http'
  | 'tool-graphql-request-handle-response'
  | 'tool-graphql-request-user-trigger'
  | 'tool-graphql-request-user-parse'
  | 'tool-graphql-request-user-manual'
  | 'tool-graphql-request-user-set-test'
  | 'tool-graphql-request-user-merge-config'
  | 'tool-graphql-request-user-http'
  | 'tool-graphql-request-user-handle-response'
  | 'tool-read-file-trigger'
  | 'tool-read-file-manual'
  | 'tool-read-file-set-test'
  | 'tool-read-file-execute'
  | 'tool-list-files-trigger'
  | 'tool-list-files-manual'
  | 'tool-list-files-set-test'
  | 'tool-list-files-execute'
  | 'loop-runner-trigger'
  | 'loop-runner-execute'
  | 'loop-runner-wait'
  | 'loop-handler-trigger'
  | 'loop-handler-wait'
  | 'loop-handler-code'
  | 'mcp-server-trigger'
  | 'mcp-server-check-token'
  | 'mcp-server-get-user'
  | 'mcp-server-set-user'
  | 'mcp-server-set-no-user'
  | 'mcp-server-call-agent'
  | 'mcp-server-mcp-trigger'
  | 'mcp-server-send-message'
  | 'error-handler-trigger'
  | 'error-handler-set-data'
  | 'error-handler-sticky-note'
  | 'error-handler-log'
  | 'telegram-handler-trigger'
  | 'telegram-handler-call-agent'
  | 'telegram-handler-send-message'
  | 'telegram-handler-speech-to-text'
  | 'telegram-handler-voice-or-text'
  | 'telegram-handler-get-voice'
  | 'telegram-handler-sticky-note'
  | 'telegram-handler-if'
  | 'test-execute-script-trigger'
  | 'test-execute-script-execute'
  | 'verify-token-trigger'
  | 'verify-token-graphql'
  | 'verify-token-set-output'
  | 'reflection-trigger'
  | 'reflection-manual'
  | 'reflection-set-test'
  | 'reflection-process'

const nodeCoordinates: Record<NodeId, [number, number]> = {
  'merge-trigger': [-1664, 256],
  'get-agent-data': [-1344, 144],
  'prepare-context': [-752, 288],
  reflection: [-480, 512],
  'fetch-mindlogs': [-1344, 400],
  merge: [-992, 288],
  'merge-context': [-224, 304],
  agent: [112, 304],
  'workflow-trigger': [-1888, 128],
  'chat-trigger': [-2224, 336],
  memory: [208, 560],
  'workflow-output': [464, 304],
  'if-not-streaming': [672, 304],
  'respond-webhook': [880, 304],
  'get-user-by-token': [-2032, 464],
  'set-auth-context': [-1872, 496],
  'tool-create-mindlog': [1248, 720],
  'tool-update-mindlog': [1248, 864],
  'tool-delete-mindlog': [1248, 1024],
  'tool-search-mindlogs': [1248, 544],
  'tool-create-task': [1968, 704],
  'tool-update-task': [1968, 848],
  'tool-delete-task': [1968, 1008],
  'tool-search-tasks': [1968, 528],
  'tool-create-task-work-log': [2208, 704],
  'tool-search-task-work-log': [1968, 528],
  'tool-delete-task-work-log': [2208, 848],
  'tool-kb-concept': [1504, 544],
  'tool-kb-fact': [1504, 688],
  'tool-kb-fact-participation': [1504, 832],
  'tool-kb-fact-projection': [1504, 1120],
  'tool-kb-knowledge-space': [1504, 1024],
  'tool-ex-reflex': [1728, 544],
  'tool-ex-reaction': [1728, 688],
  'tool-web-search-agent': [2656, 544],
  'tool-fetch': [2432, 544],
  'tool-read-file': [1568, 512],
  'tool-list-files': [1792, 512],
  'tool-graphql': [224, 512],
  'tool-get-user-by-token-trigger': [-400, 200],
  'tool-get-user-by-token-manual': [-400, 400],
  'tool-get-user-by-token-set-test': [-200, 400],
  'tool-get-user-by-token-prepare': [-200, 200],
  'tool-get-user-by-token-check': [0, 200],
  'tool-get-user-by-token-http': [200, 100],
  'tool-get-user-by-token-set-user': [400, 100],
  'tool-get-user-by-token-set-no-user': [200, 300],
  'tool-get-config-trigger': [-200, 304],
  'tool-get-config-manual': [-200, 504],
  'tool-get-config-code': [0, 304],
  'tool-fetch-request-trigger': [-200, 304],
  'tool-fetch-request-manual': [-200, 504],
  'tool-fetch-request-set-test': [0, 504],
  'tool-fetch-request-http': [200, 304],
  'tool-get-user-data-trigger': [-400, 300],
  'tool-get-user-data-set-query': [0, 300],
  'tool-get-user-data-manual': [-400, 500],
  'tool-get-user-data-http': [200, 300],
  'tool-graphql-request-trigger': [-400, 300],
  'tool-graphql-request-parse': [0, 300],
  'tool-graphql-request-manual': [-400, 500],
  'tool-graphql-request-set-test': [0, 500],
  'tool-graphql-request-merge-config': [400, 300],
  'tool-graphql-request-http': [800, 300],
  'tool-graphql-request-handle-response': [1200, 300],
  'tool-graphql-request-user-trigger': [-400, 300],
  'tool-graphql-request-user-parse': [0, 300],
  'tool-graphql-request-user-manual': [-400, 500],
  'tool-graphql-request-user-set-test': [0, 500],
  'tool-graphql-request-user-merge-config': [400, 300],
  'tool-graphql-request-user-http': [800, 300],
  'tool-graphql-request-user-handle-response': [1200, 300],
  'tool-read-file-trigger': [-200, 304],
  'tool-read-file-manual': [-200, 504],
  'tool-read-file-set-test': [0, 504],
  'tool-read-file-execute': [200, 304],
  'tool-list-files-trigger': [-200, 304],
  'tool-list-files-manual': [-200, 504],
  'tool-list-files-set-test': [0, 504],
  'tool-list-files-execute': [200, 304],
  'loop-runner-trigger': [0, 300],
  'loop-runner-execute': [220, 300],
  'loop-runner-wait': [440, 300],
  'loop-handler-trigger': [0, 300],
  'loop-handler-wait': [220, 300],
  'loop-handler-code': [440, 300],
  'mcp-server-trigger': [0, 200],
  'mcp-server-check-token': [200, 200],
  'mcp-server-get-user': [400, 100],
  'mcp-server-set-user': [600, 100],
  'mcp-server-set-no-user': [400, 300],
  'mcp-server-call-agent': [800, 200],
  'mcp-server-mcp-trigger': [368, 96],
  'mcp-server-send-message': [680, 200],
  'error-handler-trigger': [256, 304],
  'error-handler-set-data': [480, 304],
  'error-handler-sticky-note': [-208, 160],
  'error-handler-log': [704, 304],
  'telegram-handler-trigger': [-96, 304],
  'telegram-handler-call-agent': [1056, 320],
  'telegram-handler-send-message': [1312, 320],
  'telegram-handler-speech-to-text': [816, 208],
  'telegram-handler-voice-or-text': [224, 304],
  'telegram-handler-get-voice': [576, 208],
  'telegram-handler-sticky-note': [192, 128],
  'telegram-handler-if': [384, 304],
  'test-execute-script-trigger': [-200, 304],
  'test-execute-script-execute': [0, 304],
  'verify-token-trigger': [0, 300],
  'verify-token-graphql': [220, 300],
  'verify-token-set-output': [440, 300],
  'reflection-trigger': [-400, 300],
  'reflection-manual': [-400, 500],
  'reflection-set-test': [0, 500],
  'reflection-process': [200, 300],
}

export function getNodeCoordinates(nodeId: NodeId): [number, number] {
  const coords = nodeCoordinates[nodeId]
  if (!coords) {
    throw new Error(`Unknown node ID: ${nodeId}`)
  }
  return coords
}

export function getNodeCoordinatesOffset(
  nodeId: NodeId,
  offsetX: number = 0,
  offsetY: number = 0,
): [number, number] {
  const [x, y] = getNodeCoordinates(nodeId)
  return [x + offsetX, y + offsetY]
}

export const GRID_SPACING = 144

export function getGridPosition(
  row: number,
  column: number,
  baseX: number = 0,
  baseY: number = 0,
): [number, number] {
  return [baseX + column * GRID_SPACING, baseY + row * GRID_SPACING]
}

export function getToolGridPosition(
  toolIndex: number,
  baseX: number = 1248,
  baseY: number = 544,
): [number, number] {
  const row = Math.floor(toolIndex / 1)
  const spacing = 144
  return [baseX, baseY + row * spacing]
}
