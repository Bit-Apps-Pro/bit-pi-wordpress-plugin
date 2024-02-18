import { memo } from 'react'

import { $flowSetupModal } from '@common/globalStates'
import { $flowNodesFamily } from '@common/globalStates/$flowNodes'
import ComponentsRenderer from '@components/features/ComponentsRenderer'
import useFlowNode from '@features/NodeDetailsModal/data/useFlowNode'
import AppHeader from '@features/NodeDetailsModal/internals/AppHeader'
import { useAtomValue } from 'jotai'

import NodeDetailsModalWrapper from './NodeDetailsModalWrapper'
import useSaveNode from './data/useSaveNode'
import useVariables from './data/useVariables'

function NodeDetailsModal() {
  const { id: nodeId } = useAtomValue($flowSetupModal)
  const { isNodeDetailsLoading } = useFlowNode(nodeId)
  const flowNode = useAtomValue($flowNodesFamily(nodeId))
  useSaveNode(nodeId)
  useVariables()

  return (
    <NodeDetailsModalWrapper>
      <AppHeader
        appName={flowNode?.appTitle}
        actionName={flowNode?.machineLabel}
        appIcon={flowNode?.appIcon}
        appColor={flowNode?.appColor}
      />

      {!isNodeDetailsLoading && flowNode?.states?.components && (
        <ComponentsRenderer
          nodeId={nodeId}
          appName={flowNode?.appTitle}
          appSlug={flowNode?.appSlug}
          components={flowNode.states.components}
        />
      )}
    </NodeDetailsModalWrapper>
  )
}

export default memo(NodeDetailsModal)
