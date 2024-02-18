import { type ChangeEvent, memo } from 'react'
import { type Connection, Handle, type NodeProps, Position, useEdges, useNodes } from 'reactflow'

import { $flowNodesFamily } from '@common/globalStates/$flowNodes'
import { edgeConnectionValidation } from '@components/features/FlowBuilder/helpers/FlowBuilderHelper'
import withNodeDelete from '@features/FlowBuilder/helpers/withNodeDelete'
import cls from '@features/FlowBuilder/internals/NodeContent/NodeContent.module.css'
import AddNode from '@features/FlowBuilder/internals/nodeTypes/AddNode'
import useSaveNode from '@features/NodeDetailsModal/data/useSaveNode'
import LucideIcn from '@icons/LucideIcn'
import ut from '@resource/utilsCssInJs'
import Input from '@utilities/Input'
import { Button, Divider, Popconfirm, Popover, Select, Space } from 'antd'
import { useAtom } from 'jotai'
import { create } from 'mutative'

import css from './Delay.module.css'

interface NodePropsType extends NodeProps {
  deleteNode: (id: string) => void
}

export interface DelayType {
  delayUnit: string
  delayValue: number
}

function Delay({ id, type, isConnectable, deleteNode }: NodePropsType) {
  const [flowNode, setFlowNode] = useAtom($flowNodesFamily(id))
  const edges = useEdges()
  const nodes = useNodes()
  useSaveNode(id)

  const isValidConnection = (currentHandle: string) => (connection: Connection) =>
    edgeConnectionValidation(connection, edges, nodes, type, currentHandle)

  const handleDelayUnitChange = (value: string) => {
    if (value !== '') {
      setFlowNode(prev =>
        create(prev, draft => {
          if (draft?.states?.delay) draft.states.delay.delayUnit = value
        })
      )
    }
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setFlowNode(prev =>
      create(prev, draft => {
        if (draft?.states?.delay) draft.states.delay = { ...draft.states.delay, [name]: value }
      })
    )
  }

  const { Option } = Select
  const selectAfter = (
    <Select value={flowNode?.states?.delay?.delayUnit || 'minutes'} onChange={handleDelayUnitChange}>
      <Option value="minutes">Minutes</Option>
      <Option value="hours">Hours</Option>
      <Option value="days">Days</Option>
      <Option value="weeks">Weeks</Option>
      <Option value="months">Months</Option>
    </Select>
  )

  const content = (
    <Space size={5}>
      <Input
        type="number"
        onChange={handleChange}
        wrapperClassName={css.input}
        name="delayValue"
        addonAfter={selectAfter}
        value={flowNode?.states?.delay?.delayValue || 0}
      />
    </Space>
  )

  return (
    <>
      <div className={`${cls.nodeWrp}`} data-testid="flow-node" data-node-id={id}>
        <div className={`${css.delay}`}>
          <div className="flx ai-cen jc-cen w-100">
            <LucideIcn name="clock" size={42} strokeWidth={2} />
          </div>
        </div>
        <div className={css.actions}>
          <Space size={0} split={<Divider css={ut({ mx: '2px*' })} type="vertical" />}>
            <Popover content={content} placement="top" title="Delay" trigger="click">
              <Button type="text" shape="circle" icon={<LucideIcn name="pencil" />} />
            </Popover>
            <Popconfirm
              onConfirm={() => deleteNode(id)}
              okText="Yes"
              cancelText="No"
              title="Delete the Delay"
              description="Are you sure to delete this delay?"
              icon={<LucideIcn name="trash-2" color="red" />}
            >
              <Button type="text" shape="circle" icon={<LucideIcn name="trash-2" />} />
            </Popconfirm>
          </Space>
        </div>
      </div>

      <AddNode nodeId={id} placement={180} />

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

export default withNodeDelete(memo(Delay))
