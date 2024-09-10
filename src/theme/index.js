import { createTheme, colors } from '@material-ui/core';
import shadows from './shadows';
import typography from './typography';

const theme = createTheme({
  palette: {
    background: {
      dark: '#f6f8fa',
      default: '#f6f8fa',
      // paper: colors.common.white
    },
    primary: {
      main: '#4a83fb',
      light: '#4a83fb',
      dark: '#4a83fb',
    },
    secondary: {
      light: '#ff7961',
      main: '#f44336',
      dark: '#ba000d',
      contrastText: '#000'
    },
    text: {
      primary: colors.blueGrey[900],
      secondary: colors.blueGrey[600]
    }
  },
  shadows,
  typography,
  // table
});

export default theme;
