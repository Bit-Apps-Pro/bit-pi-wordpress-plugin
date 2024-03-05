import { type MouseEvent, type ReactElement, memo, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import ReactFlow, {
  Background,
  type Connection,
  type Edge,
  type Node as NodeDataType,
  addEdge,
  useEdgesState,
  useNodesState,
  useReactFlow,
  useStoreApi
} from 'reactflow'
import 'reactflow/dist/style.css'

import { LoadingOutlined } from '@ant-design/icons'
import { $appConfig, $nodeEdgeContextMenu, $paneContextMenu } from '@common/globalStates'
import $flowDetailsSelector, { type FlowType } from '@common/globalStates/$flowDetails'
import { isObjectEqual } from '@common/helpers/globalHelpers'
import EdgeWithBtn from '@components/features/FlowBuilder/internals/EdgeWithBtn'
import condition from '@components/features/FlowBuilder/internals/nodeTypes/ConditionNode'
import delay from '@components/features/FlowBuilder/internals/nodeTypes/Delay'
import router from '@components/features/FlowBuilder/internals/nodeTypes/FlowRouter'
import action from '@components/features/FlowBuilder/internals/nodeTypes/Node'
import trigger from '@components/features/FlowBuilder/internals/nodeTypes/TriggerNode'
import config from '@config/config'
import { useTheme } from '@emotion/react'
import NodeTypeDef from '@features/FlowBuilder/internals/nodeTypes/NodeTypeDef'
import NodeDetailsWrapper from '@features/NodeDetailsModal/NodeDetailsWrapper'
import useFetchFlowDetails from '@pages/FlowDetails/data/useFetchFlowDetails'
import FlowBuilderSkeleton from '@pages/FlowDetails/shared/FlowBuilderSkeleton'
import { Empty, Typography } from 'antd'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { create } from 'mutative'

import css from './FlowBuilder.module.css'
import {
  getNewId,
  isClosestEdgeConnectable,
  isCreatingFlowLoop,
  updateEdgeDestination
} from './helpers/FlowBuilderHelper'
import useSaveFlowDetails from './hooks/useSaveFlowDetails'
import ContextMenuProvider from './internals/ContextMenuProvider'

const nodeTypes = {
  trigger,
  action,
  router,
  delay,
  condition
}

const edgeTypes = { default: EdgeWithBtn }

const MIN_DISTANCE = 150

function FlowBuilder({ children }: { children: ReactElement }) {
  const flowId = Number(useParams()?.flowId)
  const [flow, setFlow] = useAtom($flowDetailsSelector)
  const [nodes, setNodes, onNodesChange] = useNodesState(flow?.data?.nodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(flow?.data?.edges)
  const { isNotFound, isFlowLoading, isFlowFetching } = useFetchFlowDetails(flowId, setNodes, setEdges)
  const setNodeEdgeContextMenu = useSetAtom($nodeEdgeContextMenu)
  const setPaneContextMenu = useSetAtom($paneContextMenu)
  const { isDarkTheme } = useAtomValue($appConfig)
  const { token } = useTheme()
  const reactFlow = useReactFlow()
  const { getEdges } = reactFlow
  const store = useStoreApi()

  if (config.IS_DEV) {
    if (!window.appState) {
      window.appState = {
        flowState: {
          edges,
          nodes,
          viewport: reactFlow.getViewport(),
          setViewport: reactFlow.setViewport
        }
      }
    } else {
      window.appState.flowState = {
        edges,
        nodes,
        viewport: reactFlow.getViewport(),
        setViewport: reactFlow.setViewport
      }
    }
  }

  const closePaneContextMenu = () => {
    setPaneContextMenu({
      isOpen: false,
      clientX: 0,
      clientY: 0
    })
  }

  const onConnect = useCallback((params: Connection) => {
    const generateEdgeId = getNewId(getEdges(), 'edge')
    const newEdge = { ...params, id: generateEdgeId, className: 'edge' } as Edge
    setEdges((eds: Edge[]) => addEdge({ ...newEdge }, eds))

    setFlow((prevFlow: FlowType) =>
      create(prevFlow, draftFlow => {
        if (newEdge) draftFlow.data.edges.push({ ...newEdge })

        return draftFlow
      })
    )
  }, [])

  const closeContextMenu = () =>
    setNodeEdgeContextMenu({
      isOpen: false,
      id: '',
      type: '',
      clientX: 0,
      clientY: 0
    })

  const edgeContextMenuOpen = (e: MouseEvent, edge: Edge) => {
    e.preventDefault()

    setNodeEdgeContextMenu({
      isOpen: true,
      id: edge.id,
      type: 'edge',
      clientX: e.clientX,
      clientY: e.clientY
    })
  }

  const nodeContextMenuOpen = (e: MouseEvent, node: NodeDataType) => {
    e.preventDefault()
    closePaneContextMenu()
    setNodeEdgeContextMenu({
      isOpen: true,
      id: node.id,
      type: node.type || '',
      clientX: e.clientX,
      clientY: e.clientY
    })
  }

  const onEdgeUpdate = (oldEdge: Edge, newConnection: Connection) => {
    const { source, sourceHandle, target } = newConnection

    if (source === target) return false

    const isLeftOrRightHandle = oldEdge.target === newConnection.target ? 'left' : 'right'

    if (isLeftOrRightHandle === 'right') {
      const alreadySourceConnected = edges.find(edge => edge.target === target)
      if (alreadySourceConnected) return false

      const checkIsCreatingFlowLoop = isCreatingFlowLoop(source, target, edges)
      if (checkIsCreatingFlowLoop) return false
    }

    if (isLeftOrRightHandle === 'left') {
      const newConnectNodeType = nodes.find(node => node.id === source)?.type

      if (newConnectNodeType === NodeTypeDef.condition) {
        const alreadySourceHandleConnected = edges.find(
          edge => edge.sourceHandle === sourceHandle && edge.source === source
        )
        if (alreadySourceHandleConnected) return false
      }

      if (newConnectNodeType === NodeTypeDef.action || newConnectNodeType === NodeTypeDef.trigger) {
        const alreadySourceConnected = edges.find(edge => edge.source === source)
        if (alreadySourceConnected) return false
      }
    }

    const { edges: updatedEdges } = updateEdgeDestination(oldEdge, newConnection, edges)

    setEdges(updatedEdges)

    setFlow((prevFlow: FlowType) =>
      create(prevFlow, draftFlow => {
        draftFlow.data.edges = updatedEdges // eslint-disable-line no-param-reassign

        return draftFlow
      })
    )
  }

  const onPaneClick = () => {
    closeContextMenu()
    closePaneContextMenu()
  }

  const onPaneContextMenu = (event: MouseEvent) => {
    event.preventDefault()
    closeContextMenu()
    setPaneContextMenu({
      isOpen: true,
      clientX: event.clientX,
      clientY: event.clientY
    })
  }

  const getClosestEdge = useCallback((node: NodeDataType): Edge | null => {
    const { nodeInternals } = store.getState()
    const storeNodes = Array.from(nodeInternals.values())

    const closestNode = storeNodes.reduce(
      (res: { distance: number; node: null | NodeDataType }, n: NodeDataType) => {
        if (n.id !== node.id && n.positionAbsolute && node.positionAbsolute) {
          let extYSpc = 0
          const nWidth = n?.width || 0
          const nHeight = n?.height || 0

          if (n.type === 'condition') extYSpc = nHeight - 68

          const dx = n.positionAbsolute.x + nWidth - node.positionAbsolute.x
          const dy = n.positionAbsolute.y + extYSpc - node.positionAbsolute.y
          const d = Math.sqrt(dx * dx + dy * dy)

          if (d < res.distance && d < MIN_DISTANCE) {
            res.distance = d
            res.node = n
          }
        }

        return res
      },
      {
        distance: Number.MAX_VALUE,
        node: null
      }
    )

    if (!closestNode.node) {
      return null
    }

    const getSourceHandle = (cNode: NodeDataType) => {
      if (cNode.type === 'condition') return `${cNode.id}-0`

      return 'right'
    }

    return {
      className: 'temp',
      id: `${node.id}-temp`,
      source: closestNode.node.id,
      sourceHandle: getSourceHandle(closestNode.node),
      target: node.id,
      targetHandle: 'left'
    }
  }, [])

  const hasPrevNode = (nodeId: string) =>
    reactFlow.getEdges().findIndex(item => item.target === nodeId && item.className !== 'temp') !== -1

  const onNodeDrag = useCallback(
    (_: MouseEvent, node: NodeDataType) => {
      if (hasPrevNode(node.id)) return

      const closeEdge = getClosestEdge(node)
      setEdges(prev => {
        const withoutTemp = prev.filter(edge => edge.className !== 'temp')
        if (closeEdge && isClosestEdgeConnectable(node.id, withoutTemp, closeEdge)) {
          withoutTemp.push(closeEdge)
        }

        return withoutTemp
      })
    },
    [getClosestEdge, setEdges]
  )

  const handleNodeDragStop = (_: MouseEvent, node: NodeDataType) => {
    const nodeIndex = flow.data.nodes.findIndex((item: NodeDataType) => item.id === node.id)

    if (isObjectEqual(node.position, flow.data.nodes[nodeIndex].position)) return

    setEdges(prev =>
      create(prev, draft => {
        const edgeIndex = draft.findIndex(e => e.className === 'temp')
        if (edgeIndex !== -1) {
          draft[edgeIndex].className = 'edge'
          draft[edgeIndex].id = getNewId(getEdges(), 'edge')
        }
      })
    )

    setFlow(prev =>
      create(prev, draft => {
        draft.data.nodes[nodeIndex].position = node.position
        draft.data.nodes[nodeIndex].positionAbsolute = node.positionAbsolute

        if (!hasPrevNode(node.id)) {
          const closeEdge = getClosestEdge(node)
          if (closeEdge && isClosestEdgeConnectable(node.id, draft.data.edges, closeEdge)) {
            closeEdge.id = getNewId(getEdges(), 'edge')
            closeEdge.className = 'edge'
            draft.data.edges.push(closeEdge)
          }
        }
      })
    )
  }

  useSaveFlowDetails()

  if (isNotFound || Number.isNaN(flowId)) return <Empty className="mt-4" />
  if (isFlowLoading) return <FlowBuilderSkeleton />

  return (
    <div id="bit-flow-builder-wrp" className={css.flowBuilderWrapper}>
      <div className={css.flowBuilderInner}>
        {isFlowFetching && (
          <div className={css.loading} css={{ backgroundColor: token.colorFillSecondary }}>
            <Typography.Title level={4}>
              <LoadingOutlined /> Loading...
            </Typography.Title>
          </div>
        )}

        {children}

        <ContextMenuProvider>
          <NodeDetailsWrapper>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              nodeTypes={nodeTypes}
              edgeTypes={edgeTypes}
              onMove={closeContextMenu}
              onPaneClick={onPaneClick}
              selectNodesOnDrag={false}
              onEdgeContextMenu={edgeContextMenuOpen}
              onNodeContextMenu={nodeContextMenuOpen}
              onEdgeUpdate={onEdgeUpdate}
              onPaneContextMenu={onPaneContextMenu}
              // onMoveEnd={handleMoveEnd}
              onNodeDrag={onNodeDrag}
              onNodeDragStop={handleNodeDragStop}
              // connectionLineComponent
              // defaultZoom={1}
              // fitView
              // attributionPosition="bottom-left"
            >
              <Background
                css={{ background: isDarkTheme ? 'transparent' : token.colorBgContainer }}
                color={token.colorBorder}
                size={2}
                gap={18}
              />
            </ReactFlow>
          </NodeDetailsWrapper>
        </ContextMenuProvider>
      </div>
    </div>
  )
}

export default memo(FlowBuilder)
