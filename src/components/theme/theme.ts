import { createTheme } from '@mui/material/styles'

declare module '@mui/material/styles' {
  interface Palette {
    blueShade: Palette['primary']
    greenShade: Palette['primary']
    orangeShade: Palette['primary']
    pinkShade: Palette['primary']
    purpleShade: Palette['primary']
    yellowShade: Palette['primary']
  }
  interface PaletteOptions {
    blueShade: PaletteOptions['primary']
    greenShade: PaletteOptions['primary']
    orangeShade: PaletteOptions['primary']
    pinkShade: PaletteOptions['primary']
    purpleShade: PaletteOptions['primary']
    yellowShade: PaletteOptions['primary']
  }
}

const theme = createTheme({
  palette: {
    blueShade: {
      dark: '#00C8FF',
      light: '#00C8FF',
      main: '#0050FC',
    },
    error: {
      dark: '#FE7373',
      light: '#FE7373',
      main: '#FF0550',
    },
    greenShade: {
      dark: '#51F0A0',
      light: '#51F0A0',
      main: '#00DD55',
    },
    mode: 'light',
    orangeShade: {
      dark: '#FFC300',
      light: '#FFC300',
      main: '#FC5800',
    },
    pinkShade: {
      dark: '#FF70AE',
      light: '#FF70AE',
      main: '#FF006F',
    },
    primary: {
      dark: '#00C8FF',
      light: '#00C8FF',
      main: '#0050FC',
    },
    purpleShade: {
      dark: '#B973FE',
      light: '#B973FE',
      main: '#8305FF',
    },
    yellowShade: {
      dark: '#FFD900',
      light: '#FFD900',
      main: '#FFBB00',
    },
  },
  typography: {
    button: {
      fontWeight: 600,
      textTransform: 'none',
    },
    fontFamily: 'Poppins, sans-serif',
  },
})

export default theme
