import { useEffect } from 'react'

import { $appConfig } from '@common/globalStates'
import { select } from '@common/helpers/globalHelpers'
import DashboardIcn from '@icons/DashboardIcn'
import LogoIcn from '@icons/LogoIcn'
import LogoText from '@icons/LogoText'
import LucideIcn from '@icons/LucideIcn'
import SupportIcn from '@icons/SupportIcn'
import ut from '@resource/utilsCssInJs'
import Fade from '@utilities/Fade'
import If from '@utilities/If'
import { Button, Layout, Tooltip } from 'antd'
import { motion } from 'framer-motion'
import { useAtom } from 'jotai'

import cls from './Sidebar.module.css'
import SidebarNavItem, { navItemStyle } from './SidebarNavItem'

const { Sider } = Layout

const navItems = [
  { label: 'Dashboard', path: '/', icon: <DashboardIcn size={17} /> },
  { label: 'Flows', path: '/flows', icon: <LucideIcn name="workflow" size={19} /> },
  { label: 'Connections', path: '/connections', icon: <LucideIcn name="link" size={18} /> },
  { label: 'Webhooks', path: '/webhooks', icon: <LucideIcn name="webhook" size={18} /> }
]

const collapseBtnStyle = () => ({
  position: 'absolute !important' as any, // eslint-disable-line @typescript-eslint/no-explicit-any
  top: '32px',
  right: '-12px'
})

export default function Sidebar() {
  const [{ isSidebarCollapsed, isDarkTheme, isWpMenuCollapsed }, setAppConfig] = useAtom($appConfig)

  const toggleTheme = () =>
    setAppConfig(prv => ({
      ...prv,
      isDarkTheme: !prv.isDarkTheme
    }))

  const toggleMenu = () =>
    setAppConfig(prv => ({
      ...prv,
      isSidebarCollapsed: !prv.isSidebarCollapsed,
      isWpMenuCollapsed: !prv.isWpMenuCollapsed
    }))

  useEffect(() => {
    const body = select('.wp-admin')
    if (body) {
      if (isWpMenuCollapsed) {
        body.classList.add('folded')
      } else {
        body.classList.remove('folded')
      }
    }
  }, [isWpMenuCollapsed])

  return (
    <Sider
      theme="light"
      collapsed={isSidebarCollapsed}
      collapsedWidth={50}
      width={150}
      css={({ token }) => ({
        background: isDarkTheme ? 'transparent!important' : token.colorBgContainer,
        borderRight: `1px solid ${token.controlOutline}`
      })}
      className={`${cls.sidebar}`}
    >
      <div className={cls.sidebarLogo}>
        <LogoIcn size={30} />
        <Fade is={!isSidebarCollapsed}>
          <LogoText h={40} w={72} />
        </Fade>
      </div>

      <Button
        css={collapseBtnStyle}
        size="small"
        shape="circle"
        onClick={toggleMenu}
        title={isSidebarCollapsed ? 'Expand' : 'Collapse'}
        icon={<LucideIcn name={isSidebarCollapsed ? 'chevron-right' : 'chevron-left'} />}
      />
      <nav
        className={cls.navList}
        css={{
          width: isSidebarCollapsed ? 40 : 130
        }}
      >
        <motion.div>
          {navItems.map(link => (
            <SidebarNavItem key={link.label} props={link} />
          ))}
        </motion.div>

        <div>
          <SidebarNavItem
            key="Support"
            props={{ label: 'Support', path: '/support', icon: <SupportIcn size={18} /> }}
          />
          <Tooltip title={`Switch to ${isDarkTheme ? 'light' : 'dark'} mode`} placement="right">
            <button
              className={`mb-1 ${cls.navItem}`}
              onClick={toggleTheme}
              type="button"
              title={isDarkTheme ? 'Light' : 'Dark'}
              css={({ token }) => navItemStyle({ token, isSidebarCollapsed })}
            >
              {isDarkTheme ? <LucideIcn name="moon" size={18} /> : <LucideIcn name="sun" size={18} />}
              <If conditions={!isSidebarCollapsed}>
                <span>{isDarkTheme ? 'Light' : 'Dark'}</span>
              </If>
            </button>
          </Tooltip>

          <If conditions={!isSidebarCollapsed}>
            <a
              className="link"
              css={ut({ ta: 'center', dis: 'block', fs: 10, clr: '#585858*' })}
              href="https://bitapps.pro"
              target="_blank"
              rel="noreferrer"
            >
              Product by Bit Apps
            </a>
          </If>
        </div>
      </nav>
    </Sider>
  )
}
