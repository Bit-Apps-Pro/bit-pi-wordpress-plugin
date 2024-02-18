import { type MixInputValue } from 'react-mix-tag-input'

import $commonVariables from '@common/globalStates/flows/variables/$commonVariables'
import ut from '@resource/utilsCssInJs'
import { Button, Space, Typography } from 'antd'
import { useAtomValue } from 'jotai'

const { Title } = Typography

type TabContentType = {
  onClickVar: (value: MixInputValue) => void
}

export default function FlowTabContent({ onClickVar }: TabContentType) {
  const commonVariables = useAtomValue($commonVariables)

  const handleClickVar = (label: string, slug: string, dType: string) => () => {
    onClickVar({ type: 'tag', label, data: { tagType: 'common-variable', slug, dType } })
  }

  return (
    <Space direction="vertical">
      <Title level={5}>Variables</Title>
      <Space wrap>
        {commonVariables.flow.map(({ label, slug, dType }) => (
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
    </Space>
  )
}
