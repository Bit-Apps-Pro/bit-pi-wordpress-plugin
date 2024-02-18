import { select } from '@common/helpers/globalHelpers'
import FlowBuilderDraggableItem from '@components/features/FlowBuilder/internals/FlowBuilderDraggableItem'
import { type ToolType } from '@features/FlowBuilder/internals/BuilderLeftSideBar/data/toolListData'

import css from './Tool.module.css'

interface ToolPropsTypes {
  title: string
  appConfig: ToolType
}

export default function Tool({ title, appConfig }: ToolPropsTypes) {
  const handleOnDrag = () => {
    const flowToolAndAppsTab = select('#appsAndToolsPanel')
    if (flowToolAndAppsTab) {
      flowToolAndAppsTab.style.overflow = 'visible'
    }
  }

  return (
    <div data-testid="draggable-tool">
      <FlowBuilderDraggableItem appConfig={appConfig} onDrag={handleOnDrag} css={{ cursor: 'grab' }}>
        <div className={css.tool}>
          <img className={css.toolIcon} src={appConfig.iconURL} alt="iconURL" />
        </div>
      </FlowBuilderDraggableItem>
      <p className={css.toolTitle}>{title}</p>
    </div>
  )
}
