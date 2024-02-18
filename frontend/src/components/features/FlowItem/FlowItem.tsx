import { type KeyboardEvent, type MouseEvent, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { ExclamationCircleOutlined } from '@ant-design/icons'
import $flows from '@common/globalStates/$flows'
import { lighten } from '@common/helpers/globalHelpers'
import { useTheme } from '@emotion/react'
import { getAppBySlug } from '@features/FlowBuilder/helpers/FlowBuilderHelper'
import LucideIcn from '@icons/LucideIcn'
import Wire from '@icons/Wire'
import useDeleteFlow from '@pages/FlowDetails/data/useDeleteFlow'
import useUpdateFlow, { type NewTagType } from '@pages/FlowDetails/data/useUpdateFlow'
import useFetchTags from '@pages/Flows/shared/FlowTags/data/useFetchTags'
import { type TagType } from '@pages/Flows/shared/FlowTags/ui/FlowTagType'
import Input from '@utilities/Input'
import Select from '@utilities/Select'
import { Button, Dropdown, type MenuProps, Modal, Space, Switch, Typography } from 'antd'
import { type DefaultOptionType } from 'antd/es/select'
import { motion } from 'framer-motion'
import { useSetAtom } from 'jotai'
import { create } from 'mutative'

import css from './FlowItem.module.css'
import fItemCss from './FlowItem.style'
import { type FlowItemType } from './FlowItemType'

interface FlowItemProps {
  id: number
  title: string
  count: number
  isFlowActive: boolean
  tagId: string
  nodes: string[]
  nodesCount: number
}

export default function FlowItem({
  title,
  count,
  id,
  isFlowActive,
  tagId,
  nodes,
  nodesCount
}: FlowItemProps): JSX.Element {
  const [flowStatus, setFlowStatus] = useState(isFlowActive)
  const { deleteFlowMutate } = useDeleteFlow()
  const { updateFlow, updateFlowData, isFlowUpdating } = useUpdateFlow()
  const [flowTitle, setFlowTitle] = useState(title)
  const setFlows = useSetAtom($flows)
  const [activeModal, setActiveModal] = useState({ isActive: false, layoutId: '' })
  const { fetchedTags, refetchTag } = useFetchTags()
  const { token } = useTheme()

  const flowTags = tagId
    ? fetchedTags.filter((tag: TagType) =>
        tagId
          .split(',')
          .map(item => Number(item))
          .includes(tag.id)
      )
    : []
  const selectedTagsTitle = flowTags.map((tag: TagType) => tag.title)

  const [selectedTag, setSelectedTag] = useState<string[]>(selectedTagsTitle)
  const moreNodesCount = nodesCount - 3

  useEffect(() => {
    setFlowTitle(title)
  }, [title])

  useEffect(() => {
    if (updateFlowData) {
      setFlows((prevFlow: FlowItemType[]) =>
        create(prevFlow, (draftFlow: FlowItemType[]) => {
          draftFlow.forEach((flowDetails: FlowItemType) => {
            if (flowDetails.id === updateFlowData.flowDetails.id) {
              flowDetails.tag_id = updateFlowData.flowDetails.tag_id // eslint-disable-line no-param-reassign
              flowDetails.title = updateFlowData.flowDetails.title // eslint-disable-line no-param-reassign
            }
          })

          return draftFlow
        })
      )
    }
    if (updateFlowData && updateFlowData?.insertedNewTags?.length) {
      refetchTag()
    }
  }, [updateFlowData])

  const closeModal = () => setActiveModal({ isActive: false, layoutId: '' })

  const deleteFlow = (flowId: number) => () => {
    deleteFlowMutate({ id: flowId })

    setFlows((prv: FlowItemType[]) =>
      create(prv, (draft: FlowItemType[]) =>
        draft.filter((currentFlow: FlowItemType) => Number(currentFlow.id) !== flowId)
      )
    )
  }

  const flowStatusChange = (checked: boolean, e: MouseEvent, flowId: number) => {
    e.preventDefault()
    e.stopPropagation()
    setFlowStatus(checked)
    updateFlow({ flow: { is_active: Number(checked) }, id: flowId })
  }

  const editFlowHandler = (flowId: number) => async () => {
    const findNewTags = selectedTag.filter(
      (tag: string) => !fetchedTags.find(value => value.title === tag)
    )
    const findOldTags = fetchedTags.filter((tag: TagType) => selectedTag.includes(tag.title))

    const newTags = findNewTags.reduce((concatTags: NewTagType[], tag: string) => {
      concatTags.push({ title: tag, slug: tag.toLowerCase().replace(/\s/g, '-') })
      return concatTags
    }, [])

    const concatTagIds = findOldTags.reduce(
      (concatIds: string, tag: TagType) => `${concatIds},${tag.id}`,
      ''
    )

    await updateFlow({
      tag: { newTags, oldTags: concatTagIds.slice(1) },
      flow: { title: flowTitle },
      id: flowId
    })
    closeModal()
  }

  const [modal, contextHolder] = Modal.useModal()

  const deleteFlowHandler = (
    e: MouseEvent<HTMLElement> | KeyboardEvent<HTMLElement>,
    flowId: string | number
  ) => {
    e.stopPropagation()

    modal.confirm({
      title: 'Are you Confirm to Delete?',
      content: "If you delete you can't recover it",
      icon: <ExclamationCircleOutlined />,
      onOk: deleteFlow(Number(flowId)),
      okText: 'Delete'
    })
  }

  const tagOptions: DefaultOptionType[] = fetchedTags.map((tag: TagType) => ({
    value: tag.title,
    label: tag.title
  }))

  const openModalHandler = (e: MouseEvent<HTMLElement> | KeyboardEvent<HTMLElement>) => {
    e.stopPropagation()
    setActiveModal({ isActive: true, layoutId: `flowDetails-${id}` })
  }

  const items: MenuProps['items'] = [
    {
      key: '2',
      label: (
        <Space>
          <LucideIcn name="pencil" /> Edit
        </Space>
      ),
      onClick: ({ domEvent }) => openModalHandler(domEvent)
    },
    {
      key: '1',
      danger: true,
      label: (
        <Space>
          <LucideIcn name="trash-2" /> Delete
        </Space>
      ),
      onClick: ({ domEvent }) => deleteFlowHandler(domEvent, id)
    }
  ]

  const handleChangeTag = (values: string[]) => {
    setSelectedTag(values)
  }

  return (
    <>
      {contextHolder}
      <Link to={`/flows/details/${id}`} className="link-reset">
        <motion.div className="p-2" css={fItemCss(token).item} layout layoutId={`flowDetails-${id}`}>
          <div className={css.itemHeader}>
            <div className={css.itemHeaderIcon}>
              {nodes?.map((appSlug, index) => {
                const app = getAppBySlug(appSlug)
                return (
                  <span
                    key={`${appSlug}-${index * 2}`}
                    className={css.imgWrap}
                    css={{
                      border: `1px solid ${lighten(app?.color, -100)}`,
                      backgroundColor: app?.color,
                      outline: `3px solid ${token.colorBgContainer}`
                    }}
                  >
                    {app?.iconURL && <img src={app.iconURL} alt={appSlug} />}
                    {index === 2 && moreNodesCount > 0 && (
                      <span className={css.nodesCount}>{`${moreNodesCount}+`}</span>
                    )}
                  </span>
                )
              })}
            </div>
            <Space>
              <Dropdown menu={{ items }} trigger={['click']} arrow placement="bottom">
                <Button
                  shape="circle"
                  onClick={(e: MouseEvent) => e.preventDefault()}
                  type="text"
                  icon={<LucideIcn name="more-vertical" />}
                />
              </Dropdown>
              <Switch
                size="small"
                onChange={(checked, e) => flowStatusChange(checked, e, Number(id))}
                checked={flowStatus}
              />
            </Space>
          </div>

          <div>
            <Typography.Text className={css.itemTitle} ellipsis>
              {title}
            </Typography.Text>
          </div>

          <Typography.Text>
            <Wire size={13} /> {count}
          </Typography.Text>
        </motion.div>
      </Link>

      <Modal
        title="Edit Flow"
        open={activeModal.isActive}
        okText="Update"
        onOk={editFlowHandler(Number(id))}
        onCancel={closeModal}
        confirmLoading={isFlowUpdating}
      >
        <Input
          label="Title"
          name={`editFlowTitle-${id}`}
          value={flowTitle}
          type="text"
          placeholder="Edit flow title"
          onChange={e => setFlowTitle(e.target.value)}
        />
        <Select
          wrapperClassName="mt-2"
          label="Tags"
          mode="tags"
          placeholder="Tags"
          onChange={handleChangeTag}
          value={selectedTag}
          options={tagOptions}
        />
      </Modal>
    </>
  )
}
