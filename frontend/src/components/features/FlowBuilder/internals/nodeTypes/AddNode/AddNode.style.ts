import { type GlobalToken } from 'antd'

const addNodeCss = (token: GlobalToken) => ({
  addNodeBtn: {
    border: `2px dashed ${token.colorTextSecondary} !important`,
    '&::after': {
      borderBottom: `2px dashed ${token.colorTextSecondary}`
    }
  }
})

export default addNodeCss
