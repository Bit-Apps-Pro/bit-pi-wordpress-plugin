import FlowBuilderDraggableItem from '@components/features/FlowBuilder/internals/FlowBuilderDraggableItem'
import { useTheme } from '@emotion/react'
import { type AppType } from '@features/NodeDetailsModal/internals/AppsList/appsListData'
import { type GlobalToken } from 'antd'
import { motion } from 'framer-motion'

import cls from './FlowAppListItem.module.css'

const childVariant = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
}

export interface FlowAppListItemPropsTypes {
  title: string
  appConfig: AppType
}

const flowItemStyle = ({ token }: { token: GlobalToken }) => ({
  borderRadius: token.borderRadius + 2,
  padding: token.paddingXS,
  background: token.colorBgElevated,
  color: token.colorText,
  boxShadow: `0 0 0 1.5px ${token.colorBorderSecondary} inset`,
  zIndex: 99,
  display: 'flex',
  alignItems: 'center',
  cursor: 'grab',
  transition: 'box-shadow 0.2s ease-in-out',
  '&:hover': {
    boxShadow: `0 0 0 1.5px ${token.colorBorder} inset, 0 3px 15px -2px ${token.colorBorder}`
  }
})

export default function FlowAppListItem({ title, appConfig }: FlowAppListItemPropsTypes) {
  const { token } = useTheme()

  return (
    <motion.li
      className="pos-rel"
      transition={{ duration: 0.01 }}
      variants={childVariant}
      css={{
        background: token.colorBgLayout,
        borderRadius: token.borderRadius + 2,
        boxShadow: `0 0 5px 1px ${token.colorBgContainerDisabled} inset`
      }}
    >
      <FlowBuilderDraggableItem
        className="pos-rel mb-2"
        css={flowItemStyle}
        testId="draggable-app"
        appConfig={appConfig}
      >
        <img src={appConfig.iconURL} alt={title} className={cls.appIcon} />
        <div className={cls.appTitle}>{title}</div>
      </FlowBuilderDraggableItem>

      <span
        className={cls.appShadowIcon}
        css={{ background: token.colorBorder, borderRadius: token.borderRadius - 2 }}
      />
      <span className={cls.appShadowTitle} css={{ background: token.colorBorder }} />
    </motion.li>
  )
}
