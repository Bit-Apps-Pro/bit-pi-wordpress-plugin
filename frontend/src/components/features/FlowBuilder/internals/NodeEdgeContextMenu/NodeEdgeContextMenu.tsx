import { type Edge, type Node, useReactFlow } from 'reactflow'

import { $flowSetupModal, $nodeEdgeContextMenu } from '@common/globalStates'
import $flowDetailsSelector, { type FlowType } from '@common/globalStates/$flowDetails'
import withNodeDelete from '@features/FlowBuilder/helpers/withNodeDelete'
import NodeTypeDef from '@features/FlowBuilder/internals/nodeTypes/NodeTypeDef'
import EditIcon from '@icons/EditIcon'
import LucideIcn from '@icons/LucideIcn'
import ut from '@resource/utilsCssInJs'
import ContextMenu from '@utilities/ContextMenu'
import { Button, type GlobalToken, Popconfirm } from 'antd'
import { useSetAtom } from 'jotai'
import { create } from 'mutative'

import css from './NodeEdgeContextMenu.module.css'

const typeName = {
  edge: 'Connection',
  trigger: 'App',
  action: 'App',
  condition: 'Condition tool',
  router: 'Router tool',
  delay: 'Delay tool'
} as const

const notDeletable = ['trigger']
const notEditable = ['edge', 'condition', 'router', 'delay']

interface NodeEdgeContextMenuType {
  nodeEdgeContextMenu: {
    isOpen: boolean
    id: string
    type: keyof typeof typeName
    clientX: number
    clientY: number
  }
  deleteNode: (id: string) => void
}

const nodeEdgeContextMenuStyle = ({ token }: { token: GlobalToken }) => ({
  backgroundColor: token.colorBgContainer,
  boxShadow: token.boxShadow,
  border: `1px solid ${token.colorBorderSecondary}`,
  borderRadius: token.borderRadius
})

function NodeEdgeContextMenu({ nodeEdgeContextMenu, deleteNode }: NodeEdgeContextMenuType) {
  const setFlow = useSetAtom($flowDetailsSelector)
  const reactFlow = useReactFlow()
  const { id, type, clientX, clientY } = nodeEdgeContextMenu
  const setNodeEdgeContextMenu = useSetAtom($nodeEdgeContextMenu)
  const setBuilderModal = useSetAtom($flowSetupModal)

  const closeContextMenu = () =>
    setNodeEdgeContextMenu({
      isOpen: false,
      id: '',
      type: '',
      clientX: 0,
      clientY: 0
    })

  const deleteEdge = () => {
    reactFlow.setEdges(prev => create(prev, draft => draft.filter(edge => edge.id !== id)))

    setFlow((prev: FlowType) =>
      create(prev, draft => {
        draft.data.edges = draft.data.edges.filter(edge => edge.id !== id)
        return draft
      })
    )
  }

  const deleteTool = () => {
    reactFlow.setNodes(prev => create(prev, draft => draft.filter(node => node.id !== id)))

    reactFlow.setEdges(prev =>
      create(prev, draft => draft.filter(edge => edge.source !== id && edge.target !== id))
    )

    setFlow((prevFlow: FlowType) =>
      create(prevFlow, draftFlow => {
        const afterDeleteNode = draftFlow.data.nodes.filter((node: Node) => node.id !== id)
        const afterDeleteEdge = draftFlow.data.edges.filter(
          (edge: Edge) => edge.source !== id && edge.target !== id
        )

        draftFlow.data.nodes = afterDeleteNode
        draftFlow.data.edges = afterDeleteEdge

        return draftFlow
      })
    )
  }

  const deleteHandler = () => {
    if (type === 'edge') {
      deleteEdge()
    } else if (
      type === NodeTypeDef.action ||
      type === NodeTypeDef.trigger ||
      type === NodeTypeDef.condition ||
      type === NodeTypeDef.delay
    ) {
      deleteNode(id)
    } else if (type === NodeTypeDef.router) {
      deleteTool()
    }

    closeContextMenu()
  }

  const editHandler = () => {
    setBuilderModal({ id, type, isOpen: true })
    closeContextMenu()
  }

  return (
    <ContextMenu clientY={clientY} clientX={clientX} closeContextMenu={closeContextMenu}>
      <div className={css.nodeEdgeContextMenu} css={nodeEdgeContextMenuStyle}>
        {!notEditable.includes(type) ? (
          <Button
            onClick={editHandler}
            type="text"
            icon={<EditIcon />}
            css={ut({ w: '100%', ta: 'left*' })}
          >
            Edit
          </Button>
        ) : null}

        {!notDeletable.includes(type) ? (
          <Popconfirm
            title={`Delete ${typeName[type]}`}
            description={`Are you sure delete this ${typeName[type].toLowerCase()}?`}
            icon={<LucideIcn name="trash-2" color="red" />}
            onConfirm={deleteHandler}
            okText="Yes"
            cancelText="No"
            getPopupContainer={trigger => trigger.parentElement || document.body}
            overlayStyle={{ width: 'max-content' }}
          >
            <Button
              type="text"
              icon={<LucideIcn name="trash-2" />}
              css={ut({ w: '100%', ta: 'left*' })}
              danger
            >
              Delete
            </Button>
          </Popconfirm>
        ) : null}
      </div>
    </ContextMenu>
  )
}

export default withNodeDelete(NodeEdgeContextMenu)
