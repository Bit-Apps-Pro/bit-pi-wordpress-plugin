import { type Connection, type Edge, type HandleElement, type Node, type Position } from 'reactflow'

import { type FlowMachineRootType } from '@common/globalStates/flows/FlowMachineType'
import { type ToolType } from '@features/FlowBuilder/internals/BuilderLeftSideBar/data/toolListData'
import { type ConditionType } from '@features/FlowBuilder/internals/ConditionItem/ConditionItem'
import { type ConditionTypes } from '@features/FlowBuilder/internals/ConditionItem/ConditionalType'
import NodeTypeDef from '@features/FlowBuilder/internals/nodeTypes/NodeTypeDef'
import appsListData, {
  type AppType,
  type AppsSlugType
} from '@features/NodeDetailsModal/internals/AppsList/appsListData'
import { create } from 'mutative'

interface NodeSourceType {
  id: string
  position: Position
  height: number
  width: number
  x: number
  y: number
}

export interface FlowMapType {
  id: string
  type: string
  conditionId?: string | null
  next?: this | this[]
  previous?: string | null
  conditionIds?: string[]
}

interface CreateFlowMapPropsType {
  flowMap?: FlowMapType
  currentEdge: CustomEdgeType | undefined
  nodes: Node[]
  edges: Edge[]
}

export interface SearchInAppsAndToolsType {
  apps: AppType[]
  tools: ToolType[]
}

type CustomEdgeType = { isUsed?: boolean } & Edge

const edgeInfoBySource = (sourceNode: string, edges: Edge[]) =>
  edges.find(edge => edge.target === sourceNode)

export const isCreatingFlowLoop = (source: string | null, target: string | null, edges: Edge[]) => {
  let isSameFlow = false
  let sourceNode = source || undefined
  edges.map(() => {
    const edgeInfo = edgeInfoBySource(sourceNode || '', edges)
    if (edgeInfo?.source === target) isSameFlow = true
    sourceNode = edgeInfo?.source
  })
  return isSameFlow
}

const edgeInfoByTarget = (nodeTarget: string, edges: Edge[]) =>
  edges.find(edge => edge.source === nodeTarget)

/*
  returns a new node id based on existing nodes
  @param {array} of {object} of Node
  returns string of nodeIds
*/
export function getNewId(
  arr: Edge[] | Node[] | NodeSourceType[] | HandleElement[] | ConditionTypes[],
  type?: string,
  currentFlowId?: number | string | null
): string {
  if (type === NodeTypeDef.trigger) return `${currentFlowId || 'NODE_ID'}-1`

  let lastId = 0
  arr?.forEach((item: Edge | Node | NodeSourceType | HandleElement | ConditionTypes) => {
    const valuesArr = item?.id?.split('-')
    const id = valuesArr?.reverse()?.[0]
    const idAsNum = Number(id || 0)
    if (idAsNum > lastId) lastId = idAsNum
  })

  if (type !== 'edge' && currentFlowId) return `${currentFlowId}-${lastId + 1}`
  if (type) return `${type.toLowerCase()}-${lastId + 1}`
  return `${lastId + 1}`
}

function isConnectedSourceHandleEdgeIndex(edges: Edge[], source: string, sourceHandle: string) {
  const alreadyConnectedEdgeIndex = edges.findIndex(edge => {
    if (edge.source === source) {
      if (edge.sourceHandle === sourceHandle) {
        return true
      }
    }
  })
  return alreadyConnectedEdgeIndex
}

