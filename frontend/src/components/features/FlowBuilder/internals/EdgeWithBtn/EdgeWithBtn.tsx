import { type MouseEvent } from 'react'
import { type EdgeProps } from 'reactflow'
import { getBezierPath } from 'reactflow'

import { $nodeEdgeContextMenu } from '@common/globalStates'
import SettingIcon from '@icons/SettingIcon'
import { useSetAtom } from 'jotai'

import cls from './EdgeWithBtn.module.scss'

const foreignObjectSize = 30

export default function EdgeWithBtn({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  selected
}: EdgeProps) {
  const setNodeEdgeContextMenu = useSetAtom($nodeEdgeContextMenu)

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX: targetX - 10,
    targetY,
    targetPosition,
    curvature: 0.6
  })

  const onEdgeClick = (e: MouseEvent) => {
    e.stopPropagation()
    setNodeEdgeContextMenu({
      isOpen: true,
      id,
      type: 'edge',
      clientX: e.clientX,
      clientY: e.clientY
    })
  }

  return (
    <>
      <path id={id} className={cls['edge-path']} d={edgePath} markerEnd="url(#edge-end-marker)" />
      <path id={id} className={cls['shadow-edge-path']} d={edgePath} />
      {selected && (
        <foreignObject
          width={foreignObjectSize}
          height={foreignObjectSize}
          x={labelX - foreignObjectSize / 2}
          y={labelY - foreignObjectSize / 2}
          requiredExtensions="http://www.w3.org/1999/xhtml"
        >
          <div className={cls.edgeBtnWrp}>
            <button
              title="connection options"
              type="button"
              className={cls.edgebutton}
              onClick={onEdgeClick}
              aria-label="settings"
            >
              <SettingIcon size={15} stroke={2} />
            </button>
          </div>
        </foreignObject>
      )}
    </>
  )
}
