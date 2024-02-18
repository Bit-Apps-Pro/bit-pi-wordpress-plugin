import { type ChangeEvent, memo, useEffect, useState } from 'react'

import useDebounce from '@common/hooks/useDebounce'
import {
  type SearchInAppsAndToolsType,
  searchInAppsAndTools
} from '@components/features/FlowBuilder/helpers/FlowBuilderHelper'
import ToolsList from '@components/features/FlowBuilder/internals/ToolsList'
import toolListData from '@features/FlowBuilder/internals/BuilderLeftSideBar/data/toolListData'
import FlowAppList from '@features/FlowBuilder/internals/FlowAppList'
import appsListData from '@features/NodeDetailsModal/internals/AppsList/appsListData'
import LucideIcn from '@icons/LucideIcn'
import Tabs, { TabPanel } from '@utilities/Tabs'
import { Input, Space, Typography } from 'antd'

import css from './BuilderLeftSideBar.module.css'
import FlowTitle from './internals/FlowTitle'

function BuilderLeftSideBar(): JSX.Element {
  const [searchedAppsWithTools, setSearchedAppsWithTools] = useState<SearchInAppsAndToolsType>({
    apps: [],
    tools: []
  })
  const [searchedInputValue, setSearchedInputValue] = useState('')
  const searchDebounceValue = useDebounce<string>(searchedInputValue, 400)

  const searchAppsWithTools = (searchTerm: string) => {
    const searchTermInLowerCase = searchTerm.toLocaleLowerCase()
    const searchAppsAndTools = searchInAppsAndTools(searchTermInLowerCase, appsListData, toolListData)

    const searchedAppsWithToolsResult = {
      apps: searchAppsAndTools.apps,
      tools: searchAppsAndTools.tools
    }
    setSearchedAppsWithTools(searchedAppsWithToolsResult)
  }

  useEffect(() => {
    if (searchDebounceValue) searchAppsWithTools(searchDebounceValue)
    else setSearchedAppsWithTools({ apps: [], tools: [] })
  }, [searchDebounceValue])

  const onChangeSetSearchedInput = ({ target: { value } }: ChangeEvent<HTMLInputElement>): void => {
    setSearchedInputValue(value)
  }

  return (
    <div
      className={css.builderLeftBar}
      css={({ token }) => ({ borderRight: `1px solid ${token.controlOutline}` })}
    >
      <Space direction="vertical" size={4}>
        <FlowTitle />
        <Input
          allowClear
          onChange={onChangeSetSearchedInput}
          placeholder="Search"
          value={searchedInputValue}
          prefix={<LucideIcn name="search" size={19} />}
        />
      </Space>

      {!searchDebounceValue && (
        <Tabs
          panelProps={{ id: 'appsAndToolsPanel' }}
          css={{ marginTop: '0.5rem!important' }}
          block
          defaultValue="apps"
          options={[
            { value: 'apps', label: 'Apps' },
            { value: 'tools', label: 'Tools' }
          ]}
        >
          <TabPanel value="apps" className={css.tabPanel}>
            <FlowAppList apps={appsListData} />
          </TabPanel>
          <TabPanel value="tools">
            <ToolsList tools={toolListData} />
          </TabPanel>
        </Tabs>
      )}

      {searchDebounceValue && Boolean(searchedAppsWithTools.apps.length) && (
        <div className={css.searchedResult}>
          <Typography.Title level={5} className={css.searchedResultLabel}>
            Apps
          </Typography.Title>
          <FlowAppList apps={searchedAppsWithTools.apps} />
        </div>
      )}

      {searchDebounceValue && Boolean(searchedAppsWithTools.tools.length) && (
        <div className={css.searchedResult}>
          <Typography.Title level={5} className={css.searchedResultLabel}>
            Tools
          </Typography.Title>
          <ToolsList tools={searchedAppsWithTools.tools} />
        </div>
      )}

      {searchDebounceValue &&
        !searchedAppsWithTools.tools.length &&
        !searchedAppsWithTools.apps.length && <p className={css.notFound}>No apps or tools found</p>}
    </div>
  )
}

export default memo(BuilderLeftSideBar)
