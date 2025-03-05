import { useSession } from 'next-auth/react';
import { Container, Typography, Box, Paper, Grid, Button } from '@mui/material';
import { PersonAdd, People, Description } from '@mui/icons-material';
import Layout from '../../components/Layout';
import { useRouter } from 'next/router';

export default function Dashboard() {
  const { data: session } = useSession();
  const router = useRouter();

  const menuItems = [
    {
      title: 'Cadastrar Paciente',
      icon: <PersonAdd sx={{ fontSize: 40 }} />,
      path: '/cadastrar-paciente',
      color: 'primary'
    },
    {
      title: 'Lista de Pacientes',
      icon: <People sx={{ fontSize: 40 }} />,
      path: '/pacientes',
      color: 'secondary'
    },
    {
      title: 'Evoluções',
      icon: <Description sx={{ fontSize: 40 }} />,
      path: '/evolucoes',
      color: 'success'
    }
  ];

  return (
    <Layout>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              Dashboard
            </Typography>
            <Typography variant="subtitle1" sx={{ mb: 4 }}>
              Bem-vindo, {session?.user?.name || 'Usuário'}
            </Typography>

            <Grid container spacing={3}>
              {menuItems.map((item) => (
                <Grid item xs={12} sm={6} md={4} key={item.path}>
                  <Button
                    variant="contained"
                    color={item.color as any}
                    fullWidth
                    sx={{
                      p: 3,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 2,
                      height: '160px'
                    }}
                    onClick={() => router.push(item.path)}
                  >
                    {item.icon}
                    <Typography variant="h6">{item.title}</Typography>
                  </Button>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Paper>
      </Container>
    </Layout>
  );
}