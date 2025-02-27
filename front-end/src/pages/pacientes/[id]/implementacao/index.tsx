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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  Person as PersonIcon,
  Group as CollaborationIcon,
  CheckCircle as CheckIcon,
} from '@mui/icons-material';
import Layout from '../../../../components/Layout';

interface ImplementationForm {
  cuidadosAutonomos: {
    descricao: string;
    dataHora: string;
    observacoes: string;
  };
  colaboracao: {
    profissional: string;
    acoes: string;
    dataHora: string;
  };
  prescricoes: {
    descricao: string;
    status: 'cumprida' | 'parcial' | 'nao_cumprida';
    observacoes: string;
  };
}

export default function NursingImplementation() {
  const router = useRouter();
  const { id } = router.query;

  const [formData, setFormData] = useState<ImplementationForm>({
    cuidadosAutonomos: {
      descricao: '',
      dataHora: '',
      observacoes: '',
    },
    colaboracao: {
      profissional: '',
      acoes: '',
      dataHora: '',
    },
    prescricoes: {
      descricao: '',
      status: 'cumprida',
      observacoes: '',
    },
  });

  const [errors, setErrors] = useState<Partial<{
    [K in keyof ImplementationForm]: {
      [Field in keyof ImplementationForm[K]]?: string;
    };
  }>>({});

  const handleChange = (section: keyof ImplementationForm, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      }
    }));

    if (errors[section]?.[field as keyof typeof errors[typeof section]]) {
      setErrors(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: undefined,
        }
      }));
    }
  };

  const validateForm = () => {
    const newErrors: typeof errors = {};
    let isValid = true;

    // Validação dos Cuidados Autônomos
    if (!formData.cuidadosAutonomos.descricao) {
      if (!newErrors.cuidadosAutonomos) newErrors.cuidadosAutonomos = {};
      newErrors.cuidadosAutonomos.descricao = 'Campo obrigatório';
      isValid = false;
    }
    if (!formData.cuidadosAutonomos.dataHora) {
      if (!newErrors.cuidadosAutonomos) newErrors.cuidadosAutonomos = {};
      newErrors.cuidadosAutonomos.dataHora = 'Campo obrigatório';
      isValid = false;
    }

    // Validação da Colaboração
    if (!formData.colaboracao.profissional) {
      if (!newErrors.colaboracao) newErrors.colaboracao = {};
      newErrors.colaboracao.profissional = 'Campo obrigatório';
      isValid = false;
    }
    if (!formData.colaboracao.dataHora) {
      if (!newErrors.colaboracao) newErrors.colaboracao = {};
      newErrors.colaboracao.dataHora = 'Campo obrigatório';
      isValid = false;
    }

    // Validação das Prescrições
    if (!formData.prescricoes.descricao) {
      if (!newErrors.prescricoes) newErrors.prescricoes = {};
      newErrors.prescricoes.descricao = 'Campo obrigatório';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      console.log('Dados do formulário:', formData);
      // TODO: Implementar envio para API
      router.push(`/pacientes/${id}/evolucao`);
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
              Implementação de Enfermagem
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleSubmit}>
            {/* Cuidados Autônomos */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <PersonIcon /> Cuidados Autônomos
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    required
                    multiline
                    rows={4}
                    label="Descrição das Ações Realizadas"
                    value={formData.cuidadosAutonomos.descricao}
                    onChange={(e) => handleChange('cuidadosAutonomos', 'descricao', e.target.value)}
                    error={!!errors.cuidadosAutonomos?.descricao}
                    helperText={errors.cuidadosAutonomos?.descricao}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    required
                    type="datetime-local"
                    label="Data e Hora da Execução"
                    value={formData.cuidadosAutonomos.dataHora}
                    onChange={(e) => handleChange('cuidadosAutonomos', 'dataHora', e.target.value)}
                    error={!!errors.cuidadosAutonomos?.dataHora}
                    helperText={errors.cuidadosAutonomos?.dataHora}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Observações"
                    value={formData.cuidadosAutonomos.observacoes}
                    onChange={(e) => handleChange('cuidadosAutonomos', 'observacoes', e.target.value)}
                  />
                </Grid>
              </Grid>
            </Box>

            <Divider sx={{ my: 4 }} />

            {/* Colaboração com Outras Áreas */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <CollaborationIcon /> Colaboração com Outras Áreas
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    required
                    label="Profissional Envolvido"
                    value={formData.colaboracao.profissional}
                    onChange={(e) => handleChange('colaboracao', 'profissional', e.target.value)}
                    error={!!errors.colaboracao?.profissional}
                    helperText={errors.colaboracao?.profissional}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    required
                    type="datetime-local"
                    label="Data e Hora da Colaboração"
                    value={formData.colaboracao.dataHora}
                    onChange={(e) => handleChange('colaboracao', 'dataHora', e.target.value)}
                    error={!!errors.colaboracao?.dataHora}
                    helperText={errors.colaboracao?.dataHora}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Ações Realizadas em Conjunto"
                    value={formData.colaboracao.acoes}
                    onChange={(e) => handleChange('colaboracao', 'acoes', e.target.value)}
                  />
                </Grid>
              </Grid>
            </Box>

            <Divider sx={{ my: 4 }} />

            {/* Checagem de Prescrições */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <CheckIcon /> Checagem de Prescrições
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    required
                    multiline
                    rows={3}
                    label="Prescrição Verificada"
                    value={formData.prescricoes.descricao}
                    onChange={(e) => handleChange('prescricoes', 'descricao', e.target.value)}
                    error={!!errors.prescricoes?.descricao}
                    helperText={errors.prescricoes?.descricao}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={formData.prescricoes.status}
                      label="Status"
                      onChange={(e) => handleChange('prescricoes', 'status', e.target.value)}
                    >
                      <MenuItem value="cumprida">Cumprida</MenuItem>
                      <MenuItem value="parcial">Parcialmente Cumprida</MenuItem>
                      <MenuItem value="nao_cumprida">Não Cumprida</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Observações"
                    value={formData.prescricoes.observacoes}
                    onChange={(e) => handleChange('prescricoes', 'observacoes', e.target.value)}
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