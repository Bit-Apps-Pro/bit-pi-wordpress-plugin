import request from '@common/helpers/request'
import { type FlowItemType } from '@features/FlowItem/FlowItemType'
import { useQuery } from '@tanstack/react-query'

interface SearchType {
  searchKeyValue: {
    title: string
    tags: number[]
  }
  pageNo: number
  limit: number
}
interface FetchedFlowsType {
  flows: FlowItemType[]
  totalFetchedFlow: number
}

export default function useFetchFlows(searchData: SearchType) {
  const concatSelectedTags = searchData?.searchKeyValue?.tags.reduce(
    (concatTag: string, tag: number) => concatTag + tag,
    ''
  )
  const queryId = `${concatSelectedTags}-${searchData.pageNo}-${searchData.searchKeyValue.title}`

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['search_flows', queryId],
    queryFn: async () => request<FetchedFlowsType>('flows/search', searchData)
  })

  return {
    isFlowsLoading: isLoading,
    isFlowsFetching: isFetching,
    fetchedFlows: data?.data.flows,
    totalFetchedFlow: data?.data?.totalFetchedFlow || 0
  }
}
