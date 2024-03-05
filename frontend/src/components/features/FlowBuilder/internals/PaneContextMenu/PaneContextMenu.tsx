import { useLayoutEffect, useRef } from 'react'

import { $paneContextMenu } from '@common/globalStates'
import { useTheme } from '@emotion/react'
import ut from '@resource/utilsCssInJs'
import ContextMenu from '@utilities/ContextMenu'
import { List } from 'antd'
import { useAtom } from 'jotai'

import css from './PaneContextMenu.module.css'

interface PaneContextMenuType {
  clientX: number
  clientY: number
}

export default function PaneContextMenu({ clientX, clientY }: PaneContextMenuType) {
  const [paneContextMenu, setPaneContextMenu] = useAtom($paneContextMenu)
  const menuRef = useRef<HTMLDivElement>(null)
  const { token } = useTheme()

  const closePaneContextMenu = () => {
    setPaneContextMenu({
      isOpen: false,
      clientX: 0,
      clientY: 0
    })
  }

  useLayoutEffect(() => {
    const paneContextMenuPosition = menuRef?.current?.getBoundingClientRect()
    const flowBuilderPosition = document.getElementById('bit-flow-builder-wrp')?.getBoundingClientRect()

    if (paneContextMenuPosition && flowBuilderPosition) {
      const currentMenuBottom = paneContextMenuPosition.height + clientY
      const currentMenuRight = paneContextMenuPosition.width + clientX

      const calculateMenuPositionY =
        currentMenuBottom > flowBuilderPosition.bottom
          ? flowBuilderPosition.bottom - paneContextMenuPosition.height
          : clientY
      const calculateMenuPositionX =
        currentMenuRight > flowBuilderPosition.right
          ? flowBuilderPosition.right - paneContextMenuPosition.width
          : clientX

      setPaneContextMenu({
        isOpen: true,
        clientX: calculateMenuPositionX,
        clientY: calculateMenuPositionY
      })
    }
  }, [])

  return (
    <ContextMenu
      clientY={paneContextMenu?.clientY}
      clientX={paneContextMenu?.clientX}
      closeContextMenu={closePaneContextMenu}
    >
      <div
        css={ut({
          bg: 'colorBgElevated',
          bdr: `1px solid ${token.controlOutline}`,
          brs: 'borderRadiusLG',
          sdw: 'boxShadow'
        })}
        className={`${css.contextMenuCard} scroller thin`}
        ref={menuRef}
      >
        <List
          size="small"
          dataSource={['Hello', 'World']}
          renderItem={item => <List.Item>{item}</List.Item>}
        />
      </div>
    </ContextMenu>
  )
}
