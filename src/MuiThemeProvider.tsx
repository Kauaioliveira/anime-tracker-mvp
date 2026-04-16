import { useMemo, type ReactNode } from 'react'
import { createTheme, ThemeProvider } from '@mui/material/styles'

type MuiThemeProviderProps = {
  children: ReactNode
}

export function MuiThemeProvider({ children }: MuiThemeProviderProps) {
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: 'dark',
          primary: { main: '#a78bfa' },
          background: {
            default: 'transparent',
            paper: '#14101f',
          },
        },
        typography: {
          fontFamily: '"Roboto", system-ui, sans-serif',
        },
        shape: { borderRadius: 8 },
      }),
    [],
  )

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>
}
