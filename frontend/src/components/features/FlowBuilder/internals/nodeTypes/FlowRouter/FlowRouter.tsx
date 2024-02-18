import { memo } from 'react'
import { type Connection, Handle, type NodeProps, Position, useEdges, useNodes } from 'reactflow'

import { edgeConnectionValidation } from '@components/features/FlowBuilder/helpers/FlowBuilderHelper'
import withNodeDelete from '@features/FlowBuilder/helpers/withNodeDelete'
import useAddNode from '@features/FlowBuilder/hooks/useAddNode'
import cls from '@features/FlowBuilder/internals/NodeContent/NodeContent.module.css'
import LucideIcn from '@icons/LucideIcn'
import RouterIcn from '@icons/RouterIcn'
import { Button, Popconfirm, theme } from 'antd'

import css from './FlowRouter.module.css'

interface NodePropsType extends NodeProps {
  deleteNode: (id: string) => void
}

function FlowRouter({ id, type, isConnectable, deleteNode }: NodePropsType) {
  const { token } = theme.useToken()
  const { handleAddNode } = useAddNode(id, 180)
  const edges = useEdges()
  const nodes = useNodes()

  const isValidConnection = (currentHandle: string) => (connection: Connection) =>
    edgeConnectionValidation(connection, edges, nodes, type, currentHandle)

  return (
    <>
      <div className={`${cls.nodeWrp}`} data-testid="flow-node" data-node-id={id}>
        <div className={`${css.router}`}>
          <Button
            type="text"
            onClick={handleAddNode('multiple')}
            icon={<LucideIcn name="plus" size={42} />}
            className={css.addBtn}
          />
          <RouterIcn className={css.routerIcon} />
        </div>
        <div className={css.actions} css={{ backgroundColor: token.colorBgContainer, borderRadius: 50 }}>
          <Popconfirm
            onConfirm={() => deleteNode(id)}
            okText="Yes"
            cancelText="No"
            title="Delete the router"
            description="Are you sure to delete this router?"
            icon={<LucideIcn name="trash-2" color="red" />}
          >
            <Button type="text" shape="circle" icon={<LucideIcn name="trash-2" />} />
          </Popconfirm>
        </div>
      </div>

      <Handle
        className={`${cls.outputHandle} ${cls.handleLeft}`}
        type="target"
        position={Position.Left}
        id="left"
        data-node="tools-left"
        isConnectable={isConnectable}
        isValidConnection={isValidConnection('left')}
      />
      <Handle
        className={`${cls.outputHandle} ${cls.handleRight}`}
        type="source"
        position={Position.Right}
        id="right"
        data-node="tools-right"
        isConnectable={isConnectable}
        isValidConnection={isValidConnection('right')}
      />
    </>
  )
}

export default withNodeDelete(memo(FlowRouter))
