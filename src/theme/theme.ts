import { createTheme } from '@mui/material/styles'
import { tokens } from './tokens'

export const darkTheme = createTheme( {
  palette: {
    mode: 'dark',
    background: {
      default: tokens.background.dark.default,
      paper: tokens.background.dark.paper
    },
    primary: {
      main: tokens.primary.dark
    }
  },
  components: {
    MuiAppBar: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: { backgroundColor: tokens.background.dark.paper }
      }
    }
  }
} )

export const lightTheme = createTheme( {
  palette: {
    mode: 'light',
    background: {
      default: tokens.background.light.default,
      paper: tokens.background.light.paper
    },
    primary: {
      main: tokens.primary.light
    }
  },
  components: {
    MuiAppBar: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: { backgroundColor: tokens.background.light.paper }
      }
    }
  }
} )
