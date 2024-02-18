import { type MixInputValue } from 'react-mix-tag-input'

import $commonVariables from '@common/globalStates/flows/variables/$commonVariables'
import ut from '@resource/utilsCssInJs'
import { Button, Space, Typography } from 'antd'
import { useAtomValue } from 'jotai'

const { Title } = Typography

type TabContentType = {
  onClickVar: (value: MixInputValue) => void
}

export default function SystemTabContent({ onClickVar }: TabContentType) {
  const commonVariables = useAtomValue($commonVariables)

  const handleClickVar = (label: string, slug: string, dType: string) => () => {
    onClickVar({ type: 'tag', label, data: { tagType: 'common-variable', slug, dType } })
  }

  return (
    <Space direction="vertical">
      <div>
        <Title level={5}>System</Title>
        <Space wrap>
          {commonVariables.system.map(({ label, slug, dType }) => (
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
        <Title level={5}>WP</Title>
        <Space wrap>
          {commonVariables.wp.map(({ label, slug, dType }) => (
            <Button
              key={slug}
              size="small"
              css={ut({ sdw: 'none*' })}
              onClick={handleClickVar(label, slug, dType)}
            >
              {label}
            </Button>
          ))}
        </Space>
      </div>
    </Space>
  )
}