function isSourceAlreadyConnectedExceptRouter(
  source: string,
  sourceHandle: string,
  _target: string,
  edges: Edge[],
  nodes: Node[],
  type: string,
  currentHandle: string
) {
  if (currentHandle === 'right' && type === NodeTypeDef.router) return true

  if (currentHandle === 'left') {
    const targetNodeType = nodes?.find(node => node.id === source)?.type
    if (targetNodeType === NodeTypeDef.router) return true
    if (targetNodeType === NodeTypeDef.condition) {
      const alreadyConnectedEdgeIndex = isConnectedSourceHandleEdgeIndex(edges, source, sourceHandle)
      if (alreadyConnectedEdgeIndex === -1) return true
    }
  }

  if (edges.findIndex(edge => edge.source === source) === -1) return true

  if (
    type === NodeTypeDef.condition ||
    type === NodeTypeDef.conditionLogic ||
    type === NodeTypeDef.defaultConditionLogic
  ) {
    const alreadyConnectedEdgeIndex = isConnectedSourceHandleEdgeIndex(edges, source, sourceHandle)
    if (alreadyConnectedEdgeIndex === -1) return true
  }

  return false
}

function isTargetNotConnectedWithOther(_source: string, target: string, edges: Edge[]) {
  if (edges.findIndex(edge => edge.target === target) === -1) return true
}

export function edgeConnectionValidation(
  connection: Connection,
  edges: Edge[],
  nodes: Node[],
  type: string,
  currentHandle: string
): boolean {
  const { source, target, sourceHandle } = connection
  if (!source || !target || !sourceHandle) return false

  if (source === target) return false

  const cond1 = isSourceAlreadyConnectedExceptRouter(
    source,
    sourceHandle,
    target,
    edges,
    nodes,
    type,
    currentHandle
  )
  const cond2 = isTargetNotConnectedWithOther(source, target, edges)
  const cond3 = isCreatingFlowLoop(source, target, edges)

  if (cond1 && cond2 && !cond3) return true
  return false
}

export function flowRouterEdgeConnectionValidation(
  source: string | null,
  target: string | null,
  edges: Edge[]
) {
  const checkAlreadyHasTarget = edges.find(edge => edge.target === target)

  let isSameFlow = false
  let targetNode = target || undefined
  edges.map(() => {
    const edgeInfo = edgeInfoByTarget(targetNode || '', edges)

    if (edgeInfo?.target === source) isSameFlow = true
    targetNode = edgeInfo?.target
  })

  if (source !== target && !checkAlreadyHasTarget && !isSameFlow) return true
  return false
}

export const updateEdgeDestination = (
  oldEdge: Edge,
  newConnection: Connection,
  edges: Edge[]
): { edges: Edge[]; updatedEdge?: Edge } => {
  if (!newConnection.source || !newConnection.target) {
    // eslint-disable-next-line no-console
    console.warn("Can't create new edge. An edge needs a source and a target.")
    return { edges }
  }

  const foundEdge = edges.find(e => e.id === oldEdge.id) as Edge

  if (!foundEdge) {
    // eslint-disable-next-line no-console
    console.warn(`The old edge with id=${oldEdge.id} does not exist.`)
    return { edges }
  }

  // Remove old edge and create the new edge with parameters of old edge.
  const edge = {
    ...oldEdge,
    // id: getNewId(edges, 'edge'),
    source: newConnection.source,
    target: newConnection.target,
    sourceHandle: newConnection.sourceHandle,
    targetHandle: newConnection.targetHandle
  } as Edge
  return {
    edges: edges.filter(e => e.id !== oldEdge.id).concat(edge),
    updatedEdge: edge
  }
}

export function searchInApps(searchTerm: string, apps: AppType[]) {
  return apps.filter(app => {
    const matchSearchedTitle = app.title.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase())

    const matchSearchedInTags = app.tags.find(tag =>
      tag.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase())
    )

    if (matchSearchedTitle || matchSearchedInTags) {
      return app
    }
  })
}

export function searchInTools(searchTerm: string, tools: ToolType[]) {
  return tools.filter(tool => {
    const matchSearchedTitle = tool.title.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase())

    const matchSearchedInTags = tool.tags.find(tag =>
      tag.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase())
    )

    if (matchSearchedTitle || matchSearchedInTags) {
      return tool
    }
  })
}

