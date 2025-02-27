import { Button, Stack } from '@mui/material';
import { ArrowBack as ArrowBackIcon, Home as HomeIcon } from '@mui/icons-material';
import { useRouter } from 'next/router';

export default function NavigationButtons() {
  const router = useRouter();

  return (
    <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
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
  );
}