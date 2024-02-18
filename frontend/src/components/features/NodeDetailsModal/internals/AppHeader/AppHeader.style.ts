import { type GlobalToken } from 'antd'

const appHeaderStyle = (token: GlobalToken) => ({
  nodeImg: (color?: string) => ({
    borderRadius: token.borderRadius,
    borderColor: token.colorBorderSecondary,
    color: `${token.colorTextDisabled}!important`,
    backgroundColor: color || `${token.colorBgContainerDisabled}!important`
  })
})

export default appHeaderStyle
