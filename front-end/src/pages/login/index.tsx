import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  useTheme,
} from '@mui/material';
import { useState } from 'react';

export default function Login() {
  const router = useRouter();
  const theme = useTheme();
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const formData = new FormData(e.target as HTMLFormElement);
    
    const result = await signIn('credentials', {
      email: formData.get('email'),      // Changed from username to email
      password: formData.get('password'),
      redirect: false,
    });

    if (result?.ok) {
      router.push('/dashboard');
    } else {
      setError('Email ou senha inválidos');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 400,
          p: 4,
          borderRadius: theme.shape.borderRadius,
          background: theme.palette.background.paper,
          opacity: 0.9,
          boxShadow: theme.shadows[4],
        }}
      >
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Box
            sx={{
              width: 80,
              height: 80,
              position: 'relative',
              margin: '0 auto',
              mb: 2,
            }}
          >
            <Image
              src="/images/enfermeira.png"
              alt="Enfermeira"
              fill
              style={{ objectFit: 'contain' }}
              priority
            />
          </Box>
          <Typography variant="h4" color="primary" gutterBottom>
            EvolP
          </Typography>
        </Box>

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"              // Changed from Usuário to Email
            name="email"               // Changed from username to email
            type="email"              // Added type email
            required
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Senha"
            name="password"
            type="password"
            required
            sx={{ mb: 3 }}
          />
          {error && (
            <Typography color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}
          <Button
            fullWidth
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            sx={{
              py: 1.5,
              fontWeight: 'bold',
            }}
          >
            ENTRAR
          </Button>
        </Box>
      </Box>
    </Box>
  );
}