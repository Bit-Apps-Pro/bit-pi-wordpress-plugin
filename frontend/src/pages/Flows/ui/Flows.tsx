import { type ChangeEvent, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { $appConfig } from '@common/globalStates'
import $flowDetailsSelector from '@common/globalStates/$flowDetails'
import $flows from '@common/globalStates/$flows'
import useDebounce from '@common/hooks/useDebounce'
import FlowItem from '@components/features/FlowItem'
import { useTheme } from '@emotion/react'
import fItemCss from '@features/FlowItem/FlowItem.style'
import { type FlowItemType } from '@features/FlowItem/FlowItemType'
import LucideIcn from '@icons/LucideIcn'
import useSaveFlow from '@pages/FlowDetails/data/useSaveFlow'
import useFetchFlows from '@pages/Flows/data/useFetchFlows'
import FlowLoaderSkeleton from '@pages/Flows/shared/FlowLoaderSkeleton'
import FlowTags from '@pages/Flows/shared/FlowTags'
import ut from '@resource/utilsCssInJs'
import Input from '@utilities/Input'
import { Input as AntInput, Col, Empty, Form, Modal, Pagination, Row, Space, Typography } from 'antd'
import { useAtom, useAtomValue } from 'jotai'

import css from './Flows.module.css'

export default function Flows() {
  const { page } = useParams()
  const pageNo = Number(page) || 1
  const limit = 14
  const [searchedInputValue, setSearchedInputValue] = useState('')
  const searchDebounceValue = useDebounce<string>(searchedInputValue, 400)
  const [activeTag, setActiveTag] = useState<number[]>([])
  const [createFlowModalStatus, setCreateFlowModalStatus] = useState<boolean>(false)
  const [flowTitle, setFlowTitle] = useState<string>('')
  const [errorMsg, setErrorMsg] = useState<string>('')
  const flowDetails = useAtomValue($flowDetailsSelector)
  const { isFlowsLoading, isFlowsFetching, fetchedFlows, totalFetchedFlow } = useFetchFlows({
    searchKeyValue: {
      title: searchDebounceValue,
      tags: activeTag
    },
    pageNo,
    limit
  })
  const { saveFlow, isFlowSaving } = useSaveFlow()
  const { token } = useTheme()
  const navigate = useNavigate()
  const [flows, setFlows] = useAtom($flows)
  const { isDarkTheme } = useAtomValue($appConfig)

  useEffect(() => {
    if (fetchedFlows) setFlows(fetchedFlows)
  }, [setFlows, fetchedFlows])

  const searchFlowHandler = ({ target: { value } }: ChangeEvent<HTMLInputElement>): void => {
    navigate('/flows')
    setSearchedInputValue(value)
  }

  const createFlow = async () => {
    setErrorMsg('')
    if (!flowTitle) {
      setErrorMsg('Please, enter a flow name.')
    }

    await saveFlow({ ...flowDetails, title: flowTitle })
  }

  const paginationHandler = (pageNum: number) => {
    navigate(`/flows/${pageNum}`)
  }

  return (
    <div className={css.flowsWrapper}>
      <Row align="middle" justify="space-between" className={css.flowsHeader}>
        <Typography.Title level={3} className="mt-2">
          Flows
        </Typography.Title>

        <AntInput
          type="search"
          allowClear
          prefix={<LucideIcn name="search" />}
          placeholder="Search"
          onChange={searchFlowHandler}
          css={{ width: '200px !important' }}
        />
      </Row>

      <FlowTags activeTag={activeTag} setActiveTag={setActiveTag} />

      {isFlowsFetching ? (
        <FlowLoaderSkeleton flowQuantity={4} />
      ) : (
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={8} lg={6}>
            <button
              aria-label="Create Flow"
              type="button"
              onClick={() => setCreateFlowModalStatus(true)}
              css={[
                fItemCss(token).item,
                ut({
                  w: '100%',
                  h: '100%',
                  mnh: '110px',
                  bg: isDarkTheme ? 'transparent' : 'colorBgContainer',
                  cur: 'pointer'
                })
              ]}
            >
              <Typography.Text>
                <Space>
                  <LucideIcn name="plus" size={36} />
                  Create Flow
                </Space>
              </Typography.Text>
            </button>
          </Col>

          {!!totalFetchedFlow &&
            flows &&
            flows?.map((flow: FlowItemType) => (
              <Col xs={24} sm={12} md={8} lg={6} key={flow.id}>
                <FlowItem
                  id={flow.id}
                  title={flow.title}
                  count={flow.run_count}
                  nodes={flow.nodes.slice(0, 3)}
                  nodesCount={flow.nodesCount}
                  isFlowActive={Boolean(flow.is_active)}
                  tagId={flow.tag_id}
                />
              </Col>
            ))}
        </Row>
      )}

      {!isFlowsLoading && !isFlowsFetching && !totalFetchedFlow && (
        <Empty description="No Flow Found" image={Empty.PRESENTED_IMAGE_SIMPLE} />
      )}

      {totalFetchedFlow > limit && (
        <Pagination
          current={pageNo}
          pageSize={limit}
          total={totalFetchedFlow}
          onChange={paginationHandler}
          showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
          className={css.flowPagination}
        />
      )}

      <Modal
        title="Create Flow"
        centered
        open={createFlowModalStatus}
        okText="Create"
        onOk={createFlow}
        onCancel={() => setCreateFlowModalStatus(false)}
        okButtonProps={{ 'aria-label': 'Flow title save button' }}
        confirmLoading={isFlowSaving}
      >
        <Form onSubmitCapture={createFlow}>
          <Input
            aria-label="Flow title input"
            label="Title"
            name="createFlowTitle"
            value={flowTitle}
            type="text"
            placeholder="Write title here..."
            onChange={e => setFlowTitle(e.target.value)}
            status={errorMsg ? 'error' : ''}
            invalidMessage={errorMsg}
          />
        </Form>
      </Modal>
    </div>
  )
}
