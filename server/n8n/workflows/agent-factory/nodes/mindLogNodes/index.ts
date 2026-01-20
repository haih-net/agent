import { NodeType } from '../../interfaces'
import { getCreateMindLogNode } from './createMindLog'
import { getDeleteMindLogNode } from './deleteMindLog'
import { getSearchMindLogNode } from './searchMindLog'
import { getUpdateMindLogNode } from './updateMindLog'

type GetMindLogNodesProps = {
  agentId: string
  agentName: string
}

export function getMindLogNodes({
  agentId,
  agentName,
}: GetMindLogNodesProps): NodeType[] {
  return [
    getCreateMindLogNode({ agentId, agentName }),
    getUpdateMindLogNode({ agentId, agentName }),
    getDeleteMindLogNode({ agentId, agentName }),
    getSearchMindLogNode({ agentId, agentName }),
  ]
}
