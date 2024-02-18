import $flowDetailsSelector, { type FlowType } from '@common/globalStates/$flowDetails'
import { Input } from 'antd'
import { useAtom } from 'jotai'
import { create } from 'mutative'

export default function FlowTitle() {
  const [flowDetails, setFlowDetails] = useAtom($flowDetailsSelector)

  const saveTitle = (title: string) => {
    setFlowDetails((flow: FlowType) =>
      create(flow, draft => {
        draft.title = title
      })
    )
  }

  return (
    <Input
      className="mb-1 d-ib"
      bordered={false}
      placeholder="Enter flow title"
      value={flowDetails?.title || ''}
      onChange={e => saveTitle(e.target.value)}
      onBlur={e => saveTitle(e.target.value)}
    />
  )
}
