import { useState } from 'react'
import { useParams } from 'react-router-dom'

import { LoadingOutlined } from '@ant-design/icons'
import { $flowSetupModal } from '@common/globalStates'
import $flowNodes from '@common/globalStates/$flowNodes'
import useAsyncInterval from '@common/hooks/useAsyncInterval'
import useListenWebhook from '@features/Webhook/data/useListenWebhook'
import useStopHookListener from '@features/Webhook/data/useStopHookListener'
import formatVariables from '@features/Webhook/helpers/variablesFormatter'
import LucideIcn from '@icons/LucideIcn'
import ut from '@resource/utilsCssInJs'
import If from '@utilities/If'
import { Alert, Button, Space, Typography } from 'antd'
import { useAtomValue, useSetAtom } from 'jotai'
import { create } from 'mutative'

type HookListenerType = {
  wrapperClassName?: string
}

export default function HookListener({ wrapperClassName }: HookListenerType) {
  const flowId = Number(useParams()?.flowId)
  const { id: nodeId } = useAtomValue($flowSetupModal)
  const setFlowNodes = useSetAtom($flowNodes)
  const { listenWebhook } = useListenWebhook()
  const { stopHookListener } = useStopHookListener()
  const [isAlertVisible, setIsAlertVisible] = useState(false)

  const [isListening, startListen, stopListen] = useAsyncInterval(async () => {
    const { data } = await listenWebhook({ flowId, nodeId })
    if (Array.isArray(data) || !data) return

    stopListen()
    setIsAlertVisible(true)

    setFlowNodes(prev =>
      create(prev, draft => {
        draft[nodeId].variables = formatVariables(data.variables)
      })
    )
  }, 1500)

  const stopListenHandle = () => {
    stopHookListener()
    stopListen()
  }

  if (Number.isNaN(flowId)) return null

  return (
    <div className={wrapperClassName}>
      <If conditions={!isListening}>
        <Button danger onClick={startListen} icon={<LucideIcn name="webhook" size={16} />}>
          Listen Response
        </Button>
      </If>

      <If conditions={isListening}>
        <Space align="baseline">
          <Button danger onClick={stopListenHandle} icon={<LucideIcn name="stop-circle" size={16} />}>
            Stop
          </Button>
          <LoadingOutlined size={16} />
          <Typography.Text>Listening...</Typography.Text>
        </Space>
      </If>

      <If conditions={isAlertVisible}>
        <Alert
          showIcon
          closable
          type="success"
          message="Response captured"
          afterClose={() => setIsAlertVisible(false)}
          css={ut({ mt: '10px*' })}
        />
      </If>
    </div>
  )
}
