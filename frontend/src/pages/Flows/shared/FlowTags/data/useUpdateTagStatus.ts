import request from '@common/helpers/request'
import { type TagType } from '@pages/Flows/shared/FlowTags/ui/FlowTagType'
import { useMutation } from '@tanstack/react-query'

export default function useUpdateTagStatus() {
  const { mutateAsync, isLoading } = useMutation({
    mutationKey: ['update_tag_status'],
    mutationFn: async (tagData: Pick<TagType, 'id' | 'status'>) => request('tags/updateStatus', tagData)
  })

  return {
    updateTagStatus: mutateAsync,
    isUpdatingTagStatus: isLoading
  }
}
