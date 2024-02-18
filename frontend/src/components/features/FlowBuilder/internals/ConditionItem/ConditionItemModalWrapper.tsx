import { $appConfig } from '@common/globalStates'
import NodeDetailsModalActions from '@features/NodeDetailsModal/NodeDetailsModalActions'
import { Drawer, Modal } from 'antd'
import { useAtomValue } from 'jotai'

type ConditionItemWrapperType = {
  children: React.ReactNode
  onClose: () => void
}

export default function ConditionItemModalWrapper({ children, onClose }: ConditionItemWrapperType) {
  const appConfig = useAtomValue($appConfig)

  if (appConfig.preferNodeDetailsInDrawer) {
    return (
      <Drawer
        width={800}
        open
        onClose={onClose}
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
      width={800}
      open
      onCancel={onClose}
      footer={null}
      title={<NodeDetailsModalActions wrapperCss={{ float: 'right', margin: '-4px 15px auto auto' }} />}
      style={{ maxHeight: 'calc(100vh - 32px)', marginTop: 32 }}
    >
      {children}
    </Modal>
  )
}
