import { useId, useRef, useState } from 'react'

import { ExclamationCircleOutlined } from '@ant-design/icons'
import useDeleteTag from '@pages/Flows/shared/FlowTags/data/useDeleteTag'
import useSaveTag from '@pages/Flows/shared/FlowTags/data/useSaveTag'
import useTags from '@pages/Flows/shared/FlowTags/data/useTags'
import useUpdateTag from '@pages/Flows/shared/FlowTags/data/useUpdateTag'
import useUpdateTagStatus from '@pages/Flows/shared/FlowTags/data/useUpdateTagStatus'
import Input from '@utilities/Input'
import TagFilter from '@utilities/TagFilter'
import { Form, Modal } from 'antd'
import { create } from 'mutative'

import { type TagType, type TagsPropsType } from './FlowTagType'

export default function FlowTags({ activeTag, setActiveTag }: TagsPropsType) {
  const { tags, refetchTag } = useTags()
  const { saveTag, isSavingTag } = useSaveTag()
  const { updateTag, isUpdatingTag } = useUpdateTag()
  const { updateTagStatus } = useUpdateTagStatus()
  const { deleteTag } = useDeleteTag()

  const [tagModalActive, setTagModalActive] = useState<boolean>(false)
  const [editTagModalActive, setEditTagModalActive] = useState<boolean>(false)
  const [tagName, setTagName] = useState('')
  const [error, setError] = useState<Record<string, string[]>>()

  const [modal, contextHolder] = Modal.useModal()
  const selectedTag = useRef<number>()

  const selectTag = (tagId: TagType['id']) => {
    setActiveTag(prev =>
      create(prev, draft => {
        if (tagId === 0) return []

        if (prev.includes(tagId)) {
          return draft.filter(prevTag => prevTag !== tagId)
        }

        draft.push(tagId)
      })
    )
  }

  const saveTagHandler = async () => {
    const { data, status } = await saveTag(tagName)
    if (status === 'error') {
      setError(data as unknown as Record<string, string[]>)
      return
    }

    setTagName('')
    setTagModalActive(false)
    refetchTag()
    setError(undefined)
  }

  const deleteTagHandler = async () => {
    if (selectedTag.current) {
      await deleteTag(selectedTag.current)
      refetchTag()
    }
  }

  const deleteConfirmation = (tagId: TagType['id']) => {
    selectedTag.current = tagId

    modal.confirm({
      title: 'Are you Confirm to Delete?',
      content: "If you delete you can't recover it",
      icon: <ExclamationCircleOutlined />,
      onOk: deleteTagHandler,
      okText: 'Delete'
    })
  }

  const editTagModalOpen = (tagId: TagType['id']) => {
    const editTag = tags.find(tag => tag.id === tagId)
    if (!editTag) return

    selectedTag.current = tagId
    setTagName(editTag.title)
    setEditTagModalActive(true)
  }

  const pinTag = async (tagId: TagType['id']) => {
    const pinnedTag = tags.find(tag => tag.id === tagId)
    if (!pinnedTag) return

    await updateTagStatus({ id: tagId, status: !Number(pinnedTag.status) })
    refetchTag()
  }

  const addTagModal = () => {
    setTagName('')
    setTagModalActive(true)
  }

  const updateTagHandler = (tagId: TagType['id']) => async () => {
    const { data, status } = await updateTag({ id: tagId, title: tagName })

    if (status === 'error') {
      setError(data as unknown as Record<string, string[]>)
      return
    }

    setTagName('')
    setEditTagModalActive(false)
    refetchTag()
    setError(undefined)
  }

  const tagsList = tags.map(tag => ({
    id: tag.id,
    label: tag.title,
    pinned: Boolean(Number(tag.status)),
    active: activeTag.includes(tag.id)
  }))

  return (
    <>
      {contextHolder}
      <TagFilter
        tagsList={tagsList}
        onAdd={addTagModal}
        onEdit={editTagModalOpen}
        onRemove={deleteConfirmation}
        onPin={pinTag}
        onUnpin={pinTag}
        onActive={selectTag}
        onInactive={selectTag}
        className="mt-2 mb-4"
      />

      <Modal
        key={`tag-confirmation-modal-${useId}`}
        open={tagModalActive}
        title="Add Tag"
        okText="Save"
        onOk={saveTagHandler}
        onCancel={() => setTagModalActive(false)}
        okButtonProps={{ disabled: !tagName.length }}
        confirmLoading={isSavingTag}
      >
        <div className="mt-4">
          <Form onSubmitCapture={saveTagHandler}>
            <Input
              name="tagName"
              title="Tag name"
              value={tagName}
              onChange={e => setTagName(e.target.value)}
              placeholder="Write tag name"
              status={error?.title && 'error'}
              invalidMessage={error?.title?.[0]}
            />
          </Form>
        </div>
      </Modal>

      <Modal
        key={`tag-edit-modal-${useId}`}
        open={editTagModalActive}
        title="Edit Tag"
        okText="Update"
        onOk={updateTagHandler(selectedTag.current || 0)}
        onCancel={() => setEditTagModalActive(false)}
        okButtonProps={{ disabled: !tagName.length }}
        confirmLoading={isUpdatingTag}
      >
        <Form onSubmitCapture={updateTagHandler(selectedTag.current || 0)}>
          <Input
            name="title"
            title="Tag name"
            value={tagName}
            onChange={e => setTagName(e.target.value)}
            placeholder="Edit tag name"
            status={error?.title && 'error'}
            invalidMessage={error?.title?.[0]}
          />
        </Form>
      </Modal>
    </>
  )
}
