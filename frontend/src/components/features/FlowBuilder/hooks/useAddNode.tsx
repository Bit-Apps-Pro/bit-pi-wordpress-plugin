import { type MouseEvent } from 'react'
import { type Edge } from 'reactflow'
import { Position, useEdges, useNodes, useReactFlow } from 'reactflow'

import $flowDetailsSelector, { type FlowType } from '@common/globalStates/$flowDetails'
import { getNewId } from '@features/FlowBuilder/helpers/FlowBuilderHelper'
import NodeTypeDef from '@features/FlowBuilder/internals/nodeTypes/NodeTypeDef'
import { useAtom } from 'jotai'
import { create } from 'mutative'

export default function useAddNode(nodeId: string, placement = 350) {
  const reactFlow = useReactFlow()
  const nodes = useNodes()
  const edges = useEdges()
  const [flowDetails, setFlowDetails] = useAtom($flowDetailsSelector)

  const nodePositionChange = (positionX: number, positionY: number) => {
    const triggerIds = edges.reduce((ids: string[], edge: Edge) => {
      if (edge.source === nodeId) ids.push(edge.target)
      return ids
    }, [])

    const totalSpaceNeed = triggerIds.reduce((totalSpace: number, curr: string) => {
      const node = nodes.find(item => item.id === curr)
      return totalSpace + (node?.height || 0) + 20
    }, 0)

    const startYPosition = positionY - totalSpaceNeed / 2

    let height = 0
    reactFlow.setNodes(prev => {
      const newNodes = prev.map(item => {
        if (triggerIds.includes(item.id)) {
          const positions = { x: positionX, y: startYPosition + height }
          item.position = positions
          item.positionAbsolute = positions
          height += (item?.height || 0) + 20
        }
        return item
      })

      setFlowDetails((prv: FlowType) =>
        create(prv, draft => {
          draft.data.nodes = newNodes
        })
      )

      return newNodes
    })

    return startYPosition + height
  }

  const handleAddNode = (addNode?: 'single' | 'multiple') => (e: MouseEvent) => {
    e.stopPropagation()

    const node = nodes.find(item => item.id === nodeId)
    const positionX = (node?.position.x || 0) + placement
    let positionY = node?.position.y || 0

    if (addNode === 'multiple') {
      positionY = nodePositionChange(positionX, positionY)
    }

    const newNodeId = getNewId(nodes, NodeTypeDef.action, flowDetails.id)

    const generateNewNode = {
      id: newNodeId,
      type: NodeTypeDef.action,
      data: {},
      connectable: true,
      position: { x: positionX, y: positionY },
      sourcePosition: Position.Right,
      targetPosition: Position.Left
    }

    const generateNewEdge = {
      id: getNewId(edges, 'edge'),
      source: nodeId,
      sourceHandle: 'right',
      target: newNodeId,
      targetHandle: 'left'
    }

    reactFlow.setNodes(prev =>
      create(prev, draft => {
        draft.push(generateNewNode)
      })
    )

    reactFlow.setEdges(prev =>
      create(prev, draft => {
        draft.push(generateNewEdge)
      })
    )

    setFlowDetails((prev: FlowType) =>
      create(prev, draft => {
        draft.data.edges.push(generateNewEdge)
        draft.data.nodes.push(generateNewNode)
      })
    )
  }

  return {
    handleAddNode
  }
}
