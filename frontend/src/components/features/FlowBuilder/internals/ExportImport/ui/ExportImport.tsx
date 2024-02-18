import { useState } from 'react'
import { useParams } from 'react-router-dom'

import config from '@config/config'
import useImportFlow from '@features/FlowBuilder/internals/ExportImport/data/useImportFlow'
import LucideIcn from '@icons/LucideIcn'
import { Button, Dropdown, Input, type MenuProps, Modal, Typography } from 'antd'

function getUploadUrl(action: string) {
  const { AJAX_URL, NONCE, ROUTE_PREFIX } = config
  const uri = new URL(AJAX_URL)
  uri.searchParams.append('action', `${ROUTE_PREFIX}${action}`)
  uri.searchParams.append('_ajax_nonce', NONCE)

  return uri.toString()
}

const exportImportItems = (flowId: number): MenuProps['items'] => [
  {
    key: 'export',
    label: (
      <a href={getUploadUrl(`flow-export/${flowId}`)} rel="noreferrer" className="link-reset">
        <LucideIcn name="upload" /> Export Flow
      </a>
    )
  },
  {
    key: 'import',
    label: (
      <>
        <LucideIcn name="download" /> Import Flow
      </>
    )
  }
]

const defaultValue = { file: undefined, value: '' }

export default function ExportImport() {
  const flowId = Number(useParams()?.flowId)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [importFile, setImportFile] = useState<{ file: File | undefined; value: string }>(defaultValue)
  const [error, setError] = useState<string>()
  const { importFlow } = useImportFlow(flowId)

  if (Number.isNaN(flowId)) return null

  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  const handleOk = async () => {
    if (!importFile?.file) {
      setError('Please select a valid file to import')
      return
    }

    const formData = new FormData()
    formData.append('flow_blueprint', importFile.file, importFile.file.name)

    const { status, data } = await importFlow(formData)

    if (status === 'success') {
      setImportFile(defaultValue)
      setError(undefined)
      closeModal()
    } else {
      setError(data.message || 'Something went wrong')
    }
  }

  const handleExportImport = (key: string) => {
    if (key === 'import') {
      openModal()
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]

    if (!file) {
      setImportFile(defaultValue)
      return
    }

    setError(undefined)
    setImportFile({ file, value: e.target.value })
  }

  return (
    <>
      <Dropdown
        menu={{ items: exportImportItems(flowId), onClick: item => handleExportImport(item.key) }}
        placement="bottomRight"
        trigger={['click']}
        className="mr-2"
        arrow
      >
        <Button icon={<LucideIcn name="more-vertical" />} />
      </Dropdown>

      <Modal title="Import Flow" open={isModalOpen} onOk={handleOk} onCancel={closeModal}>
        <Input
          value={importFile.value}
          onChange={handleFileChange}
          placeholder="Enter Flow Name"
          type="file"
          css={{ paddingLeft: '6px !important' }}
          status={error ? 'error' : undefined}
        />
        {error && <Typography.Text type="danger">{error}</Typography.Text>}
      </Modal>
    </>
  )
}
