import { getColorPreference } from '@common/helpers/globalHelpers'
import config from '@config/config'
import { atomWithStorage } from 'jotai/utils'

const $appConfig = atomWithStorage(`${config.PLUGIN_SLUG}-config`, {
  isDarkTheme: getColorPreference(),
  isSidebarCollapsed: false,
  isWpMenuCollapsed: false,
  preferNodeDetailsInDrawer: false,
  isPro: config.IS_PRO
})

export default $appConfig
