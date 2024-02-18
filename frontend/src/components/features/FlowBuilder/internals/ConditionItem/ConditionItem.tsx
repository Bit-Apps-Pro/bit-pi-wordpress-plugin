import { useState } from 'react'
import {
  type Connection,
  type Edge,
  Handle,
  Position,
  useEdges,
  useNodes,
  useReactFlow
} from 'reactflow'

import { $flowSetupModal } from '@common/globalStates'
import $flowDetailsSelector, { type FlowType } from '@common/globalStates/$flowDetails'
import { $flowNodesFamily } from '@common/globalStates/$flowNodes'
import { edgeConnectionValidation } from '@components/features/FlowBuilder/helpers/FlowBuilderHelper'
import cls from '@features/FlowBuilder/internals/nodeTypes/Node/Node.module.css'
import NodeTypeDef from '@features/FlowBuilder/internals/nodeTypes/NodeTypeDef'
import EditIcon from '@icons/EditIcon'
import LucideIcn from '@icons/LucideIcn'
import { Badge, Button, Popconfirm, Typography, theme } from 'antd'
import { useAtom, useSetAtom } from 'jotai'
import { create } from 'mutative'

import css from './ConditionItem.module.css'
import ConditionItemModal from './ConditionItemModal'

export interface ConditionType {
  id: string
  title: string
  type: string
}

interface ConditionItemPropsType {
  nodeId: string
  condition: ConditionType
  isConnectable: boolean
}

export default function ConditionItem({ nodeId, condition, isConnectable }: ConditionItemPropsType) {
  const { id: conditionId, title, type } = condition
  const setFlowDetails = useSetAtom($flowDetailsSelector)
  const [flowNode, setFlowNode] = useAtom($flowNodesFamily(nodeId))
  const reactFlow = useReactFlow()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { token } = theme.useToken()
  const edges = useEdges()
  const nodes = useNodes()
  const setFlowModal = useSetAtom($flowSetupModal)

  const editCondition = () => {
    setIsModalOpen(true)
    setFlowModal(prev => ({ ...prev, id: nodeId }))
  }

  const closeConditionModal = () => {
    setIsModalOpen(false)
    setFlowModal(prev => ({ ...prev, id: '' }))
  }

  const isValidConnection = (currentHandle: string) => (connection: Connection) =>
    edgeConnectionValidation(connection, edges, nodes, type, currentHandle)

  const deleteCondition = () => {
    const nodeDetails = reactFlow.getNode(nodeId)
    if (!nodeDetails) return

    const [nodeInternals] = Object.getOwnPropertySymbols(nodeDetails)
    if (!nodeInternals) return

    const conditionSourceIndexNo = flowNode.states?.conditions?.findIndex(
      (conditionDetails: ConditionType) => conditionDetails.id === conditionId
    )
    if (!conditionSourceIndexNo) return

    setFlowNode(prev =>
      create(prev, draft => {
        draft.states?.conditions?.splice(conditionSourceIndexNo, 1)
      })
    )

    reactFlow.setEdges(prev =>
      create(prev, draftEdges => {
        const edgesAfterDelete = draftEdges.filter(prevEdge => prevEdge.sourceHandle !== conditionId)

        setFlowDetails((prevFlow: FlowType) =>
          create(prevFlow, draftFlow => {
            draftFlow.data.edges = JSON.parse(JSON.stringify(edgesAfterDelete)) as Edge[]
            return draftFlow
          })
        )

        return edgesAfterDelete
      })
    )
  }

  const handleTitleChange = (value: string) => {
    setFlowNode(prev =>
      create(prev, draft => {
        const cond = draft.states?.conditions?.find(item => item.id === conditionId)
        if (cond) {
          cond.title = value
        }
      })
    )
  }

  return (
    <div className={css.cardItemWithHandle}>
      <div className={css.condition} data-conditionid={conditionId}>
        <Typography.Text className={type === NodeTypeDef.conditionLogic ? css.cardItemTitle : ''}>
          {type === NodeTypeDef.defaultConditionLogic && (
            <Badge count="Default" color={token.colorTextTertiary} />
          )}
          &nbsp;
          {title}
        </Typography.Text>
        <div className={css.condActionBtnWrp}>
          {type === NodeTypeDef.conditionLogic && (
            <>
              <Button
                type="text"
                shape="circle"
                onClick={editCondition}
                icon={<EditIcon size={14} stroke={2} />}
                className={`${css.cardItemSvgBtn}`}
              />
              <Popconfirm
                title="Delete condition"
                description="Are you sure to delete this app?"
                icon={<LucideIcn name="trash-2" color="red" />}
                onConfirm={deleteCondition}
                okText="Yes"
                cancelText="No"
              >
                <Button shape="circle" type="text" icon={<LucideIcn name="trash-2" />} />
              </Popconfirm>
            </>
          )}
        </div>
      </div>

      <Handle
        className={`${cls.outputHandle} ${cls.handleConditionRight} ${css.rightHandle}`}
        type="source"
        position={Position.Right}
        id={conditionId}
        isConnectable={isConnectable}
        isValidConnection={isValidConnection('right')}
      />

      {isModalOpen && (
        <ConditionItemModal
          {...{
            title,
            nodeId,
            conditionId,
            closeConditionModal,
            handleTitleChange
          }}
        />
      )}
    </div>
  )
}
