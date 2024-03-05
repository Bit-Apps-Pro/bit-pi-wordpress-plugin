import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { ReactFlowProvider } from 'reactflow'

import { $appConfig } from '@common/globalStates'
import $flowDetailsSelector from '@common/globalStates/$flowDetails'
import { select } from '@common/helpers/globalHelpers'
import BuilderLeftSideBar from '@components/features/FlowBuilder/internals/BuilderLeftSideBar'
import BuilderSvgIcons from '@components/features/FlowBuilder/internals/BuilderSvgIcons'
import { saveAuthCodeResponse } from '@features/Connection/helpers/oauthHelper'
import FlowBuilder from '@features/FlowBuilder/FlowBuilder'
import BuilderToolsBar from '@features/FlowBuilder/internals/BuilderToolsBar/BuilderToolsBar'
import BuilderTopBar from '@features/FlowBuilder/internals/BuilderTopBar'
import { Empty } from 'antd'
import { motion } from 'framer-motion'
import { useSetAtom } from 'jotai'
import { RESET } from 'jotai/utils'

import cls from './FlowDetails.module.css'

function FlowDetailsWithFlowProvider() {
  const flowId = Number(useParams()?.flowId)
  const setAppConfig = useSetAtom($appConfig)
  const setFlow = useSetAtom($flowDetailsSelector)

  useEffect(() => {
    setAppConfig(prv => ({ ...prv, isSidebarCollapsed: true, isWpMenuCollapsed: true }))

    const wrapper = select('.wrapper')
    const sidebar = select('.sidebar')

    if (wrapper) {
      wrapper.style.marginLeft = '36px'
    }
    if (sidebar) {
      sidebar.style.width = '36px'
    }

    return function cleanup() {
      setFlow(RESET)
      setAppConfig(prv => ({ ...prv, isSidebarCollapsed: false, isWpMenuCollapsed: false }))

      if (wrapper) {
        wrapper.style.marginLeft = '160px'
      }
      if (sidebar) {
        sidebar.style.width = '160px'
      }
    }
  }, [])

  useEffect(() => {
    if (window.opener) saveAuthCodeResponse()
  }, [])

  if (Number.isNaN(flowId)) return <Empty className="mt-4" />

  return (
    <>
      <motion.div layoutId={`flowDetails-${flowId}`} className={`${cls.flowDetails} scroller thin`}>
        <BuilderLeftSideBar />

        <FlowBuilder>
          <>
            <BuilderTopBar />
            <BuilderToolsBar />
          </>
        </FlowBuilder>
      </motion.div>

      <BuilderSvgIcons />
    </>
  )
}

export default function FlowDetails() {
  return (
    <ReactFlowProvider>
      <FlowDetailsWithFlowProvider />
    </ReactFlowProvider>
  )
}
