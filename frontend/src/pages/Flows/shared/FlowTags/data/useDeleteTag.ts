import request from '@common/helpers/request'
import { type TagType } from '@pages/Flows/shared/FlowTags/ui/FlowTagType'
import { useMutation } from '@tanstack/react-query'

export default function useDeleteTag() {
  const { mutateAsync } = useMutation({
    mutationKey: ['delete_tags'],
    mutationFn: async (tagData: Pick<TagType, 'id'>) => request('tags/delete', tagData)
  })

  return {
    deleteTag: mutateAsync
  }
}
