import { $appConfig } from '@common/globalStates'
import { type Interpolation, type Theme } from '@emotion/react'
import LucideIcn from '@icons/LucideIcn'
import { Button, Space } from 'antd'
import { useAtom } from 'jotai'
import { create } from 'mutative'

export default function NodeDetailsModalActions({ wrapperCss }: { wrapperCss?: Interpolation<Theme> }) {
  const [appConfig, setAppConfig] = useAtom($appConfig)

  const handleWindowShape = (preferNodeDetailsInDrawer: boolean) => () => {
    setAppConfig(prev =>
      create(prev, draft => {
        draft.preferNodeDetailsInDrawer = preferNodeDetailsInDrawer
      })
    )
  }

  return (
    <Space.Compact css={wrapperCss}>
      <Button
        size="small"
        type="text"
        disabled={!appConfig.preferNodeDetailsInDrawer}
        onClick={handleWindowShape(false)}
        icon={<LucideIcn name="app-window" />}
      />
      <Button
        size="small"
        type="text"
        disabled={appConfig.preferNodeDetailsInDrawer}
        onClick={handleWindowShape(true)}
        icon={<LucideIcn name="panel-right" />}
      />
    </Space.Compact>
  )
}
