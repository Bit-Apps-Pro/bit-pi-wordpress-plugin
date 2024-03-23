import $flowDetailsSelector from '@common/globalStates/$flowDetails'
import $flowSaving from '@common/globalStates/$flowSaving'
import request from '@common/helpers/request'
import { useAtomValue, useSetAtom } from 'jotai'

import useMemoDebounce from './useMemoDebounce'

export default function useSaveFlowDetails() {
  const setFlowSaving = useSetAtom($flowSaving)
  const flowDetails = useAtomValue($flowDetailsSelector)

  useMemoDebounce(
    async () => {
      if (!flowDetails.id) return

      const flowData = {
        id: flowDetails.id,
        flow: {
          title: flowDetails.title,
          is_active: flowDetails.is_active,
          map: flowDetails.map,
          data: flowDetails.data,
          triggerType: flowDetails.triggerType
        }
      }

      setFlowSaving(true)
      await request('flows/update', flowData)
      setFlowSaving(false)
    },
    500,
    [flowDetails]
  )
}
