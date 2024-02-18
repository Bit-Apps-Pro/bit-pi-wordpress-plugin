import { lighten } from '@common/helpers/globalHelpers'
import ut from '@resource/utilsCssInJs'

const cItemCss = () => ({
  avatar: (color?: string) =>
    ut({
      bdr: `1px solid ${lighten(color, -100)}*`,
      p: '6px*',
      bg: `${color}*`,
      h: '40px*',
      w: '40px*'
    })
})

export default cItemCss
