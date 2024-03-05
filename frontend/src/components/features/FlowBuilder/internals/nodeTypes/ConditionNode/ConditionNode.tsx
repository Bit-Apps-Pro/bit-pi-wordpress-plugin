import { memo } from 'react'
import { type Connection, Handle, type NodeProps, Position, useEdges, useNodes } from 'reactflow'

import { $flowNodesFamily } from '@common/globalStates/$flowNodes'
import { useTheme } from '@emotion/react'
import { edgeConnectionValidation, getNewId } from '@features/FlowBuilder/helpers/FlowBuilderHelper'
import withNodeDelete from '@features/FlowBuilder/helpers/withNodeDelete'
import ConditionItem from '@features/FlowBuilder/internals/ConditionItem'
import { type ConditionType } from '@features/FlowBuilder/internals/ConditionItem/ConditionItem'
import { defaultConditions } from '@features/FlowBuilder/internals/ConditionItem/Conditional'
import cls from '@features/FlowBuilder/internals/nodeTypes/Node/Node.module.css'
import NodeTypeDef from '@features/FlowBuilder/internals/nodeTypes/NodeTypeDef'
import useSaveNode from '@features/NodeDetailsModal/data/useSaveNode'
import ConditionIcn from '@icons/ConditionIcn'
import LucideIcn from '@icons/LucideIcn'
import ut from '@resource/utilsCssInJs'
import { Button, Input, Popconfirm, Row, Tooltip } from 'antd'
import { useAtom } from 'jotai'
import { create } from 'mutative'

import css from './ConditionNode.module.css'

interface NodePropsType extends NodeProps {
  deleteNode: (id: string) => void
}

function ConditionNode({ id, type, isConnectable, deleteNode }: NodePropsType) {
  const [flowNode, setFlowNode] = useAtom($flowNodesFamily(id))
  const { token } = useTheme()
  const edges = useEdges()
  const nodes = useNodes()
  useSaveNode(id)

  const defaultCondition = flowNode?.states?.conditions?.find(
    (condition: ConditionType) => condition.type === NodeTypeDef.defaultConditionLogic
  )

  const isValidConnection = (currentHandle: string) => (connection: Connection) =>
    edgeConnectionValidation(connection, edges, nodes, type, currentHandle)

  const addCondition = () => {
    const newIdNum = getNewId(flowNode?.states?.conditions || [])
    setFlowNode(prev =>
      create(prev, draft => {
        draft.states?.conditions?.push({
          id: `${id}-${newIdNum}`,
          title: `Untitled Condition ${newIdNum}`,
          type: NodeTypeDef.conditionLogic,
          condition: defaultConditions
        })
      })
    )
  }

  const handleTitleChange = (value: string) => {
    setFlowNode(prev =>
      create(prev, draft => {
        draft.machineLabel = value
      })
    )
  }

  return (
    <>
      <div className={css.card} data-testid="flow-node" data-node-id={id}>
        <div className={css.cardHeader}>
          <span
            className={css.cardHeaderIcon}
            css={ut({ bdr: `1px solid ${token.colorBorderSecondary}`, bg: 'colorBgContainerDisabled' })}
          >
            <ConditionIcn size="2.5rem" stroke={1} />
          </span>
          <div className={css.inputWithAction}>
            <Input
              value={flowNode?.machineLabel}
              onChange={e => handleTitleChange(e.target.value)}
              variant="borderless"
              className={css.titleInput}
            />
            <div className={css.actions}>
              <Popconfirm
                onConfirm={() => deleteNode(id)}
                okText="Yes"
                cancelText="No"
                title="Delete the condition"
                description="Are you sure to delete this condition?"
                icon={<LucideIcn name="trash-2" color="red" />}
              >
                <Button icon={<LucideIcn name="trash-2" />} />
              </Popconfirm>
            </div>
          </div>
        </div>
        <div className={css.cardBody}>
          {flowNode?.states?.conditions?.map(
            (condition: ConditionType) =>
              condition.type === NodeTypeDef.conditionLogic && (
                <ConditionItem key={condition.id} nodeId={id} condition={condition} isConnectable />
              )
          )}
          <Row justify="center" align="middle" css={ut({ mb: 5 })}>
            <Tooltip title="Add more condition" placement="bottom">
              <Button
                size="small"
                shape="circle"
                data-add-condition={id}
                onClick={addCondition}
                icon={<LucideIcn name="plus" />}
              />
            </Tooltip>
          </Row>
          {defaultCondition && <ConditionItem nodeId={id} condition={defaultCondition} isConnectable />}
        </div>
      </div>

      <Handle
        className={`${cls.outputHandle} ${cls.handleFlowConditionLeft} ${css.leftHandle} `}
        type="target"
        position={Position.Left}
        id="left"
        isConnectable={isConnectable}
        isValidConnection={isValidConnection('left')}
      />
    </>
  )
}

export default withNodeDelete(memo(ConditionNode))
