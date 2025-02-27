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
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Tooltip,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Assignment as PlanningIcon,
  Flag as GoalsIcon,
  PlaylistAdd as ActionsIcon,
} from '@mui/icons-material';
import Layout from '../../../../components/Layout';

interface PlanningForm {
  diagnosticos: string[];
  resultadosEsperados: string[];
  intervencoes: string[];
}

export default function NursingPlanning() {
  const router = useRouter();
  const { id } = router.query;

  const [formData, setFormData] = useState<PlanningForm>({
    diagnosticos: [],
    resultadosEsperados: [],
    intervencoes: [],
  });

  const [newItem, setNewItem] = useState({
    diagnostico: '',
    resultado: '',
    intervencao: '',
  });

  const [errors, setErrors] = useState({
    diagnosticos: false,
    resultadosEsperados: false,
    intervencoes: false,
  });

  const handleAddItem = (field: keyof PlanningForm) => {
    const itemField = field === 'diagnosticos' ? 'diagnostico' : 
                     field === 'resultadosEsperados' ? 'resultado' : 'intervencao';
    
    if (newItem[itemField as keyof typeof newItem].trim()) {
      setFormData(prev => ({
        ...prev,
        [field]: [...prev[field], newItem[itemField as keyof typeof newItem].trim()]
      }));
      setNewItem(prev => ({
        ...prev,
        [itemField]: ''
      }));
      setErrors(prev => ({
        ...prev,
        [field]: false
      }));
    }
  };

  const handleRemoveItem = (field: keyof PlanningForm, index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    const newErrors = {
      diagnosticos: formData.diagnosticos.length === 0,
      resultadosEsperados: formData.resultadosEsperados.length === 0,
      intervencoes: formData.intervencoes.length === 0,
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      console.log('Dados do formulário:', formData);
      // TODO: Implementar envio para API
      router.push(`/pacientes/${id}/implementacao`);
    }
  };

  const renderSection = (
    title: string,
    field: keyof PlanningForm,
    icon: React.ReactNode,
    placeholder: string
  ) => (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        {icon} {title}
      </Typography>

      <Box sx={{ mb: 2 }}>
        <Grid container spacing={1}>
          <Grid item xs>
            <TextField
              fullWidth
              placeholder={placeholder}
              value={newItem[field === 'diagnosticos' ? 'diagnostico' : 
                         field === 'resultadosEsperados' ? 'resultado' : 'intervencao']}
              onChange={(e) => setNewItem(prev => ({
                ...prev,
                [field === 'diagnosticos' ? 'diagnostico' : 
                 field === 'resultadosEsperados' ? 'resultado' : 'intervencao']: e.target.value
              }))}
              error={errors[field]}
              helperText={errors[field] ? 'Adicione pelo menos um item' : ''}
            />
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleAddItem(field)}
              sx={{ height: '56px' }}
            >
              Adicionar
            </Button>
          </Grid>
        </Grid>
      </Box>

      <List>
        {formData[field].map((item, index) => (
          <ListItem key={index} divider={index !== formData[field].length - 1}>
            <ListItemText primary={item} />
            <ListItemSecondaryAction>
              <Tooltip title="Remover item">
                <IconButton
                  edge="end"
                  color="error"
                  onClick={() => handleRemoveItem(field, index)}
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </Box>
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
              Planejamento de Enfermagem
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleSubmit}>
            {renderSection(
              'Priorização dos Diagnósticos',
              'diagnosticos',
              <PlanningIcon />,
              'Digite um diagnóstico e clique em adicionar'
            )}

            <Divider sx={{ my: 4 }} />

            {renderSection(
              'Resultados Esperados',
              'resultadosEsperados',
              <GoalsIcon />,
              'Digite um resultado esperado e clique em adicionar'
            )}

            <Divider sx={{ my: 4 }} />

            {renderSection(
              'Intervenções e Ações',
              'intervencoes',
              <ActionsIcon />,
              'Digite uma intervenção e clique em adicionar'
            )}

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