import { type ReactNode, useState } from 'react'

import AppActionsList from '@features/NodeDetailsModal/internals/AppActionsList'
import AppList from '@features/NodeDetailsModal/internals/AppsList'
import LucideIcn from '@icons/LucideIcn'
import ut from '@resource/utilsCssInJs'
import { Popover, Space, Typography, theme } from 'antd'

import cls from './AppHeader.module.css'
import appHeaderStyle from './AppHeader.style'

type AppHeaderType = {
  appName?: string
  actionName?: string
  appIcon?: ReactNode
  appColor?: string
}

export default function AppHeader({ appName, actionName, appIcon, appColor }: AppHeaderType) {
  const { token } = theme.useToken()
  const [isAppSelectPopoverOpen, setIsAppListPopoverOpen] = useState(false)
  const [isMachinePopoverOpen, setIsMachinePopoverOpen] = useState(false)

  return (
    <Space className="mb-2">
      {appIcon && typeof appIcon === 'string' ? (
        <img
          src={appIcon}
          alt={appName}
          className={cls.appLogo}
          css={appHeaderStyle(token).nodeImg(appColor)}
        />
      ) : (
        <div className={cls.appLogo} css={appHeaderStyle(token).nodeImg(appColor)} />
      )}

      <div>
        <Popover
          placement="right"
          trigger="click"
          content={<AppList setIsAppListPopoverOpen={setIsAppListPopoverOpen} />}
          open={isAppSelectPopoverOpen}
          onOpenChange={value => setIsAppListPopoverOpen(value)}
          overlayStyle={{ width: '240px' }}
          overlayInnerStyle={{ marginTop: 40, maxHeight: 'calc(100vh - 56px)', overflowY: 'auto' }}
        >
          <Typography.Title
            level={4}
            className="flx ai-cen px-3 pointer"
            css={ut({ gp: 8, mb: '5px*' })}
          >
            {appName || 'Select App'}
            <LucideIcn
              style={{ rotate: isAppSelectPopoverOpen ? '-90deg' : '0deg', transition: 'rotate .2s' }}
              name="chevron-down"
            />
          </Typography.Title>
        </Popover>

        {appName && (
          <Popover
            placement="right"
            trigger="click"
            content={<AppActionsList setIsMachinePopoverOpen={setIsMachinePopoverOpen} />}
            open={isMachinePopoverOpen}
            onOpenChange={isOpen => setIsMachinePopoverOpen(isOpen)}
            overlayStyle={{ width: '240px' }}
            overlayInnerStyle={{ marginTop: 40, maxHeight: 'calc(100vh - 56px)', overflowY: 'auto' }}
          >
            <Typography.Title
              level={5}
              className="ai-cen px-3 pointer"
              css={ut({ gp: 8, m: '0*', dis: 'inline-flex' })}
            >
              {actionName || 'Select Action'}
              <LucideIcn
                style={{ rotate: isMachinePopoverOpen ? '-90deg' : '0deg', transition: 'rotate .2s' }}
                name="chevron-down"
              />
            </Typography.Title>
          </Popover>
        )}
      </div>
    </Space>
  )
}
