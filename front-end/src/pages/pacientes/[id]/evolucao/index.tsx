import { useState, useEffect } from 'react';
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
  Grid,
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
import Layout from '@/components/Layout';
import { nursingService } from '@/services/nursingService';
import { toast } from 'react-toastify';
import { mockNursingData } from '@/mocks/nursingData';
import { INursingEvolutionForm, INursingEvolutionData } from '@/types/nursing';

export default function NursingEvolution() {
  const router = useRouter();
  const { id } = router.query;
  
  const [isLoading, setIsLoading] = useState(true);
  const [evolutionData, setEvolutionData] = useState(mockData);

  useEffect(() => {
    if (id) {
      loadEvolutionData();
    }
  }, [id]);

  const loadEvolutionData = async () => {
    try {
      setIsLoading(true);
      const [assessment, diagnosis, planning, implementation] = await Promise.all([
        nursingService.getAssessment(id as string),
        nursingService.getDiagnosis(id as string),
        nursingService.getPlanning(id as string),
        nursingService.getImplementation(id as string),
      ]);

      setEvolutionData({
        avaliacao: assessment,
        diagnostico: diagnosis,
        planejamento: planning,
        implementacao: implementation,
      });
    } catch (error) {
      console.error('Error loading evolution data:', error);
      toast.error('Erro ao carregar os dados da evolução');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        await nursingService.createEvolution({
          pacienteId: id as string,
          avaliacaoResultados: formData.avaliacaoResultados,
          ajustesPropostos: formData.ajustesPropostos,
          dataCriacao: new Date().toISOString(),
        });

        toast.success('Evolução finalizada com sucesso!');
        router.push('/pacientes');
      } catch (error) {
        console.error('Error saving evolution:', error);
        toast.error('Erro ao salvar a evolução');
      }
    }
  };
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