import { type ReactElement } from 'react'

import { $flowSetupModal } from '@common/globalStates'
import { useAtomValue } from 'jotai'

import NodeDetailsModal from './NodeDetailsModal'

export default function NodeDetailsWrapper({ children }: { children: ReactElement }) {
  const { isOpen } = useAtomValue($flowSetupModal)

  return (
    <>
      {isOpen && <NodeDetailsModal />}

      {children}
    </>
  )
}
