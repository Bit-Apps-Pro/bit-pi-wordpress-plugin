type FlowHistoryType = {
  id: number
  status: string
  created_at: string
}

type FlowHistoriesType = {
  data: {
    data: FlowHistoryType[] | undefined
    last_page: number
    pages: number
    total: number
    current_page: number
    per_page: number
  }
}

// type SaveResType = { data: FlowHistoryType } | undefined
