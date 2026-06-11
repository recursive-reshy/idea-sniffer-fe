export interface RedditRunRequest {
  subreddits: string[]
  sort_by?: string
}

export interface RedditRunResponse {
  runId: string
  snapshotId: string
}

export type SnapshotStatusValue = 'starting' | 'running' | 'ready' | 'failed'

export interface SnapshotStatusResponse {
  snapshotId: string
  status: SnapshotStatusValue
}

export interface IngestSnapshotRequest {
  runId: string
}

export interface IngestSnapshotResponse {
  runId: string
  totalFetched: number
  stored: number
  skipped: number
  elapsed: string
}

export interface Run {
  id: string
  provider: string
  snapshotId: string
  status: 'PENDING' | 'SCRAPING' | 'READY' | 'INGESTING' | 'COMPLETE' | 'FAILED'
  subreddit: string | null
  sortBy: string | null
  totalFetched: number
  totalStored: number
  totalSkipped: number
  totalFailed: number
  startedAt: string | null
  completedAt: string | null
  createdAt: string
}

export interface GetRedditRunsParams {
  provider?: string
  page?: number
  limit?: number
}

export interface OptimisticRun {
  localId: string
  snapshotId: string
  subreddits: string[]
  status: 'scraping' | 'ingesting' | 'complete' | 'failed'
  startedAt: string
  totalStored?: number
  totalSkipped?: number
  elapsed?: string
}
