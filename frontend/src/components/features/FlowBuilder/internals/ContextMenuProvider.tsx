import { type ReactElement, useRef } from 'react'

import { $nodeEdgeContextMenu, $paneContextMenu } from '@common/globalStates'
import useOnClickOutside from '@common/hooks/useOnClickOutside'
import { useAtom, useAtomValue } from 'jotai'

import NodeEdgeContextMenu from './NodeEdgeContextMenu'
import PaneContextMenu from './PaneContextMenu'

export default function ContextMenuProvider({ children }: { children: ReactElement }) {
  const [nodeEdgeContextMenu, setNodeEdgeContextMenu] = useAtom($nodeEdgeContextMenu)
  const paneContextMenu = useAtomValue($paneContextMenu)
  const ref = useRef<HTMLDivElement>(null)

  const closeContextMenu = () =>
    setNodeEdgeContextMenu({
      isOpen: false,
      id: '',
      type: '',
      clientX: 0,
      clientY: 0
    })

  useOnClickOutside(ref, closeContextMenu)

  return (
    <>
      {nodeEdgeContextMenu.isOpen && <NodeEdgeContextMenu nodeEdgeContextMenu={nodeEdgeContextMenu} />}

      {paneContextMenu.isOpen && (
        <PaneContextMenu clientX={paneContextMenu.clientX} clientY={paneContextMenu.clientY} />
      )}

      {children}
    </>
  )
}
