import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { CircularProgress, Box } from '@mui/material'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    const handleRouteProtection = async () => {
      try {
        if (status === 'unauthenticated') {
          const currentPath = router.asPath
          if (currentPath !== '/login') {
            sessionStorage.setItem('returnUrl', currentPath)
            await router.push('/login')
          }
        }
      } catch (error) {
        console.error('Navigation error:', error)
      }
    }

    handleRouteProtection()
  }, [status, router])

  if (status === 'loading') {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        bgcolor: 'background.default'
      }}>
        <CircularProgress />
      </Box>
    )
  }

  if (!session) {
    return null
  }

  return <>{children}</>
}