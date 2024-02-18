import request from '@common/helpers/request'
import { type TagType } from '@pages/Flows/shared/FlowTags/ui/FlowTagType'
import { useMutation } from '@tanstack/react-query'

export default function useSaveTag() {
  const { mutateAsync, isLoading } = useMutation({
    mutationKey: ['save_tags'],
    mutationFn: async (tagData: Pick<TagType, 'title'>) => request<TagType>('tags/save', tagData)
  })

  return {
    saveTag: mutateAsync,
    isSavingTag: isLoading
  }
}
