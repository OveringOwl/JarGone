import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    greenShade: Palette['primary'];
    pinkShade: Palette['primary'];
    blueShade: Palette['primary'];
    purpleShade: Palette['primary'];
    orangeShade: Palette['primary'];
    yellowShade: Palette['primary'];
  }
  interface PaletteOptions {
    greenShade: PaletteOptions['primary'];
    pinkShade: PaletteOptions['primary'];
    blueShade: PaletteOptions['primary'];
    purpleShade: PaletteOptions['primary'];
    orangeShade: PaletteOptions['primary'];
    yellowShade: PaletteOptions['primary'];
  }
}

const theme = createTheme({
  typography: {
    fontFamily: 'Poppins, sans-serif',
  },
  palette: {
    mode: 'light',
    primary: {
      main: '#00DD55',
      light: '#51F0A0',
      dark: '#51F0A0',
    },
    error: {
      main: '#FF0550',
      light: '#FE7373',
      dark: '#FE7373',
    },
    greenShade: {
      main: '#00DD55',
      light: '#51F0A0',
      dark: '#51F0A0',
    },
    pinkShade: {
      main: '#FF006F',
      light: '#FF70AE',
      dark: '#FF70AE',
    },
    blueShade: {
      main: '#0050FC',
      light: '#00C8FF',
      dark: '#00C8FF',
    },
    purpleShade: {
      main: '#8305FF',
      light: '#B973FE',
      dark: '#B973FE',
    },
    orangeShade: {
      main: '#FC5800',
      light: '#FFC300',
      dark: '#FFC300',
    },
    yellowShade: {
      main: '#FFBB00',
      light: '#FFD900',
      dark: '#FFD900',
    },
  },
});

export default theme
