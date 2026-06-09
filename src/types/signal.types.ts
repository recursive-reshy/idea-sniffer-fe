export interface SilverSignal {
  // TODO: fill in fields when backend shape is confirmed
  [key: string]: unknown
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export interface DistillResult {
  runId: string
  stats: {
    total: number
    promoted: number
    rejected: number
    failed: number
    totalCostUsd: number
    haltedEarly: boolean
  }
}
