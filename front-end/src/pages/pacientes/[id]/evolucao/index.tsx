import { useState } from 'react';
import { useRouter } from 'next/router';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Card,
  CardContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  List,
  ListItem,
  ListItemText,
  Chip,
  Grid, // Importação adicionada
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  ExpandMore as ExpandMoreIcon,
  Assessment as AssessmentIcon,
  LocalHospital as DiagnosisIcon,
  Assignment as PlanningIcon,
  PlaylistAddCheck as ImplementationIcon,
  Timeline as EvolutionIcon,
} from '@mui/icons-material';
import Layout from '../../../../components/Layout';

// Mock data - Replace with API calls
const mockData = {
  avaliacao: {
    queixaPrincipal: "Dor abdominal intensa",
    historicoMedico: "Histórico de gastrite",
    sinaisVitais: {
      pressao: "120/80 mmHg",
      temperatura: "36.5°C",
      frequenciaCardiaca: "80 bpm"
    }
  },
  diagnostico: {
    problemasSaude: [
      "Dor aguda relacionada à inflamação gástrica",
      "Ansiedade relacionada ao quadro clínico"
    ],
    necessidadesCuidado: [
      "Controle da dor",
      "Suporte emocional"
    ]
  },
  planejamento: {
    intervencoes: [
      "Administração de medicação conforme prescrição",
      "Monitoramento dos sinais vitais",
      "Orientação sobre dieta"
    ]
  },
  implementacao: {
    acoes: [
      "Medicação administrada às 14h",
      "Sinais vitais estáveis",
      "Orientações realizadas"
    ]
  }
};

interface EvolutionForm {
  avaliacaoResultados: string;
  ajustesPropostos: string;
}

export default function NursingEvolution() {
  const router = useRouter();
  const { id } = router.query;

  const [formData, setFormData] = useState<EvolutionForm>({
    avaliacaoResultados: '',
    ajustesPropostos: '',
  });

  const [errors, setErrors] = useState<Partial<EvolutionForm>>({});

  const handleChange = (field: keyof EvolutionForm, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Partial<EvolutionForm> = {};
    
    if (!formData.avaliacaoResultados) {
      newErrors.avaliacaoResultados = 'Campo obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      console.log('Dados do formulário:', formData);
      // TODO: Implementar envio para API
      router.push('/pacientes');
    }
  };

  const renderSection = (
    title: string,
    icon: React.ReactNode,
    content: React.ReactNode
  ) => (
    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        sx={{ backgroundColor: 'primary.light', color: 'primary.contrastText' }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {icon}
          <Typography variant="h6">{title}</Typography>
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        {content}
      </AccordionDetails>
    </Accordion>
  );

  return (
    <Layout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => router.back()}
              variant="outlined"
            >
              Voltar
            </Button>
            <Typography variant="h4" component="h1" color="primary">
              Evolução de Enfermagem
            </Typography>
          </Box>

          {/* Histórico das Etapas */}
          <Box sx={{ mb: 4 }}>
            {renderSection(
              'Avaliação de Enfermagem',
              <AssessmentIcon />,
              <Card>
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    Queixa Principal:
                  </Typography>
                  <Typography variant="body1" paragraph>
                    {mockData.avaliacao.queixaPrincipal}
                  </Typography>

                  <Typography variant="subtitle1" gutterBottom>
                    Sinais Vitais:
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Chip label={`PA: ${mockData.avaliacao.sinaisVitais.pressao}`} />
                    <Chip label={`Temp: ${mockData.avaliacao.sinaisVitais.temperatura}`} />
                    <Chip label={`FC: ${mockData.avaliacao.sinaisVitais.frequenciaCardiaca}`} />
                  </Box>
                </CardContent>
              </Card>
            )}

            {renderSection(
              'Diagnóstico de Enfermagem',
              <DiagnosisIcon />,
              <Box>
                <Typography variant="subtitle1" gutterBottom>
                  Problemas de Saúde:
                </Typography>
                <List>
                  {mockData.diagnostico.problemasSaude.map((problema, index) => (
                    <ListItem key={index}>
                      <ListItemText primary={problema} />
                    </ListItem>
                  ))}
                </List>

                <Typography variant="subtitle1" gutterBottom>
                  Necessidades de Cuidado:
                </Typography>
                <List>
                  {mockData.diagnostico.necessidadesCuidado.map((necessidade, index) => (
                    <ListItem key={index}>
                      <ListItemText primary={necessidade} />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}

            {renderSection(
              'Planejamento de Enfermagem',
              <PlanningIcon />,
              <List>
                {mockData.planejamento.intervencoes.map((intervencao, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={intervencao} />
                  </ListItem>
                ))}
              </List>
            )}

            {renderSection(
              'Implementação de Enfermagem',
              <ImplementationIcon />,
              <List>
                {mockData.implementacao.acoes.map((acao, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={acao} />
                  </ListItem>
                ))}
              </List>
            )}
          </Box>

          <Divider sx={{ my: 4 }} />

          {/* Formulário de Evolução */}
          <Box component="form" onSubmit={handleSubmit}>
            <Typography variant="h5" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
              <EvolutionIcon /> Avaliação Final
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  multiline
                  rows={4}
                  label="Avaliação dos Resultados"
                  value={formData.avaliacaoResultados}
                  onChange={(e) => handleChange('avaliacaoResultados', e.target.value)}
                  error={!!errors.avaliacaoResultados}
                  helperText={errors.avaliacaoResultados}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Ajustes Propostos"
                  value={formData.ajustesPropostos}
                  onChange={(e) => handleChange('ajustesPropostos', e.target.value)}
                  error={!!errors.ajustesPropostos}
                  helperText={errors.ajustesPropostos}
                />
              </Grid>
            </Grid>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                startIcon={<SaveIcon />}
              >
                Finalizar Evolução
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Layout>
  );
}