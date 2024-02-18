import ut from '@resource/utilsCssInJs'
import { type GlobalToken } from 'antd'

const fItemCss = (token: GlobalToken) => ({
  item: [
    ut({
      brs: 'borderRadiusLG',
      bdr: `1px solid ${token?.controlOutline}`,
      sdw: token?.boxShadowTertiary || ''
    }),
    {
      '&:focus-within': {
        border: `1px solid ${token?.colorText}`,
        boxShadow: `0 0 0 1px ${token?.colorText}`
      }
    }
  ]
})

export default fItemCss
