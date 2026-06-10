export const tokens = {
  background: {
    dark: { default: '#0e0e0e', paper: '#161616' },
    light: { default: '#f5f5f5', paper: '#ffffff' }
  },
  primary: {
    dark: '#5DCAA5',
    light: '#0F6E56'
  },
  score: {
    high: '#E05252',
    mid: '#E09A2B',
    low: '#6B7280'
  },
  status: {
    pass: '#5DCAA5',
    drop: '#E05252',
    pending: '#E09A2B'
  },
  category: {
    missing_tool: 'primary',
    broken_workflow: 'error',
    switching_frustration: 'warning',
    manual_process: 'secondary'
  }
} as const
