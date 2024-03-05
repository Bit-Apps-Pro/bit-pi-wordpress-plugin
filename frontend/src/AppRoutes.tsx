import { useEffect } from 'react'
import { Route, Routes, useNavigate } from 'react-router-dom'

import { StyleProvider } from '@ant-design/cssinjs'
import { $appConfig } from '@common/globalStates'
import $navigate from '@common/globalStates/$navigate'
import { removeUnwantedCSS, setAppBgFromAdminBg } from '@common/helpers/globalHelpers'
import { darkThemeConfig, lightThemeConfig } from '@config/theme'
import loadable from '@loadable/component'
import FlowPageLoaderSkeleton from '@pages/Flows/shared/FlowPageLoaderSkeleton/FlowPageLoaderSkeleton'
import Layout from '@pages/Layout'
import Root from '@pages/root/Root'
import { ConfigProvider, theme } from 'antd'
import { useAtom, useAtomValue } from 'jotai'

const Flows = loadable(() => import('@pages/Flows'), { fallback: <FlowPageLoaderSkeleton /> })
const FlowDetails = loadable(() => import('@pages/FlowDetails'), { fallback: <div>Loading...</div> })
// const Connections = loadable(() => import('@pages/Connections'), { fallback: <div>Loading...</div> })
// const Webhooks = loadable(() => import('@pages/Webhooks'), { fallback: <div>Loading...</div> })
const Support = loadable(() => import('@pages/Support'), { fallback: <div>Loading...</div> })
const Error404 = loadable(() => import('@pages/Error404'), { fallback: <div>Loading...</div> })

const { defaultAlgorithm, darkAlgorithm } = theme

export default function AppRoutes() {
  const [navigateUrl, setNavigateUrl] = useAtom($navigate)
  const navigate = useNavigate()
  const { isDarkTheme } = useAtomValue($appConfig)
  const themeTokens = isDarkTheme ? darkThemeConfig : lightThemeConfig
  const themeAlgorithm = isDarkTheme ? darkAlgorithm : defaultAlgorithm

  useEffect(() => {
    removeUnwantedCSS()
    setAppBgFromAdminBg()
  }, [])

  useEffect(() => {
    if (navigateUrl && navigateUrl !== '') {
      navigate(navigateUrl, { replace: true })
      setNavigateUrl('')
    }
  }, [navigateUrl])

  return (
    <ConfigProvider
      theme={{
        algorithm: themeAlgorithm,
        token: themeTokens
      }}
    >
      <StyleProvider hashPriority="high">
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Root />} />

            <Route path="/flows" element={<Flows />} />
            <Route path="/flows/:page" element={<Flows />} />
            <Route path="/flows/details/:flowId" element={<FlowDetails />} />
            <Route path="/flow/create" element={<FlowDetails />} />

            {/* <Route path="/connections" element={<Connections />} /> */}
            {/* <Route path="/webhooks" element={<Webhooks />} /> */}

            <Route path="/support" element={<Support />} />

            <Route path="*" element={<Error404 />} />
          </Route>
        </Routes>
      </StyleProvider>
    </ConfigProvider>
  )
}
