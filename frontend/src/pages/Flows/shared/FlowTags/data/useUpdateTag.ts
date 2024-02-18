import request from '@common/helpers/request'
import { type TagType } from '@pages/Flows/shared/FlowTags/ui/FlowTagType'
import { useMutation } from '@tanstack/react-query'

export default function useUpdateTag() {
  const { mutateAsync, isLoading } = useMutation({
    mutationKey: ['update_tags'],
    mutationFn: async (tagData: Pick<TagType, 'id' | 'title'>) => request('tags/update', tagData)
  })

  return {
    updateTag: mutateAsync,
    isUpdatingTag: isLoading
  }
}
