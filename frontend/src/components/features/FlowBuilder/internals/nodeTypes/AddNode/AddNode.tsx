import { useEdges } from 'reactflow'

import useAddNode from '@features/FlowBuilder/hooks/useAddNode'
import LucideIcn from '@icons/LucideIcn'
import { Button, theme } from 'antd'

import cls from './AddNode.module.css'
import addNodeCss from './AddNode.style'

type AddNodeProps = {
  nodeId: string
  placement?: number
}

export default function AddNode({ nodeId, placement = 350 }: AddNodeProps) {
  const edges = useEdges()
  const { token } = theme.useToken()
  const { handleAddNode } = useAddNode(nodeId, placement)
  const addable = edges.findIndex(edge => edge.source === nodeId) === -1

  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>
      {addable && (
        <Button
          type="dashed"
          onClick={handleAddNode()}
          icon={<LucideIcn name="plus" color={token.colorTextSecondary} />}
          className={cls.addNodeBtn}
          css={addNodeCss(token).addNodeBtn}
        />
      )}
    </>
  )
}
