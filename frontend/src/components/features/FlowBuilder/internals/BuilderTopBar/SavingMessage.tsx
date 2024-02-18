import { useEffect, useRef, useState } from 'react'

import { LoadingOutlined } from '@ant-design/icons'
import $flowSaving from '@common/globalStates/$flowSaving'
import LucideIcn from '@icons/LucideIcn'
import If from '@utilities/If'
import { Space, Typography } from 'antd'
import { useAtomValue } from 'jotai'

export default function SavingMessage() {
  const flowSaving = useAtomValue($flowSaving)
  const [showSavedMessage, setShowSavedMessage] = useState(false)
  const messageRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    if (flowSaving) return

    setShowSavedMessage(true)
    if (messageRef.current) clearTimeout(messageRef.current)

    messageRef.current = setTimeout(() => {
      setShowSavedMessage(false)
    }, 3000)
  }, [flowSaving])

  return (
    <Space>
      <Typography.Text strong>
        <If conditions={flowSaving}>Saving</If>
        <If conditions={[!flowSaving, showSavedMessage]}>Saved</If>
      </Typography.Text>
      <If conditions={flowSaving}>
        <LoadingOutlined />
      </If>
      <If conditions={[!flowSaving, showSavedMessage]}>
        <LucideIcn name="check" />
      </If>
    </Space>
  )
}
