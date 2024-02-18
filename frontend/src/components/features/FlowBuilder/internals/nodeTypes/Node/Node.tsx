import { memo } from 'react'
import { type Connection, Handle, type NodeProps, Position, useEdges, useNodes } from 'reactflow'

import { $flowSetupModal } from '@common/globalStates'
import { $flowNodesFamily } from '@common/globalStates/$flowNodes'
import { edgeConnectionValidation } from '@components/features/FlowBuilder/helpers/FlowBuilderHelper'
import withNodeDelete from '@features/FlowBuilder/helpers/withNodeDelete'
import NodeContent from '@features/FlowBuilder/internals/NodeContent'
import AddNode from '@features/FlowBuilder/internals/nodeTypes/AddNode'
import { useAtomValue, useSetAtom } from 'jotai'

import cls from './Node.module.css'

interface NodePropsType extends NodeProps {
  deleteNode: (id: string) => void
}

function Node({ id: nodeId, type, isConnectable, deleteNode }: NodePropsType) {
  const edges = useEdges()
  const nodes = useNodes()
  const setBuilderModal = useSetAtom($flowSetupModal)
  const { appTitle, appIcon, appColor, machineLabel } = useAtomValue($flowNodesFamily(nodeId)) || {}

  const isValidConnection = (currentHandle: string) => (connection: Connection) =>
    edgeConnectionValidation(connection, edges, nodes, type, currentHandle)

  return (
    <>
      <NodeContent
        icon={appIcon}
        color={appColor}
        title={appTitle || 'Select an app'}
        subTitle={machineLabel}
        badgeText={nodeId}
        onEditClick={() => setBuilderModal({ id: nodeId, type, isOpen: true })}
        onDeleteClick={() => deleteNode(nodeId)}
      />

      <AddNode nodeId={nodeId} />

      <Handle
        className={`${cls.outputHandle} ${cls.handleLeft}`}
        type="target"
        position={Position.Left}
        id="left"
        data-node="action-left"
        isConnectable={isConnectable}
        isValidConnection={isValidConnection('left')}
      />
      <Handle
        className={`${cls.outputHandle} ${cls.handleRight}`}
        type="source"
        position={Position.Right}
        id="right"
        data-node="action-right"
        isConnectable={isConnectable}
        isValidConnection={isValidConnection('right')}
      />
    </>
  )
}

export default withNodeDelete(memo(Node))
