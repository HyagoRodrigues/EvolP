import { AppBar, Toolbar, Typography, Button } from '@mui/material'
import { signOut } from 'next-auth/react'
import { useRouter } from 'next/router'

export function Header() {
  const router = useRouter()

  const handleLogout = async () => {
    await signOut({ redirect: false })
    router.push('/login')
  }

  return (
    <AppBar position="static" color="primary" elevation={0}>
      <Toolbar>
        <Typography 
          variant="h6" 
          component="h1" 
          sx={{ flexGrow: 1 }}
        >
          Evolução de Pacientes
        </Typography>
        <Button 
          color="inherit" 
          onClick={handleLogout}
          sx={{ 
            ml: 2,
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)'
            }
          }}
        >
          Sair
        </Button>
      </Toolbar>
    </AppBar>
  )
}