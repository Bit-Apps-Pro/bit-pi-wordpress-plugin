import { $appConfig, $flowSetupModal } from '@common/globalStates'
import { Drawer, Modal } from 'antd'
import { useAtom, useAtomValue } from 'jotai'

import NodeDetailsModalActions from './NodeDetailsModalActions'

export default function NodeDetailsModalWrapper({ children }: { children: React.ReactNode }) {
  const [flowModal, setFlowModal] = useAtom($flowSetupModal)
  const appConfig = useAtomValue($appConfig)

  const closeModal = () => {
    setFlowModal(() => ({ isOpen: false, type: '', id: '' }))
  }

  if (appConfig.preferNodeDetailsInDrawer) {
    return (
      <Drawer
        width={550}
        open={flowModal.isOpen}
        onClose={closeModal}
        style={{ height: 'calc(100vh - 32px)', marginTop: 32 }}
        extra={<NodeDetailsModalActions />}
      >
        {children}
      </Drawer>
    )
  }

  return (
    <Modal
      centered
      width={550}
      open={flowModal.isOpen}
      onCancel={closeModal}
      footer={null}
      css
      title={<NodeDetailsModalActions wrapperCss={{ float: 'right', margin: '-4px 15px auto auto' }} />}
      style={{ maxHeight: 'calc(100vh - 32px)', marginTop: 32 }}
    >
      {children}
    </Modal>
  )
}
