import { type GlobalToken } from 'antd'

const nodeContentStyle = (token: GlobalToken) => ({
  nodeImg: (color?: string) => ({
    borderRadius: token.borderRadius,
    borderColor: token.colorBorderSecondary,
    color: `${token.colorTextDisabled}!important`,
    backgroundColor: color || `${token.colorBgContainerDisabled}!important`,
    '&:hover': {
      color: `${token.colorPrimary}!important`
    }
  }),
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
  })
})

export default nodeContentStyle
