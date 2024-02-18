import { useParams } from 'react-router-dom'

import { $flowNodesFamily, type FlowNodeType } from '@common/globalStates/$flowNodes'
import $flowSaving from '@common/globalStates/$flowSaving'
import { getFieldMapping, getFlowNodeData } from '@common/helpers/flowMachineUtils'
import request from '@common/helpers/request'
import useMemoDebounce from '@features/FlowBuilder/hooks/useMemoDebounce'
import { useAtomValue, useSetAtom } from 'jotai'

export const nodeData = (flowId: number, nodeId: string, flowNode: FlowNodeType) => ({
  flow_id: flowId,
  node_id: nodeId,
  app_slug: flowNode.appSlug,
  machine_slug: flowNode.machineSlug || null,
  machine_label: flowNode.machineLabel || null,
  field_mapping: getFieldMapping(flowNode.states?.components),
  data: getFlowNodeData(flowNode.states)
})

export default function useSaveNode(nodeId: string) {
  const flowNode = useAtomValue($flowNodesFamily(nodeId))
  const flowId = Number(useParams()?.flowId)
  const setFlowSaving = useSetAtom($flowSaving)

  useMemoDebounce(
    async () => {
      setFlowSaving(true)
      await request('node/save', nodeData(flowId, nodeId, flowNode))
      setFlowSaving(false)
    },
    500,
    [flowNode]
  )
}
