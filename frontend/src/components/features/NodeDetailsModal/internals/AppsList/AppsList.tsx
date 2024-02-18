import { type ChangeEvent, useState } from 'react'

import { $flowSetupModal } from '@common/globalStates'
import { $flowNodesFamily } from '@common/globalStates/$flowNodes'
import $flowMachineSelector from '@common/globalStates/flows/$flowMachineSelector'
import { getAppBySlug, searchInApps } from '@components/features/FlowBuilder/helpers/FlowBuilderHelper'
import { type Interpolation, type Theme, useTheme } from '@emotion/react'
import NodeTypeDef from '@features/FlowBuilder/internals/nodeTypes/NodeTypeDef'
import LucideIcn from '@icons/LucideIcn'
import ut from '@resource/utilsCssInJs'
import { Button, Input, List } from 'antd'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'

import cls from './AppsList.module.css'
import appsListData, { type AppType, type AppsSlugType } from './appsListData'

const listStyle = {
  '& .ant-list-header': {
    padding: '2px!important',
    border: 'none!important',
    marginBottom: '5px!important',
    position: 'sticky',
    top: 0,
    zIndex: 999
  }
} as Interpolation<Theme>

export default function AppsList({
  setIsAppListPopoverOpen
}: {
  setIsAppListPopoverOpen: (v: boolean) => void
}) {
  const [searchedApps, setSearchedApps] = useState<AppType[]>([])
  const [searchedInputValue, setSearchedInputValue] = useState('')
  const dispatchFlowMachine = useSetAtom($flowMachineSelector)
  const { id: nodeId } = useAtomValue($flowSetupModal)
  const [flowNode, setFlowNode] = useAtom($flowNodesFamily(nodeId))
  const { token } = useTheme()

  const onChangeSetSearchedInput = ({ target: { value } }: ChangeEvent<HTMLInputElement>): void => {
    setSearchedInputValue(value)
    const searchResult = searchInApps(value, appsListData)
    setSearchedApps(searchResult)
  }

  const getAppsList = () => {
    if (searchedInputValue && searchedApps.length === 0) {
      return []
    }
    if (searchedInputValue && searchedApps.length > 0) {
      return searchedApps
    }
    return appsListData
  }

  const selectApp = (appSlug: AppsSlugType) => () => {
    const { title: appTitle, iconURL: appIcon, color: appColor } = getAppBySlug(appSlug) || {}

    if (appSlug !== flowNode?.appSlug) {
      dispatchFlowMachine({
        actionType: 'IMPORT_MACHINE',
        data: { nodeId, appSlug, nodeType: NodeTypeDef.action }
      })
      setFlowNode({ appSlug, appTitle, appIcon, appColor })
    }

    setIsAppListPopoverOpen(false)
  }

  return (
    <List
      css={listStyle}
      header={
        <Input
          allowClear
          autoFocus
          onChange={onChangeSetSearchedInput}
          size="small"
          placeholder="Search"
          value={searchedInputValue}
          prefix={<LucideIcn name="search" size={19} />}
        />
      }
      itemLayout="vertical"
      dataSource={getAppsList() as AppType[]}
      renderItem={({ title, slug, iconURL }) => (
        <List.Item css={ut({ p: '0*', m: 0, bdr: 'none*' })}>
          <Button
            onClick={selectApp(slug)}
            block
            size="large"
            type="text"
            css={ut({
              ta: 'left*',
              dis: 'flex*',
              ai: 'center',
              bg: slug === flowNode?.appSlug && `${token.colorPrimaryBg}!important`
            })}
            icon={<img src={iconURL} alt={title} className={cls.appIcon} />}
          >
            {title}
          </Button>
        </List.Item>
      )}
    />
  )
}
