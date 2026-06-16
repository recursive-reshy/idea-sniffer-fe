// React
import { useDispatch, useSelector } from 'react-redux'
// MUI
import {
  Box, FormControl, MenuItem, Select, Slider,
  TextField, ToggleButton, ToggleButtonGroup, Typography
} from '@mui/material'
// Store
import { setMinPainScore, setCategory, setMarketSize, setSubreddit, setSortBy } from '@store/index'
import type { RootState, MarketSize } from '@store/index'

interface SignalFiltersProps {
  signalCount?: number
}

function SignalFilters( { signalCount }: SignalFiltersProps ) {
  const dispatch = useDispatch()
  const { minPainScore, category, marketSize, subreddit, sortBy } = useSelector( ( state: RootState ) => state.ui )

  return (
    <Box sx={ { display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', mb: 2 } }>

      <Box sx={ { display: 'flex', flexDirection: 'column', gap: 0.5 } }>
        <Typography variant="caption">PAIN ≥</Typography>
        <Box sx={ { display: 'flex', alignItems: 'center', gap: 1 } }>
          <Slider
            min={ 1 }
            max={ 10 }
            step={ 1 }
            value={ minPainScore }
            onChange={ ( _, value ) => dispatch( setMinPainScore( value as number ) ) }
            size="small"
            sx={ { width: 120 } }
          />
          <Typography variant="body2">{ minPainScore }</Typography>
        </Box>
      </Box>

      <Box sx={ { display: 'flex', flexDirection: 'column', gap: 0.5 } }>
        <Typography variant="caption">CATEGORY</Typography>
        <FormControl size="small" sx={ { minWidth: 180 } }>
          <Select
            value={ category }
            onChange={ ( e ) => dispatch( setCategory( e.target.value ) ) }
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="missing_tool">Missing Tool</MenuItem>
            <MenuItem value="broken_workflow">Broken Workflow</MenuItem>
            <MenuItem value="switching_frustration">Switching Frustration</MenuItem>
            <MenuItem value="manual_process">Manual Process</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Box sx={ { display: 'flex', flexDirection: 'column', gap: 0.5 } }>
        <Typography variant="caption">MARKET</Typography>
        <ToggleButtonGroup
          value={ marketSize }
          exclusive
          onChange={ ( _, value: MarketSize | null ) => { if ( value ) dispatch( setMarketSize( value ) ) } }
          size="small"
        >
          <ToggleButton value="all">All</ToggleButton>
          <ToggleButton value="small">Small</ToggleButton>
          <ToggleButton value="medium">Medium</ToggleButton>
          <ToggleButton value="large">Large</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Box sx={ { display: 'flex', flexDirection: 'column', gap: 0.5 } }>
        <Typography variant="caption">SUBREDDIT</Typography>
        <TextField
          size="small"
          placeholder="r/..."
          value={ subreddit }
          onChange={ ( e ) => dispatch( setSubreddit( e.target.value ) ) }
        />
      </Box>

      <Box sx={ { display: 'flex', flexDirection: 'column', gap: 0.5 } }>
        <Typography variant="caption">SORT</Typography>
        <FormControl size="small" sx={ { minWidth: 120 } }>
          <Select
            value={ sortBy }
            onChange={ ( e ) => dispatch( setSortBy( e.target.value as 'painScore' ) ) }
          >
            <MenuItem value="painScore">Pain Score</MenuItem>
          </Select>
        </FormControl>
      </Box>

      { signalCount != null && (
        <Typography variant="body2" sx={ { ml: 'auto' } }>
          { signalCount } signals
        </Typography>
      ) }

    </Box>
  )
}

export default SignalFilters
