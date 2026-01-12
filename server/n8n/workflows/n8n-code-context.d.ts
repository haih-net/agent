import type { INodeExecutionData, INodeParameters } from 'n8n-workflow'

export interface N8nNodeDataProxy {
  isExecuted: boolean
  first: (
    branchIndex?: number,
    runIndex?: number,
  ) => INodeExecutionData | undefined
  last: (
    branchIndex?: number,
    runIndex?: number,
  ) => INodeExecutionData | undefined
  all: (branchIndex?: number, runIndex?: number) => INodeExecutionData[]
  item: INodeExecutionData
  params: INodeParameters
  context: Record<string, unknown>
  itemMatching: (itemIndex: number) => INodeExecutionData
  pairedItem: (itemIndex?: number) => INodeExecutionData
}

export type N8nNodeSelector = (nodeName: string) => N8nNodeDataProxy

export interface N8nInputProxy {
  item: INodeExecutionData
  first: () => INodeExecutionData | undefined
  last: () => INodeExecutionData | undefined
  all: () => INodeExecutionData[]
  context: Record<string, unknown>
  params: INodeParameters
}

export interface N8nCodeContext {
  $: N8nNodeSelector
  $input: N8nInputProxy
  $json: INodeExecutionData['json']
  $binary: INodeExecutionData['binary']
  $item: (itemIndex: number, runIndex?: number) => N8nCodeContext
  $items: (
    nodeName?: string,
    outputIndex?: number,
    runIndex?: number,
  ) => INodeExecutionData[]
  $node: Record<string, N8nNodeDataProxy>
  $env: Record<string, string>
  $now: Date
  $today: Date
  $position: number
  $thisRunIndex: number
  $thisItemIndex: number
  $workflow: {
    id?: string
    name?: string
    active: boolean
  }
  $execution: {
    id: string
    mode: 'test' | 'production'
    resumeUrl: string
    resumeFormUrl: string
  }
  $prevNode: {
    name: string
    outputIndex: number
    runIndex: number
  }
}
