import { useParams } from 'react-router-dom'

import useFlowReExecute from '@pages/FlowHistories/data/useFlowReExecute'
import { Button } from 'antd'

export default function ReExecuteButton() {
  const flowId = Number(useParams()?.flowId)
  const { FlowReExecuteMute, isReExecuteLoading } = useFlowReExecute()

  if (Number.isNaN(flowId)) return null

  const handleReExecuteFlow = () => {
    FlowReExecuteMute({ flowId })
  }

  return (
    <Button loading={isReExecuteLoading} onClick={handleReExecuteFlow}>
      Re-execute
    </Button>
  )
}
