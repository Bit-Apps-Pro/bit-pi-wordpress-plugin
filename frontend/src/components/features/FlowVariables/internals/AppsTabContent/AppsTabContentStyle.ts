import { lighten } from '@common/helpers/globalHelpers'
import ut from '@resource/utilsCssInJs'
import { type GlobalToken } from 'antd'

const appsTabContentStyle = (token: GlobalToken) => ({
  nodeIdBadge: (isDark: boolean) => ({
    padding: '4px 9px',
    border: `1px solid ${isDark ? token.geekblue8 : token.geekblue2}`,
    height: 24,
    borderRadius: '50px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: isDark ? token.geekblue7 : token.geekblue1,
    color: isDark ? '#fff' : token.colorText,
    lineHeight: 1,
    marginLeft: 8,
    fontWeight: 500
  }),
  treeButton: (appColor?: string) => [
    ut({
      sdw: 'none*',
      bg: `${appColor}*`,
      bdrclr: `${lighten(appColor, -100)}*`,
      clr: `#121212*`
    }),
    {
      '&:hover': {
        borderColor: `${lighten(appColor, -200)} !important`
      }
    }
  ]
})

export default appsTabContentStyle
