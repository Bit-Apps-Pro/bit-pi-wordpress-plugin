import { useState } from 'react'

import LucideIcn from '@icons/LucideIcn'
import { Button } from 'antd'

import FlowHistoriesModal from './FlowHistoriesModal'

export default function FlowHistories() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleOpen = () => {
    setIsModalOpen(true)
  }

  const handleClose = () => {
    setIsModalOpen(false)
  }

  return (
    <>
      <Button onClick={handleOpen} className="mr-2" icon={<LucideIcn name="alert-circle" />}>
        Logs
      </Button>

      {isModalOpen && <FlowHistoriesModal closeModal={handleClose} />}
    </>
  )
}
