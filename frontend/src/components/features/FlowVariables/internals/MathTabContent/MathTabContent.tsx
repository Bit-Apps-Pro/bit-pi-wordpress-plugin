import { type MixInputValue } from 'react-mix-tag-input'

import $commonVariables from '@common/globalStates/flows/variables/$commonVariables'
import ut from '@resource/utilsCssInJs'
import { Button, Space, Typography } from 'antd'
import { useAtomValue } from 'jotai'

const { Title } = Typography

type TabContentType = {
  onClickVar: (value: MixInputValue | MixInputValue[]) => void
}

export default function MathTabContent({ onClickVar }: TabContentType) {
  const commonVariables = useAtomValue($commonVariables)

  const handleClickVar = (label: string, slug: string, dType: string) => () => {
    onClickVar({ type: 'tag', label, data: { tagType: 'common-variable', slug, dType } })
  }

  const handleClickFunc = (slug: string) => () => {
    onClickVar([
      { type: 'tag', label: `${slug}(`, data: { tagType: 'function', slug } },
      { type: 'tag', label: ')', data: { tagType: 'operator', value: ')' } }
    ])
  }

  return (
    <Space direction="vertical">
      <div>
        <Title level={5}>Variables</Title>
        <Space wrap>
          {commonVariables.math.map(({ label, slug, dType }) => (
            <Button
              key={slug}
              size="small"
              type="primary"
              css={ut({ sdw: 'none*' })}
              onClick={handleClickVar(label, slug, dType)}
            >
              {label}
            </Button>
          ))}
        </Space>
      </div>
      <div>
        <Title level={5}>Functions</Title>
        <Space wrap>
          {commonVariables.mathFunctions.map(({ slug }) => (
            <Button key={slug} size="small" css={ut({ sdw: 'none*' })} onClick={handleClickFunc(slug)}>
              {slug}
            </Button>
          ))}
        </Space>
      </div>
    </Space>
  )
}
