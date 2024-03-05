import { type Interpolation, type Theme } from '@emotion/react'

const globalCssInJs = ({ token }: Theme) =>
  ({
    '.ant-input-affix-wrapper-focused:has(.ant-input), .ant-select-focused .ant-select-selector': {
      boxShadow: `none !important`,
      transition: 'box-shadow 0s, outline .2s cubic-bezier(0.18, 0.89, 0.32, 1.28) !important',
      outline: `2px solid ${token.colorPrimary} !important`,
      borderColor: `${token.colorPrimary}!important`
    },
    '.ant-input-borderless': {
      border: `1px solid transparent !important`
    },
    '.ant-input:not(:has(~ .ant-input-suffix))': {
      transition: 'box-shadow 0s, outline .2s cubic-bezier(0.18, 0.89, 0.32, 1.28) !important',
      '&:hover': {
        borderColor: `${token.colorPrimary}!important`
      },
      '&:focus': {
        boxShadow: `none !important`,
        outline: `2px solid ${token.colorPrimary} !important`,
        borderColor: `${token.colorPrimary}!important`
      }
    },
    '.flow-draggable-item': {
      borderRadius: token.borderRadius,
      backgroundColor: token.colorBgContainer,
      border: `1px solid ${token.colorBorder}`
    },
    '.flow-draggable-item-dragging': {
      cursor: 'grabbing !important',
      zIndex: '99999 !important',
      boxShadow: token.boxShadowSecondary
    }
  }) as Interpolation<Theme>
export default globalCssInJs
