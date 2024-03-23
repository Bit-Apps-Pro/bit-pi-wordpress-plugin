import { type ReactNode, useRef } from 'react'
import Draggable, { type DraggableData, type DraggableEvent } from 'react-draggable'
import { useParams } from 'react-router-dom'
import { Position, useReactFlow } from 'reactflow'

import $flowDetailsSelector, { type FlowType } from '@common/globalStates/$flowDetails'
import { $flowDynamicNode } from '@common/globalStates/$flowNodes'
import $flowMachineSelector from '@common/globalStates/flows/$flowMachineSelector'
import { select } from '@common/helpers/globalHelpers'
import { getNewId } from '@components/features/FlowBuilder/helpers/FlowBuilderHelper'
import { type ToolType } from '@features/FlowBuilder/internals/BuilderLeftSideBar/data/toolListData'
import NodeTypeDef from '@features/FlowBuilder/internals/nodeTypes/NodeTypeDef'
import { type AppType } from '@features/NodeDetailsModal/internals/AppsList/appsListData'
import { useSetAtom } from 'jotai'
import { create } from 'mutative'

type AppConfig = AppType | ToolType

interface FlowBuilderDraggableItemPropsTypes {
  children: ReactNode
  appConfig: AppConfig
  className?: string
  classNameDragging?: string
  testId?: string | undefined
  onMouseDown?: () => void
  onDrag?: () => void
  onDragStop?: (e: DraggableEvent, draggableData: DraggableData) => void
}

const hasIconURLProperty = (appConfig: AppConfig): appConfig is AppType => appConfig.type === 'node'

const defaultData = (appConfig: AppConfig, nodeId: string) => {
  switch (appConfig.type) {
    case NodeTypeDef.condition:
      return {
        nodeId,
        appSlug: 'tools',
        machineSlug: NodeTypeDef.condition,
        machineLabel: `Untitled ${nodeId}`,
        states: {
          components: [],
          conditions: [
            {
              id: `${nodeId}-0`,
              title: 'Default Condition',
              type: NodeTypeDef.defaultConditionLogic as const
            }
          ]
        }
      }
    case NodeTypeDef.delay:
      return {
        nodeId,
        appSlug: 'tools',
        machineSlug: NodeTypeDef.delay,
        states: {
          components: [],
          delay: {
            delayValue: 1,
            delayUnit: 'minutes'
          }
        }
      }
    default:
      return {
        nodeId,
        appSlug: appConfig.slug,
        appTitle: appConfig.title,
        appIcon: hasIconURLProperty(appConfig) ? appConfig.iconURL : appConfig.icon,
        appColor: appConfig.color
      }
  }
}

export default function FlowBuilderDraggableItem({
  children,
  onMouseDown = () => {},
  onDragStop = () => {},
  onDrag = () => {},
  className = '',
  classNameDragging = '',
  appConfig,
  testId = undefined
}: FlowBuilderDraggableItemPropsTypes) {
  const flowId = Number(useParams()?.flowId)
  const elementRef = useRef<HTMLDivElement>(null)
  const reactFlow = useReactFlow()
  const setFlowDetails = useSetAtom($flowDetailsSelector)
  const setFlowDynamicNode = useSetAtom($flowDynamicNode)
  const dispatchFlowMachine = useSetAtom($flowMachineSelector)

  if (Number.isNaN(flowId)) return null

  const handleDragStop = (e: DraggableEvent, draggableData: DraggableData) => {
    const draggableDataNode = draggableData.node
    const { x, y } = draggableDataNode.getBoundingClientRect()
    draggableDataNode.style.opacity = '0'
    draggableDataNode.style.removeProperty('transition')

    const flowBuilderPosition = select('#bit-flow-builder-wrp')?.getBoundingClientRect()
    const flowBuilderViewport = reactFlow.getViewport()

    if (Math.round(flowBuilderPosition?.x || 0) < Math.round(x)) {
      const draggedPositionX =
        (Math.round(x) - Math.round(flowBuilderPosition?.x || 0) - flowBuilderViewport.x) /
        flowBuilderViewport.zoom
      const draggedPositionY =
        (Math.round(y) - Math.round(flowBuilderPosition?.y || 0) - flowBuilderViewport.y) /
        flowBuilderViewport.zoom

      const nodes = reactFlow.getNodes()

      let flowNodeType = appConfig.type
      if (appConfig.type === 'node') {
        flowNodeType = NodeTypeDef.action
      }
      // check if node is first node then set it to Flow Input
      if (
        (nodes.length < 1 && appConfig.type === 'node') ||
        (nodes.findIndex(node => node.type === NodeTypeDef.action || node.type === NodeTypeDef.trigger) <
          0 &&
          appConfig.type === 'node')
      ) {
        flowNodeType = NodeTypeDef.trigger
      }

      const newId = getNewId(nodes, flowNodeType, flowId)

      const generateNewNode = {
        id: newId,
        type: flowNodeType,
        data: {},
        connectable: true,
        position: { x: draggedPositionX, y: draggedPositionY },
        sourcePosition: Position.Right,
        targetPosition: Position.Left
      }

      reactFlow.setNodes(prev =>
        create(prev, draft => {
          draft.push(generateNewNode)
        })
      )

      setFlowDetails((prevFlow: FlowType) =>
        create(prevFlow, draftFlow => {
          draftFlow.data.nodes.push(generateNewNode)
        })
      )

      // add machine to root machine
      dispatchFlowMachine({
        actionType: 'IMPORT_MACHINE',
        data: { nodeId: newId, appSlug: appConfig.slug }
      })

      if (appConfig.type !== NodeTypeDef.router) {
        setFlowDynamicNode(defaultData(appConfig, newId))
      }
    }

    draggableDataNode.style.transition = 'opacity 0.2s ease-in .1s, box-shadow 250ms'
    draggableDataNode.style.opacity = '1'

    onDragStop?.(e, draggableData)
  }

  return (
    <Draggable
      nodeRef={elementRef}
      position={{ x: 0, y: 0 }}
      onStop={handleDragStop}
      onMouseDown={onMouseDown}
      onDrag={onDrag}
      enableUserSelectHack
      defaultClassName={`flow-draggable-item ${className}`}
      defaultClassNameDragging={`flow-draggable-item-dragging ${classNameDragging}`}
    >
      <div ref={elementRef} data-testid={testId}>
        {children}
      </div>
    </Draggable>
  )
}