export function searchInAppsAndTools(
  searchTerm: string,
  apps: AppType[],
  tools: ToolType[]
): SearchInAppsAndToolsType {
  const searchedApps: AppType[] = searchInApps(searchTerm, apps)
  const searchedTools: ToolType[] = searchInTools(searchTerm, tools)

  return { apps: searchedApps, tools: searchedTools }
}

export const calculateDefaultConditionPos = (
  totalConditions: number,
  divHeight: number,
  newConditionHeight: number,
  extraArea: number
) => {
  const defaultConditionHandlePos = divHeight + newConditionHeight * totalConditions - extraArea
  return defaultConditionHandlePos
}

export function getAppBySlug(slug: string | undefined): AppType | undefined {
  if (!slug) return
  return appsListData.find((app: AppType) => app.slug === slug) as AppType
}

export function getNodeById(nodeId: string | undefined, flowNodes: Node[]) {
  if (!nodeId) return
  return flowNodes?.find((node: Node) => node.id === nodeId)
}

export async function getFlowNodeDetailsBySlugs(appSlug: AppsSlugType, machineSlug: string) {
  const { default: machineConfigs }: { default: FlowMachineRootType } = await import(
    `../../../../common/globalStates/flows/machines/${appSlug}/_${appSlug}Machines.ts`
  ).catch(console.log)

  return machineConfigs.machines.find(machine => machine.machineSlug === machineSlug) || {}
}

export function getEdgeBySource(edgeId: string, flowEdges: Edge[]) {
  return flowEdges?.find((edge: Edge) => edge.source === edgeId)
}

export function getEdgeByTarget(edgeId: string, flowEdges: Edge[]) {
  return flowEdges?.find((edge: Edge) => edge.target === edgeId)
}

export function getEdgesBySource(edgeId: string, flowEdges: Edge[]) {
  return flowEdges?.filter((edge: Edge) => edge.source === edgeId)
}

export function getConditionBySourceHandleId(conditionId: string, node: Node | undefined) {
  if (!node) return
  return node?.data.conditions?.find((condition: ConditionType) => condition.id === conditionId)
}

export function createFlowMap({
  currentEdge,
  nodes,
  edges,
  flowMap = { id: '', type: '' }
}: CreateFlowMapPropsType): FlowMapType {
  if (!currentEdge) {
    console.error('FlowBuilder:createFlowMap: missing currentEdge') // eslint-disable-line no-console
    return { type: '', id: '', previous: null }
  }

  const previousEdge = getEdgeByTarget(currentEdge.source, edges)
  const currentNode = getNodeById(currentEdge.source, nodes)
  const previousNode = getNodeById(previousEdge?.source, nodes)

  if (previousNode?.type === NodeTypeDef.condition && !currentEdge.isUsed) {
    const condition = getConditionBySourceHandleId(previousEdge?.sourceHandle || '', previousNode)

    const prepareNext = create(currentEdge, (draftEdge: CustomEdgeType) => {
      draftEdge.isUsed = true
      return draftEdge
    })

    flowMap.type = condition?.type
    flowMap.id = condition?.id
    flowMap.previous = previousEdge ? previousEdge.source : null

    flowMap.next = createFlowMap({
      currentEdge: prepareNext,
      nodes,
      edges
    })

    return flowMap
  }

  const previousNodeOrConditionLogicId = currentEdge.isUsed
    ? previousEdge?.sourceHandle
    : previousEdge?.source

  flowMap.type = currentNode?.type || ''
  flowMap.id = currentNode?.id || ''
  flowMap.previous = previousNodeOrConditionLogicId || null

  if (currentNode?.type === NodeTypeDef.condition) {
    const edgesOfConditionNode = getEdgesBySource(currentEdge.source || '', edges)

    const conditionLogicIds = edgesOfConditionNode.map((edge: Edge) => edge.sourceHandle || '')
    flowMap.conditionIds = conditionLogicIds

    flowMap.next = edgesOfConditionNode.map(edge => {
      const conditionId = edge.sourceHandle
      const nextEdge = getEdgeBySource(edge.target, edges)
      if (!nextEdge) {
        const nodeBySource = getNodeById(edge.source, nodes)
        const targetLastNode = getNodeById(edge.target, nodes)
        const conditionBySourceHandleId = getConditionBySourceHandleId(conditionId || '', nodeBySource)

        if (conditionBySourceHandleId) {
          return {
            type: conditionBySourceHandleId.type || '',
            id: conditionBySourceHandleId.id || '',
            next: {
              id: targetLastNode?.id || '',
              type: targetLastNode?.type || '',
              previous: conditionBySourceHandleId.id
            },
            previous: edge.source
          }
        }
      }
      return createFlowMap({
        currentEdge: nextEdge,
        nodes,
        edges
      })
    })
    return flowMap
  }

  if (currentNode?.type === NodeTypeDef.router) {
    const edgesOfRouterNode = getEdgesBySource(currentEdge.source, edges)

    flowMap.next = edgesOfRouterNode.map(edge => {
      const nextEdge = getEdgeBySource(edge.target, edges)
      if (!nextEdge) {
        const routerTargetedNode = getNodeById(edge.target, nodes)
        if (routerTargetedNode) {
          return {
            type: routerTargetedNode.type || '',
            id: routerTargetedNode.id,
            previous: edge.source
          }
        }
      }
      return createFlowMap({
        currentEdge: nextEdge,
        nodes,
        edges
      })
    })
    return flowMap
  }

  const nextEdge = getEdgeBySource(currentEdge.target, edges)
  if (!nextEdge) {
    const nodeByTarget = getNodeById(currentEdge.target, nodes)
    if (nodeByTarget) {
      flowMap.next = {
        id: nodeByTarget.id || '',
        type: nodeByTarget.type || '',
        previous: currentEdge.source
      }
    }
    return flowMap
  }

  flowMap.next = createFlowMap({
    currentEdge: nextEdge,
    nodes,
    edges
  })
  return flowMap
}

