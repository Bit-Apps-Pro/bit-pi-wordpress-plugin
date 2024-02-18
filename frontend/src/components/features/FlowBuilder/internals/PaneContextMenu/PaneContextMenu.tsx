import { type ChangeEvent } from 'react'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'

import { $paneContextMenu } from '@common/globalStates'
import useDebounce from '@common/hooks/useDebounce'
import { type SearchInAppsAndToolsType } from '@components/features/FlowBuilder/helpers/FlowBuilderHelper'
import { searchInAppsAndTools } from '@components/features/FlowBuilder/helpers/FlowBuilderHelper'
import PaneContextMenuList from '@components/features/FlowBuilder/internals/PaneContextMenuList'
import { useTheme } from '@emotion/react'
import toolsListData from '@features/FlowBuilder/internals/BuilderLeftSideBar/data/toolListData'
import appsListData from '@features/NodeDetailsModal/internals/AppsList/appsListData'
import ut from '@resource/utilsCssInJs'
import ContextMenu from '@utilities/ContextMenu'
import Tabs, { TabPanel } from '@utilities/Tabs'
import { Input } from 'antd'
import { useAtom } from 'jotai'

import css from './PaneContextMenu.module.css'

interface PaneContextMenuType {
  clientX: number
  clientY: number
}

export default function PaneContextMenu({ clientX, clientY }: PaneContextMenuType) {
  const [paneContextMenu, setPaneContextMenu] = useAtom($paneContextMenu)
  const [searchedAppsWithTools, setSearchedAppsWithTools] = useState<SearchInAppsAndToolsType>({
    apps: [],
    tools: []
  })
  const [searchedInputValue, setSearchedInputValue] = useState('')
  const searchDebounceValue = useDebounce<string>(searchedInputValue, 400)
  const { token } = useTheme()
  const menuRef = useRef<HTMLDivElement>(null)

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

  const searchAppsWithTools = (searchTerm: string) => {
    const searchTermInLowerCase = searchTerm.toLocaleLowerCase()

    const searchAppsAndTools = searchInAppsAndTools(searchTermInLowerCase, appsListData, toolsListData)

    const SearchedAppsWithToolsResultType = {
      apps: searchAppsAndTools.apps,
      tools: searchAppsAndTools.tools
    }
    setSearchedAppsWithTools(SearchedAppsWithToolsResultType)
  }

  useEffect(() => {
    if (searchDebounceValue) searchAppsWithTools(searchDebounceValue)
    else setSearchedAppsWithTools({ apps: [], tools: [] })
  }, [searchDebounceValue])

  const onChangeSetSearchedInput = ({ target: { value } }: ChangeEvent<HTMLInputElement>): void => {
    setSearchedInputValue(value)
  }

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
        className={css.contextMenuCard}
        ref={menuRef}
      >
        <Input
          css={ut({ p: '2px' })}
          autoFocus
          placeholder="Search..."
          type="search"
          value={searchedInputValue}
          onChange={onChangeSetSearchedInput}
        />

        {!searchDebounceValue && (
          <Tabs
            defaultValue="apps"
            options={[
              { value: 'apps', label: 'Apps' },
              { value: 'tools', label: 'Tools' }
            ]}
            block
            css={ut({ mt: '5px*' })}
          >
            <TabPanel value="apps">
              <PaneContextMenuList paneContextMenuList={appsListData} />
            </TabPanel>
            <TabPanel value="tools">
              <PaneContextMenuList paneContextMenuList={toolsListData} />
            </TabPanel>
          </Tabs>
        )}
        {searchDebounceValue && searchedAppsWithTools.apps.length > 0 && (
          <div className={css.searchedResult}>
            <h2 className={css.searchedResultLabel}>Apps</h2>
            <PaneContextMenuList paneContextMenuList={searchedAppsWithTools.apps} />
          </div>
        )}

        {searchDebounceValue && searchedAppsWithTools.tools.length > 0 && (
          <div className={css.searchedResult}>
            <h2 className={css.searchedResultLabel}>Tools</h2>
            <PaneContextMenuList paneContextMenuList={searchedAppsWithTools.tools} />
          </div>
        )}

        {searchDebounceValue &&
          searchedAppsWithTools.tools.length === 0 &&
          searchedAppsWithTools.apps.length === 0 && (
            <p className={css.notFound}> No apps or tools found</p>
          )}
      </div>
    </ContextMenu>
  )
}
