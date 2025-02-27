import { useState } from 'react';
import { useRouter } from 'next/router';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Box,
  Divider,
  Alert,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  Person as PersonIcon,
  Science as ScienceIcon,
} from '@mui/icons-material';
import Layout from '../../../../components/Layout';

interface AssessmentForm {
  // Dados Subjetivos
  queixaPrincipal: string;
  historicoMedico: string;
  alergias: string;
  medicamentosUso: string;
  observacoesSubjetivas: string;
  
  // Dados Objetivos
  pressaoArterial: string;
  frequenciaCardiaca: string;
  temperatura: string;
  resultadosExames: string;
  observacoesExameFisico: string;
}

export default function NursingAssessment() {
  const router = useRouter();
  const { id } = router.query;

  const [formData, setFormData] = useState<AssessmentForm>({
    queixaPrincipal: '',
    historicoMedico: '',
    alergias: '',
    medicamentosUso: '',
    observacoesSubjetivas: '',
    pressaoArterial: '',
    frequenciaCardiaca: '',
    temperatura: '',
    resultadosExames: '',
    observacoesExameFisico: '',
  });

  const [errors, setErrors] = useState<Partial<AssessmentForm>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when field is modified
    if (errors[name as keyof AssessmentForm]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Partial<AssessmentForm> = {};
    
    if (!formData.queixaPrincipal) {
      newErrors.queixaPrincipal = 'Campo obrigatório';
    }
    if (!formData.pressaoArterial) {
      newErrors.pressaoArterial = 'Campo obrigatório';
    }
    if (!formData.frequenciaCardiaca) {
      newErrors.frequenciaCardiaca = 'Campo obrigatório';
    }
    if (!formData.temperatura) {
      newErrors.temperatura = 'Campo obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      console.log('Dados do formulário:', formData);
      // TODO: Implementar envio para API
      router.push(`/pacientes/${id}/diagnostico`);
    }
  };

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
              Avaliação de Enfermagem
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleSubmit}>
            {/* Dados Subjetivos */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <PersonIcon /> Dados Subjetivos
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    required
                    multiline
                    rows={4}
                    label="Queixa Principal"
                    name="queixaPrincipal"
                    value={formData.queixaPrincipal}
                    onChange={handleInputChange}
                    error={!!errors.queixaPrincipal}
                    helperText={errors.queixaPrincipal}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Histórico Médico"
                    name="historicoMedico"
                    value={formData.historicoMedico}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Alergias"
                    name="alergias"
                    value={formData.alergias}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Medicamentos em Uso"
                    name="medicamentosUso"
                    value={formData.medicamentosUso}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Observações Adicionais"
                    name="observacoesSubjetivas"
                    value={formData.observacoesSubjetivas}
                    onChange={handleInputChange}
                  />
                </Grid>
              </Grid>
            </Box>

            <Divider sx={{ my: 4 }} />

            {/* Dados Objetivos */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <ScienceIcon /> Dados Objetivos
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    required
                    label="Pressão Arterial"
                    name="pressaoArterial"
                    value={formData.pressaoArterial}
                    onChange={handleInputChange}
                    error={!!errors.pressaoArterial}
                    helperText={errors.pressaoArterial}
                    placeholder="Ex: 120/80 mmHg"
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    required
                    label="Frequência Cardíaca"
                    name="frequenciaCardiaca"
                    value={formData.frequenciaCardiaca}
                    onChange={handleInputChange}
                    error={!!errors.frequenciaCardiaca}
                    helperText={errors.frequenciaCardiaca}
                    placeholder="Ex: 80 bpm"
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    required
                    label="Temperatura"
                    name="temperatura"
                    value={formData.temperatura}
                    onChange={handleInputChange}
                    error={!!errors.temperatura}
                    helperText={errors.temperatura}
                    placeholder="Ex: 36.5 °C"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Resultados de Exames"
                    name="resultadosExames"
                    value={formData.resultadosExames}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Observações do Exame Físico"
                    name="observacoesExameFisico"
                    value={formData.observacoesExameFisico}
                    onChange={handleInputChange}
                  />
                </Grid>
              </Grid>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                startIcon={<SaveIcon />}
              >
                Salvar e Continuar
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Layout>
  );
}