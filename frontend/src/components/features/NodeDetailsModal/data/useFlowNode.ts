import { useParams } from 'react-router-dom'

import $flowNodes, { type FlowNodeType } from '@common/globalStates/$flowNodes'
import $flowMachineSelector from '@common/globalStates/flows/$flowMachineSelector'
import { type FlowMachineStatesType } from '@common/globalStates/flows/FlowMachineType'
import { deepCopy } from '@common/helpers/globalHelpers'
import request from '@common/helpers/request'
import { type ConnectionType } from '@features/Connection/data/ConnectionQueryType'
import { getFlowNodeDetailsBySlugs } from '@features/FlowBuilder/helpers/FlowBuilderHelper'
import NodeTypeDef from '@features/FlowBuilder/internals/nodeTypes/NodeTypeDef'
import { type AppsSlugType } from '@features/NodeDetailsModal/internals/AppsList/appsListData'
import { useQuery } from '@tanstack/react-query'
import merge from 'deepmerge-alt'
import { useAtom, useSetAtom } from 'jotai'
import { create } from 'mutative'

interface NodeType {
  id: number
  app_slug: AppsSlugType
  machine_slug: string
  data: FlowMachineStatesType
}
interface FetchedFlowNodeType {
  node: NodeType
  connections: ConnectionType[]
}

export default function useFlowNode(nodeId: string) {
  const [flowNode, setFlowNode] = useAtom($flowNodes)
  const flowId = Number(useParams()?.flowId)
  const dispatchFlowMachine = useSetAtom($flowMachineSelector)

  const { data, isLoading } = useQuery({
    queryKey: ['flow_node', flowId, nodeId],
    queryFn: async () => request<FetchedFlowNodeType>(`node/${flowId}/${nodeId}`, null, null, 'GET'),
    enabled: !!flowId && !!nodeId && !!flowNode[nodeId]?.appTitle && !Number.isNaN(flowId),
    onSuccess: async res => {
      if (res.status === 'error') return
      const { node, connections } = res.data

      const setExistingData = async () => {
        dispatchFlowMachine({
          actionType: 'IMPORT_MACHINE',
          data: { nodeId, appSlug: node.app_slug, nodeType: NodeTypeDef.action }
        })
        if (node.machine_slug === '') return
        const flowNodeData: FlowNodeType = await getFlowNodeDetailsBySlugs(
          node.app_slug,
          node.machine_slug
        )
        setFlowNode(prev => {
          const flowNodeDetails = deepCopy({ ...flowNodeData, ...prev[nodeId] })
          const mergedFlowNode = merge(flowNodeDetails, { states: node.data })

          return create(prev, draft => {
            draft[nodeId] = create(mergedFlowNode, draft2 => {
              draft2.states.connections = connections
            })
          })
        })
      }

      setExistingData()
    }
  })

  return {
    nodeDetails: data,
    isNodeDetailsLoading: isLoading
  }
}
