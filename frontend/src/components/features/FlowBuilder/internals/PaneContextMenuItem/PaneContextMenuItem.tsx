import { type Node } from 'reactflow'
import { Position, useReactFlow } from 'reactflow'

import { $paneContextMenu } from '@common/globalStates'
import { getNewId } from '@components/features/FlowBuilder/helpers/FlowBuilderHelper'
import NodeTypeDef from '@features/FlowBuilder/internals/nodeTypes/NodeTypeDef'
import { useAtom } from 'jotai'

import cls from './PaneContextMenuItem.module.css'

// Data type
export interface PaneContextMenuItemPropsTypes {
  iconURL: string
  title: string
}

export default function PaneContextMenuItem({
  menuItem
}: {
  menuItem: PaneContextMenuItemPropsTypes
}): JSX.Element {
  const { title } = menuItem
  const [paneContextMenu, setPaneContextMenu] = useAtom($paneContextMenu)
  const reactFlow = useReactFlow()

  const closePaneContextMenu = () => {
    setPaneContextMenu({
      isOpen: false,
      clientX: 0,
      clientY: 0
    })
  }

  const onClickApp = () => {
    const flowBuilderViewport = reactFlow.getViewport()
    const flowBuilderPosition = document.getElementById('bit-flow-builder-wrp')?.getBoundingClientRect()

    const appPositionX =
      (Math.round(paneContextMenu.clientX) -
        Math.round(flowBuilderPosition?.x || 0) -
        flowBuilderViewport.x) /
      flowBuilderViewport.zoom
    const appPositionY =
      (Math.round(paneContextMenu.clientY) -
        Math.round(flowBuilderPosition?.y || 0) -
        flowBuilderViewport.y) /
      flowBuilderViewport.zoom
    const nodeType = reactFlow.getNodes().length ? NodeTypeDef.action : NodeTypeDef.trigger

    reactFlow.setNodes((nods: Node[]) => {
      const tmpNods = [...nods]
      const id = getNewId(tmpNods, NodeTypeDef.action)
      tmpNods.push({
        id,
        type: nodeType,
        data: {},
        connectable: true,
        position: { x: appPositionX, y: appPositionY },
        sourcePosition: Position.Right,
        targetPosition: Position.Left
      })
      return tmpNods
    })
    closePaneContextMenu()
  }

  return (
    <li
      role="menuitem"
      className={cls.flowAppListItem}
      tabIndex={0}
      onClick={onClickApp}
      onKeyUp={onClickApp}
    >
      <span className={cls.appIcon} />
      <div className={cls.appTitle}>{title}</div>
    </li>
  )
}
