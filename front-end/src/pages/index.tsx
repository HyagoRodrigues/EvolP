import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
} from '@mui/material';
import {
  PersonAdd as PersonAddIcon,
  People as PeopleIcon,
  Description as DescriptionIcon,
} from '@mui/icons-material';
import Layout from '../components/Layout';

export default function Dashboard() {
  const router = useRouter();
  // Remova temporariamente a verificação de sessão
  // const { status } = useSession({...})
  const menuItems = [
    {
      title: 'Cadastrar Paciente',
      description: 'Adicione um novo paciente ao sistema',
      icon: <PersonAddIcon sx={{ fontSize: 40 }} />,
      path: '/cadastrar-paciente',
    },
    {
      title: 'Lista de Pacientes',
      description: 'Visualize e gerencie todos os pacientes',
      icon: <PeopleIcon sx={{ fontSize: 40 }} />,
      path: '/pacientes',
    },
    {
      title: 'Evoluções',
      description: 'Acesse as evoluções dos pacientes',
      icon: <DescriptionIcon sx={{ fontSize: 40 }} />,
      path: '/evolucoes',
    },
  ];

  return (
    <Layout>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom color="primary">
          Dashboard
        </Typography>
        
        <Grid container spacing={3}>
          {menuItems.map((item, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card 
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  '&:hover': {
                    boxShadow: 6,
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      mb: 2,
                    }}
                  >
                    {item.icon}
                  </Box>
                  <Typography gutterBottom variant="h5" component="h2" align="center">
                    {item.title}
                  </Typography>
                  <Typography align="center" color="text.secondary">
                    {item.description}
                  </Typography>
                </CardContent>
                <Box sx={{ p: 2 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={() => router.push(item.path)}
                  >
                    Acessar
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Layout>
  );
}