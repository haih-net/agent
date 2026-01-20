import { NodeType } from '../../interfaces'
import { getCreateTaskWorkLogNode } from './createTaskWorkLog'
import { getSearchTaskWorkLogNode } from './searchTaskWorkLog'
import { getDeleteTaskWorkLogNode } from './deleteTaskWorkLog'

type GetTaskWorkLogNodesProps = {
  agentId: string
  agentName: string
}

export function getTaskWorkLogNodes({
  agentId,
  agentName,
}: GetTaskWorkLogNodesProps): NodeType[] {
  return [
    getCreateTaskWorkLogNode({ agentId, agentName }),
    getSearchTaskWorkLogNode({ agentId, agentName }),
    getDeleteTaskWorkLogNode({ agentId, agentName }),
  ]
}
