import { memo } from 'react'
import { type Connection, Handle, type NodeProps, Position, useEdges, useNodes } from 'reactflow'

import { $flowSetupModal } from '@common/globalStates'
import { $flowNodesFamily } from '@common/globalStates/$flowNodes'
import { edgeConnectionValidation } from '@components/features/FlowBuilder/helpers/FlowBuilderHelper'
import NodeContent from '@features/FlowBuilder/internals/NodeContent'
import AddNode from '@features/FlowBuilder/internals/nodeTypes/AddNode'
import cls from '@features/FlowBuilder/internals/nodeTypes/Node/Node.module.css'
import { useAtomValue, useSetAtom } from 'jotai'

function TriggerNode({ id: nodeId, type, isConnectable }: NodeProps) {
  const setBuilderModal = useSetAtom($flowSetupModal)
  const { appTitle, appIcon, appColor, machineLabel } = useAtomValue($flowNodesFamily(nodeId)) || {}
  const edges = useEdges()
  const nodes = useNodes()

  const isValidConnection = (currentHandle: string) => (connection: Connection) =>
    edgeConnectionValidation(connection, edges, nodes, type, currentHandle)

  return (
    <>
      <NodeContent
        triggerNode
        icon={appIcon}
        color={appColor}
        title={appTitle || 'Select an app'}
        subTitle={machineLabel}
        badgeText={nodeId}
        onEditClick={() => setBuilderModal({ id: nodeId, type, isOpen: true })}
      />

      <AddNode nodeId={nodeId} />

      <Handle
        className={`${cls.outputHandle} ${cls.handleRight}`}
        type="source"
        position={Position.Right}
        id="right"
        isConnectable={isConnectable}
        isValidConnection={isValidConnection('right')}
      />
    </>
  )
}

export default memo(TriggerNode)
