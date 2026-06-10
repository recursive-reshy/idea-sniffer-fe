// MUI
import { Box, LinearProgress } from '@mui/material'
// Types
import type { LinearProgressProps } from '@mui/material/LinearProgress'

type Props = LinearProgressProps & {
  isLoading: boolean
}

function LoadingLinear( { isLoading, ...props }: Props ) {
  return (
    <Box sx={ { height: 8 } }>
      { isLoading && 
        <LinearProgress {...props} />
      }
    </Box>
  )
}

export default LoadingLinear