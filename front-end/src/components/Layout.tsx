import { ReactNode } from 'react';
import { Container, Stack, Button } from '@mui/material';
import { ArrowBack as ArrowBackIcon, Home as HomeIcon } from '@mui/icons-material';
import { useRouter } from 'next/router';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const router = useRouter();

  return (
    <Container maxWidth="lg">
      <Stack direction="row" spacing={2} sx={{ my: 3 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => router.back()}
        >
          Voltar
        </Button>
        <Button
          variant="outlined"
          startIcon={<HomeIcon />}
          onClick={() => router.push('/')}
        >
          Página Inicial
        </Button>
      </Stack>
      {children}
    </Container>
  );
}