export const extractNodeId = (nodeId: string) => Number(nodeId.split('-')[1])

export function getPrevConnectedNodeIds(nodeId: string, flowTree: FlowMapType, separator = ',') {
  const queue = [flowTree]
  const previousNodeIds: Record<string, string> = {}

  while (queue.length) {
    const node = queue.shift()
    if (!node) return ''

    if (node.next) {
      if (Array.isArray(node.next)) {
        queue.push(...node.next)
      } else {
        queue.push(node.next)
      }
    }

    if (node.previous) {
      let prefix = ''
      if (previousNodeIds[node.previous]) {
        prefix = `${previousNodeIds[node.previous]}${separator}`
      }
      previousNodeIds[node.id] = `${prefix}${node.previous}`
    }

    if (node.id === nodeId) {
      break
    }
  }

  return previousNodeIds[nodeId] || ''
}

/**
 * check if the node edges are making loop
 * @param nodeId string
 * @param edges Edge[]
 * @param closestEdge Edge
 * @returns boolean
 */
export const isMakingEdgeLoop = (nodeId: string, edges: Edge[], closestEdge: Edge) => {
  const isLoop = (sourceId: string): boolean => {
    const nodeHasTargetEdge = edges.find(edge => edge.source === sourceId)

    if (nodeHasTargetEdge) return isLoop(nodeHasTargetEdge.target)

    return sourceId === closestEdge.source
  }

  const nodeHasEdge = edges.find(edge => edge.source === nodeId)

  return nodeHasEdge ? isLoop(nodeHasEdge.target) : false
}

/**
 * check if closest edge in connectable to the node
 * @param nodeId string
 * @param edges Edge[]
 * @param closestEdge Edge
 * @returns boolean
 */
export const isClosestEdgeConnectable = (nodeId: string, edges: Edge[], closestEdge: Edge) => {
  if (isMakingEdgeLoop(nodeId, edges, closestEdge)) return false

  return !edges.find(edge => edge.source === closestEdge.source || edge.target === closestEdge.target)
}
