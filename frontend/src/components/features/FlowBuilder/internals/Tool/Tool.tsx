import FlowBuilderDraggableItem from '@components/features/FlowBuilder/internals/FlowBuilderDraggableItem'
import { type ToolType } from '@features/FlowBuilder/internals/BuilderLeftSideBar/data/toolListData'
import { theme } from 'antd'

import css from './Tool.module.css'

interface ToolPropsTypes {
  title: string
  appConfig: ToolType
}

export default function Tool({ title, appConfig }: ToolPropsTypes) {
  const { token } = theme.useToken()

  return (
    <div data-testid="draggable-tool">
      <div
        css={{
          background: token.colorBgLayout,
          borderRadius: token.borderRadius + 2,
          boxShadow: `0 0 5px 1px ${token.colorBgContainerDisabled} inset`
        }}
      >
        <FlowBuilderDraggableItem appConfig={appConfig} css={{ cursor: 'grab' }}>
          <div className={css.tool}>{appConfig.icon}</div>
        </FlowBuilderDraggableItem>
      </div>
      <p className={css.toolTitle}>{title}</p>
    </div>
  )
}
