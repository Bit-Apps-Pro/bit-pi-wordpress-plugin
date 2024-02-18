import { useParams } from 'react-router-dom'

import { LoadingOutlined } from '@ant-design/icons'
import $flowNodes from '@common/globalStates/$flowNodes'
import useAsyncInterval from '@common/hooks/useAsyncInterval'
import useListenWebhook from '@features/Webhook/data/useListenWebhook'
import useStopHookListener from '@features/Webhook/data/useStopHookListener'
import formatVariables from '@features/Webhook/helpers/variablesFormatter'
import LucideIcn from '@icons/LucideIcn'
import { Button } from 'antd'
import { useSetAtom } from 'jotai'
import { create } from 'mutative'

export default function TestFlowButton() {
  const flowId = Number(useParams()?.flowId)
  const { listenWebhook } = useListenWebhook('RUN_ONCE')
  const { stopHookListener } = useStopHookListener()
  const setFlowNodes = useSetAtom($flowNodes)

  const [isListening, startListen, stopListen] = useAsyncInterval(async () => {
    const { data } = await listenWebhook({ flowId, nodeId: `${flowId}-1` })
    if (!Array.isArray(data)) return

    stopListen()

    setFlowNodes(prev =>
      create(prev, draft => {
        data.map(item => {
          draft[item.node_id].variables = formatVariables(item.variables)
        })
      })
    )
  }, 1500)

  const stopListenHandle = () => {
    stopHookListener()
    stopListen()
  }

  return (
    <Button
      shape="round"
      type="primary"
      size="large"
      icon={<LucideIcn name={isListening ? 'stop-circle' : 'play'} />}
      onClick={isListening ? stopListenHandle : startListen}
      css={{
        '&:hover': {
          transform: 'scale(1.05)'
        }
      }}
    >
      {isListening ? 'Stop' : 'Test Flow Once'}
      {isListening && <LoadingOutlined />}
    </Button>
  )
}
