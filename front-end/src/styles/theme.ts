import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
  palette: {
    primary: {
      main: '#80ed99',
      light: '#57cc99',
      dark: '#90dbf4',
    },
    secondary: {
      main: '#FFB0E0',
      light: '#FFD4F0',
      dark: '#DB70B9',
    },
    error: {
      main: '#FF6B6B',
      light: '#FF8585',
      dark: '#E65151',
    },
    warning: {
      main: '#FFD700',
      light: '#FFDF33',
      dark: '#E6C200',
    },
    success: {
      main: '#77DD77',
      light: '#90E490',
      dark: '#5DC75D',
    },
    text: {
      primary: '#4A4A4A',
      secondary: '#666666',
    },
    background: {
      default: '#eff7f6',
      paper: 'rgba(255, 255, 255, 0.9)',
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          backdropFilter: 'blur(10px)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 25,
          textTransform: 'none',
          padding: '12px 24px',
          fontSize: '1.1rem',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            '&.Mui-focused fieldset': {
              borderColor: '#57cc99',
            },
          },
        },
      },
    },
  },
})