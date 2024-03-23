import request from '@common/helpers/request'
import { type TagType } from '@pages/Flows/shared/FlowTags/ui/FlowTagType'
import { type UseQueryResult } from '@tanstack/react-query'
import { useQuery } from '@tanstack/react-query'

interface TagResType {
  data: TagType[]
}

export default function useTags() {
  const { isLoading, data, refetch }: UseQueryResult<TagResType, Error> = useQuery({
    queryKey: ['all_tags'],
    queryFn: async () => request('tags', null, null, 'GET')
  })

  return {
    tags: data?.data || [],
    isTagsLoading: isLoading,
    refetchTag: refetch
  }
}
