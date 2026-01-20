import { NodeType } from '../../interfaces'
import { getCreateTaskNode } from './createTask'
import { getDeleteTaskNode } from './deleteTask'
import { getSearchTaskNode } from './searchTask'
import { getUpdateTaskNode } from './updateTask'

type GetTaskNodesProps = {
  agentId: string
  agentName: string
}

export function getTaskNodes({
  agentId,
  agentName,
}: GetTaskNodesProps): NodeType[] {
  return [
    getCreateTaskNode({ agentId, agentName }),
    getUpdateTaskNode({ agentId, agentName }),
    getDeleteTaskNode({ agentId, agentName }),
    getSearchTaskNode({ agentId, agentName }),
  ]
}
