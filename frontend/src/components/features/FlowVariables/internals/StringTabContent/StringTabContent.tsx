import { type MixInputValue } from 'react-mix-tag-input'

import $commonVariables from '@common/globalStates/flows/variables/$commonVariables'
import ut from '@resource/utilsCssInJs'
import { Button, Space, Typography } from 'antd'
import { useAtomValue } from 'jotai'

const { Title } = Typography

type TabContentType = {
  onClickVar: (value: MixInputValue | MixInputValue[]) => void
}

export default function StringTabContent({ onClickVar }: TabContentType) {
  const commonVariables = useAtomValue($commonVariables)

  const handleClickVar = (slug: string) => () => {
    onClickVar([
      { type: 'tag', label: `${slug}(`, data: { tagType: 'function', slug } },
      { type: 'tag', label: ')', data: { tagType: 'operator', value: ')' } }
    ])
  }

  return (
    <Space direction="vertical">
      <div>
        <Title level={5}>Functions</Title>
        <Space wrap>
          {commonVariables.stringFunction.map(({ slug }) => (
            <Button key={slug} size="small" css={ut({ sdw: 'none*' })} onClick={handleClickVar(slug)}>
              {slug}
            </Button>
          ))}
        </Space>
      </div>
    </Space>
  )
}
