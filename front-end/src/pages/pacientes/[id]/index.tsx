import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  Container,
  Paper,
  Typography,
  Button,
  Stack,
  Box,
  Grid,
} from '@mui/material';
import {
  Assessment as AssessmentIcon,
  LocalHospital as DiagnosisIcon,
  Assignment as PlanningIcon,
  PlaylistAddCheck as ImplementationIcon,
  Timeline as EvolutionIcon,
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import Layout from '../../../components/Layout';

export default function PatientDetails() {
  const router = useRouter();
  const { id } = router.query;
  const [paciente, setPaciente] = useState({
    id: '',
    nome: '',
    cpf: '',
    dataNascimento: '',
    leito: '',
  });

  useEffect(() => {
    if (id) {
      const storedPacientes = JSON.parse(localStorage.getItem('pacientes') || '[]');
      const pacienteEncontrado = storedPacientes.find((p: any) => p.id === Number(id));
      if (pacienteEncontrado) {
        setPaciente(pacienteEncontrado);
      }
    }
  }, [id]);

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString('pt-BR');
  };

  const nursingProcessSteps = [
    {
      title: 'Avaliação de Enfermagem',
      description: 'Coleta de dados sobre a saúde do paciente',
      icon: <AssessmentIcon />,
      path: `/pacientes/${id}/avaliacao`,
    },
    {
      title: 'Diagnóstico de Enfermagem',
      description: 'Identificação de problemas e necessidades',
      icon: <DiagnosisIcon />,
      path: `/pacientes/${id}/diagnostico`,
    },
    {
      title: 'Planejamento de Enfermagem',
      description: 'Criação do plano de cuidados',
      icon: <PlanningIcon />,
      path: `/pacientes/${id}/planejamento`,
    },
    {
      title: 'Implementação de Enfermagem',
      description: 'Execução do plano de cuidados',
      icon: <ImplementationIcon />,
      path: `/pacientes/${id}/implementacao`,
    },
    {
      title: 'Evolução de Enfermagem',
      description: 'Avaliação dos resultados e ajustes',
      icon: <EvolutionIcon />,
      path: `/pacientes/${id}/evolucao`,
    },
  ];

  return (
    <Layout>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            variant="outlined"
            sx={{
              color: 'primary.light',
              borderColor: 'primary.light',
              '&:hover': {
                borderColor: 'primary.main',
                color: 'primary.main',
              },
            }}
            onClick={() => router.push('/pacientes')}
          >
            Voltar
          </Button>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 4, mb: { xs: 3, md: 0 } }}>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                mb: 3 
              }}>
                <Typography variant="h5" component="h2" color="primary">
                  Dados do Paciente
                </Typography>
                <Button
                  startIcon={<EditIcon />}
                  onClick={() => router.push(`/pacientes/${id}/editar`)}
                >
                  Editar
                </Button>
              </Box>

              <Stack spacing={2}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Nome
                  </Typography>
                  <Typography variant="body1">{paciente.nome}</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    CPF
                  </Typography>
                  <Typography variant="body1">{paciente.cpf}</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Data de Nascimento
                  </Typography>
                  <Typography variant="body1">
                    {formatarData(paciente.dataNascimento)}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Leito
                  </Typography>
                  <Typography variant="body1">{paciente.leito}</Typography>
                </Box>
              </Stack>
            </Paper>
          </Grid>

          <Grid item xs={12} md={8}>
            <Paper elevation={3} sx={{ p: 4 }}>
              <Typography variant="h5" component="h2" color="primary" gutterBottom>
                Processo de Enfermagem
              </Typography>
              
              <Stack spacing={2} sx={{ mt: 3 }}>
                {nursingProcessSteps.map((step, index) => (
                  <Button
                    key={index}
                    variant="outlined"
                    size="large"
                    startIcon={step.icon}
                    onClick={() => router.push(step.path)}
                    sx={{
                      justifyContent: 'flex-start',
                      py: 2,
                      px: 3,
                      textAlign: 'left',
                      '&:hover': {
                        backgroundColor: 'primary.light',
                        color: 'primary.contrastText',
                      },
                    }}
                  >
                    <Box>
                      <Typography variant="subtitle1" component="div">
                        {step.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {step.description}
                      </Typography>
                    </Box>
                  </Button>
                ))}
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
}