// MUI
import type { ReactNode } from 'react'
import { Box } from '@mui/material'

type Props = {
  children: ReactNode
}

export default function PageContainer( { children }: Props ) {
  return (
    <Box sx= { { p: 2 } }>{ children }</Box>
  )
}
 