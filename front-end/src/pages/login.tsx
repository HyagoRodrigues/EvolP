import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/router'
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Checkbox,
  FormControlLabel,
  Link
} from '@mui/material'

interface FormErrors {
  email: string
  password: string
  submit: string
}

export default function Login() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  })
  const [errors, setErrors] = useState<FormErrors>({
    email: '',
    password: '',
    submit: ''
  })

  const validateForm = () => {
    const newErrors: FormErrors = {
      email: '',
      password: '',
      submit: ''
    }
    
    if (!credentials.email) {
      newErrors.email = 'Email é obrigatório'
    } else if (!/\S+@\S+\.\S+/.test(credentials.email)) {
      newErrors.email = 'Email inválido'
    }

    if (!credentials.password) {
      newErrors.password = 'Senha é obrigatória'
    } else if (credentials.password.length < 6) {
      newErrors.password = 'Senha deve ter no mínimo 6 caracteres'
    }

    setErrors(newErrors)
    return !newErrors.email && !newErrors.password
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({ ...errors, submit: '' })
    setIsLoading(true)

    if (!validateForm()) {
      setIsLoading(false)
      return
    }

    try {
      const result = await signIn('credentials', {
        email: credentials.email,
        password: credentials.password,
        redirect: false
      })
    
      if (result?.error) {
        setErrors({ ...errors, submit: result.error })
      } else {
        const returnUrl = sessionStorage.getItem('returnUrl') || '/'
        sessionStorage.removeItem('returnUrl')
        router.push(returnUrl)
      }
    } catch (error) {
      setErrors({ ...errors, submit: 'Erro ao realizar login' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: (theme) => `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.dark} 100%)`,
      padding: 2
    }}>
      <Paper 
        elevation={3}
        sx={{ 
          p: 4, 
          width: '100%',
          maxWidth: 400
        }}
      >
        <Box 
          sx={{ 
            display: 'flex',
            justifyContent: 'center',
            mb: 4
          }}
        >
          <img
            src="/images/enfermeira.png"
            alt="Doctors Icon"
            style={{
              width: '120px',
              height: 'auto',
              marginBottom: '8px'
            }}
          />
        </Box>

        {/* Rest of the form remains the same... */}
        {errors.submit && (
          <Alert 
            severity="error" 
            sx={{ mb: 3 }}
          >
            {errors.submit}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={credentials.email}
            onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
            error={!!errors.email}
            helperText={errors.email}
            required
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Senha"
            type="password"
            value={credentials.password}
            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
            error={!!errors.password}
            helperText={errors.password}
            required
            sx={{ mb: 3 }}
          />
          
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            mb: 3
          }}>
            <FormControlLabel
              control={<Checkbox color="primary" />}
              label="Remember Me"
            />
            <Link
              href="#"
              sx={{
                color: 'primary.main',
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline'
                }
              }}
            >
              Forget Password
            </Link>
          </Box>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={isLoading}
          >
            {isLoading ? 'Entrando...' : 'Log in'}
          </Button>

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Don't have an account?{' '}
              <Link
                href="#"
                sx={{
                  color: 'primary.main',
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline'
                  }
                }}
              >
                Register
              </Link>
            </Typography>
          </Box>
        </form>
      </Paper>
    </Box>
  )
}