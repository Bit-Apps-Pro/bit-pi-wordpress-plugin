import { type Edge, type Node, Position, type Viewport } from 'reactflow'

import { $flowNodesFamily } from '@common/globalStates/$flowNodes'
import { deepCopy } from '@common/helpers/globalHelpers'
import { type FlowMapType, createFlowMap } from '@features/FlowBuilder/helpers/FlowBuilderHelper'
import NodeTypeDef from '@features/FlowBuilder/internals/nodeTypes/NodeTypeDef'
import { type Getter, type Setter, atom } from 'jotai'
import { RESET, atomWithReset } from 'jotai/utils'
import { create } from 'mutative'

import { type FlowMachineType } from './flows/FlowMachineType'

export interface FlowType {
  id: number
  title: string
  run_count: number
  is_active: number
  tag_id?: string
  map: FlowMapType
  data: {
    edges: Edge[]
    nodes: Node[]
    viewport: Viewport
  }
  triggerType?: FlowMachineType['triggerType']
  created_at?: string
  updated_at?: string
}

export const $flowDetails = atomWithReset<FlowType>({
  id: 0,
  title: '',
  run_count: 0,
  is_active: 1,
  map: {
    id: 'NODE_ID-1',
    type: NodeTypeDef.trigger
  },
  data: {
    edges: [],
    nodes: [
      {
        connectable: true,
        data: {},
        height: 70,
        id: 'NODE_ID-1',
        position: { x: 117, y: 110 },
        positionAbsolute: { x: 117, y: 110 },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
        type: NodeTypeDef.trigger
      }
    ],
    viewport: { x: 0, y: 0, zoom: 1 }
  }
})

type SetFlowType = (value: FlowType) => FlowType

const $flowDetailsSelector = atom(
  (get: Getter) => get($flowDetails),
  async (get: Getter, set: Setter, update: FlowType | SetFlowType | typeof RESET) => {
    set($flowDetails, typeof update === 'function' ? update(get($flowDetails)) : update)
    if (update === RESET) return

    const flowDetails = get($flowDetails)
    if (!flowDetails.id || typeof flowDetails.id !== 'number') return

    const startingEdge = flowDetails?.data?.edges.find(edge => edge.source === `${flowDetails.id}-1`)
    let flowMap: FlowMapType = deepCopy(flowDetails.map)

    if (flowDetails?.data?.nodes.length > 1 && startingEdge) {
      const tmpNodes: Node[] = deepCopy(flowDetails.data.nodes)
      const nodesWithConditions = tmpNodes.map(node => {
        if (node.type === NodeTypeDef.condition) {
          const { states } = get($flowNodesFamily(node.id))

          const conditions = states?.conditions?.map(condition => ({
            id: condition.id,
            type: condition.type
          }))
          node.data = { conditions }
        }
        return node
      })
      flowMap = createFlowMap({
        currentEdge: startingEdge,
        nodes: nodesWithConditions,
        edges: flowDetails.data.edges
      })
    }

    set($flowDetails, prev =>
      create(prev, draft => {
        draft.map = flowMap
      })
    )
  }
)

export default $flowDetailsSelector
