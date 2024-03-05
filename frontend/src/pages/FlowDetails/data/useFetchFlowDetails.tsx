import { type Edge, type Node } from 'reactflow'

import { $flowSetupModal } from '@common/globalStates'
import { $flowDetails, type FlowType } from '@common/globalStates/$flowDetails'
import $flowNodes, { type FlowNodeType } from '@common/globalStates/$flowNodes'
import { type FlowMachineStatesType } from '@common/globalStates/flows/FlowMachineType'
import request from '@common/helpers/request'
import { getAppBySlug } from '@features/FlowBuilder/helpers/FlowBuilderHelper'
import { type AppsSlugType } from '@features/NodeDetailsModal/internals/AppsList/appsListData'
import { useQuery } from '@tanstack/react-query'
import { useAtomValue, useSetAtom } from 'jotai'
import { castDraft, create } from 'mutative'

interface NodeType {
  id: string
  flow_id: string
  node_id: string
  app_slug: string
  machine_slug: string
  machine_label: string
  data: FlowMachineStatesType
}
interface FlowTypeWithNodes extends FlowType {
  nodes: NodeType[]
}

type SetNodesType = React.Dispatch<React.SetStateAction<Node<any, string | undefined>[]>> // eslint-disable-line @typescript-eslint/no-explicit-any
type SetEdgesType = React.Dispatch<React.SetStateAction<Edge<any>[]>> // eslint-disable-line @typescript-eslint/no-explicit-any

const getNodeData = (node: NodeType): FlowNodeType => {
  if (node.app_slug === 'tools') {
    return {
      appSlug: node.app_slug as AppsSlugType,
      machineSlug: node.machine_slug,
      machineLabel: node.machine_label,
      states: node.data
    }
  }

  const { title, iconURL, color } = getAppBySlug(node.app_slug) || {}
  return {
    appTitle: title,
    appIcon: iconURL,
    appColor: color,
    machineLabel: node.machine_label
  }
}

export default function useFetchFlowDetails(
  flowId: number,
  setNodes: SetNodesType,
  setEdges: SetEdgesType
) {
  const setFlow = useSetAtom($flowDetails)
  const setFlowNodes = useSetAtom($flowNodes)
  const { isOpen, id } = useAtomValue($flowSetupModal)

  const { isLoading, data, isFetching, isError } = useQuery({
    queryKey: ['flows', flowId],
    queryFn: async () => {
      const res = await request<FlowTypeWithNodes>(`flows/${flowId}`, null, null, 'GET')

      const flowData = res.data
      if (res.status === 'success' && typeof flowData?.id !== 'undefined') {
        // set flow details
        setFlow(flowData)
        if (flowData.data?.nodes) setNodes(flowData.data.nodes)
        if (flowData.data?.edges) setEdges(flowData.data.edges)

        // set flow nodes
        flowData.nodes?.forEach(node => {
          setFlowNodes(prev =>
            create(prev, draft => {
              draft[node.node_id] = castDraft(getNodeData(node))
            })
          )
        })
      }

      return res
    },
    enabled: !!flowId && !Number.isNaN(flowId),
    refetchOnWindowFocus: !isOpen && !id
  })

  return {
    isFlowLoading: isLoading,
    isFlowFetching: isFetching,
    flowDetails: data?.data,
    isError,
    isNotFound: data?.status === 'error'
  }
}
