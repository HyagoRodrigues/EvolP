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
  RadioGroup,
  FormControlLabel,
  Radio,
  FormLabel,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  MedicalServices as DiagnosisIcon,
  Assignment as NeedsIcon,
} from '@mui/icons-material';
import Layout from '../../../../components/Layout';

interface HealthProblem {
  descricao: string;
  gravidade: 'leve' | 'moderado' | 'grave';
  tipo: 'agudo' | 'cronico';
}

interface CareNeed {
  descricao: string;
  urgencia: 'baixa' | 'media' | 'alta';
}

interface DiagnosisForm {
  problemasSaude: HealthProblem[];
  necessidadesCuidado: CareNeed[];
  observacoesAdicionais: string;
}

export default function NursingDiagnosis() {
  const router = useRouter();
  const { id } = router.query;

  const [formData, setFormData] = useState<DiagnosisForm>({
    problemasSaude: [{ descricao: '', gravidade: 'leve', tipo: 'agudo' }],
    necessidadesCuidado: [{ descricao: '', urgencia: 'baixa' }],
    observacoesAdicionais: '',
  });

  const [errors, setErrors] = useState<{
    problemasSaude?: string[];
    necessidadesCuidado?: string[];
  }>({});

  const handleProblemaChange = (index: number, field: keyof HealthProblem, value: string) => {
    const newProblemas = [...formData.problemasSaude];
    newProblemas[index] = { ...newProblemas[index], [field]: value };
    setFormData(prev => ({ ...prev, problemasSaude: newProblemas }));
    
    if (errors.problemasSaude?.[index]) {
      const newErrors = { ...errors };
      delete newErrors.problemasSaude?.[index];
      setErrors(newErrors);
    }
  };

  const handleNecessidadeChange = (index: number, field: keyof CareNeed, value: string) => {
    const newNecessidades = [...formData.necessidadesCuidado];
    newNecessidades[index] = { ...newNecessidades[index], [field]: value };
    setFormData(prev => ({ ...prev, necessidadesCuidado: newNecessidades }));
    
    if (errors.necessidadesCuidado?.[index]) {
      const newErrors = { ...errors };
      delete newErrors.necessidadesCuidado?.[index];
      setErrors(newErrors);
    }
  };

  const addProblema = () => {
    setFormData(prev => ({
      ...prev,
      problemasSaude: [...prev.problemasSaude, { descricao: '', gravidade: 'leve', tipo: 'agudo' }]
    }));
  };

  const addNecessidade = () => {
    setFormData(prev => ({
      ...prev,
      necessidadesCuidado: [...prev.necessidadesCuidado, { descricao: '', urgencia: 'baixa' }]
    }));
  };

  const removeProblema = (index: number) => {
    setFormData(prev => ({
      ...prev,
      problemasSaude: prev.problemasSaude.filter((_, i) => i !== index)
    }));
  };

  const removeNecessidade = (index: number) => {
    setFormData(prev => ({
      ...prev,
      necessidadesCuidado: prev.necessidadesCuidado.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    const newErrors: { problemasSaude?: string[], necessidadesCuidado?: string[] } = {};
    let isValid = true;

    formData.problemasSaude.forEach((problema, index) => {
      if (!problema.descricao) {
        if (!newErrors.problemasSaude) newErrors.problemasSaude = [];
        newErrors.problemasSaude[index] = 'Descrição obrigatória';
        isValid = false;
      }
    });

    formData.necessidadesCuidado.forEach((necessidade, index) => {
      if (!necessidade.descricao) {
        if (!newErrors.necessidadesCuidado) newErrors.necessidadesCuidado = [];
        newErrors.necessidadesCuidado[index] = 'Descrição obrigatória';
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      console.log('Dados do formulário:', formData);
      // TODO: Implementar envio para API
      router.push(`/pacientes/${id}/planejamento`);
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
              Diagnóstico de Enfermagem
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleSubmit}>
            {/* Problemas de Saúde */}
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <DiagnosisIcon /> Problemas de Saúde
                </Typography>
                <Button
                  startIcon={<AddIcon />}
                  onClick={addProblema}
                  variant="outlined"
                >
                  Adicionar Problema
                </Button>
              </Box>

              {formData.problemasSaude.map((problema, index) => (
                <Paper key={index} elevation={1} sx={{ p: 2, mb: 2 }}>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <TextField
                          fullWidth
                          required
                          multiline
                          rows={2}
                          label={`Problema ${index + 1}`}
                          value={problema.descricao}
                          onChange={(e) => handleProblemaChange(index, 'descricao', e.target.value)}
                          error={!!errors.problemasSaude?.[index]}
                          helperText={errors.problemasSaude?.[index]}
                        />
                        {index > 0 && (
                          <Tooltip title="Remover problema">
                            <IconButton
                              color="error"
                              onClick={() => removeProblema(index)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <InputLabel>Gravidade</InputLabel>
                        <Select
                          value={problema.gravidade}
                          label="Gravidade"
                          onChange={(e) => handleProblemaChange(index, 'gravidade', e.target.value)}
                        >
                          <MenuItem value="leve">Leve</MenuItem>
                          <MenuItem value="moderado">Moderado</MenuItem>
                          <MenuItem value="grave">Grave</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl>
                        <FormLabel>Tipo</FormLabel>
                        <RadioGroup
                          row
                          value={problema.tipo}
                          onChange={(e) => handleProblemaChange(index, 'tipo', e.target.value)}
                        >
                          <FormControlLabel value="agudo" control={<Radio />} label="Agudo" />
                          <FormControlLabel value="cronico" control={<Radio />} label="Crônico" />
                        </RadioGroup>
                      </FormControl>
                    </Grid>
                  </Grid>
                </Paper>
              ))}
            </Box>

            {/* Necessidades de Cuidado */}
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <NeedsIcon /> Necessidades de Cuidado
                </Typography>
                <Button
                  startIcon={<AddIcon />}
                  onClick={addNecessidade}
                  variant="outlined"
                >
                  Adicionar Necessidade
                </Button>
              </Box>

              {formData.necessidadesCuidado.map((necessidade, index) => (
                <Paper key={index} elevation={1} sx={{ p: 2, mb: 2 }}>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <TextField
                          fullWidth
                          required
                          multiline
                          rows={2}
                          label={`Necessidade ${index + 1}`}
                          value={necessidade.descricao}
                          onChange={(e) => handleNecessidadeChange(index, 'descricao', e.target.value)}
                          error={!!errors.necessidadesCuidado?.[index]}
                          helperText={errors.necessidadesCuidado?.[index]}
                        />
                        {index > 0 && (
                          <Tooltip title="Remover necessidade">
                            <IconButton
                              color="error"
                              onClick={() => removeNecessidade(index)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <FormControl fullWidth>
                        <InputLabel>Urgência</InputLabel>
                        <Select
                          value={necessidade.urgencia}
                          label="Urgência"
                          onChange={(e) => handleNecessidadeChange(index, 'urgencia', e.target.value)}
                        >
                          <MenuItem value="baixa">Baixa</MenuItem>
                          <MenuItem value="media">Média</MenuItem>
                          <MenuItem value="alta">Alta</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                </Paper>
              ))}
            </Box>

            {/* Observações Adicionais */}
            <Box sx={{ mb: 4 }}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Observações Adicionais"
                value={formData.observacoesAdicionais}
                onChange={(e) => setFormData(prev => ({ ...prev, observacoesAdicionais: e.target.value }))}
              />
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