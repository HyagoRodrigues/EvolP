import { useRouter } from 'next/router';
import {
  Container,
  Paper,
  Typography,
  Button,
  Stack,
  Box,
} from '@mui/material';
import {
  Assessment as AssessmentIcon,
  LocalHospital as DiagnosisIcon,
  Assignment as PlanningIcon,
  PlaylistAddCheck as ImplementationIcon,
  Timeline as EvolutionIcon,
} from '@mui/icons-material';
import Layout from '../../../components/Layout';

export default function PatientDetails() {
  const router = useRouter();
  const { id } = router.query;

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
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom color="primary">
            Processo de Enfermagem
          </Typography>
          
          <Box sx={{ mt: 4 }}>
            <Stack spacing={2}>
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
          </Box>
        </Paper>
      </Container>
    </Layout>
  );
}