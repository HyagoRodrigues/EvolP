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
  PictureAsPdf as PictureAsPdfIcon, // Adicionando esta importação
} from '@mui/icons-material';
import Layout from '../../../../components/Layout';
import { useNursing } from '../../../../contexts/NursingContext';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

import { storageService } from '../../../../services/storageService';

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

const patientData = {
  nome: 'Nome do Paciente',
  idade: 30,
  prontuario: '12345',
};

export default function NursingAssessment() {
  const router = useRouter();
  const { id } = router.query;
  const { updateNursingData } = useNursing();
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
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Limpa o erro quando o campo é modificado
    if (errors[name as keyof AssessmentForm]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
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
    return Object.keys(newErrors).length === 0; // Retorna true se não houver erros
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  
    if (validateForm()) {
      try {
        // Salva no localStorage
        storageService.salvarAvaliacao(id as string, formData);
        
        // Atualiza o contexto se necessário
        updateNursingData(id as string, formData);
        
        // Mostra mensagem de sucesso
        alert('Avaliação salva com sucesso!');
        
        // Redireciona
        router.push('/');
      } catch (error) {
        console.error('Erro ao salvar avaliação:', error);
        alert('Erro ao salvar a avaliação. Por favor, tente novamente.');
      }
    }
  };

  const handleGeneratePDF = async () => {
    try {
      // Validar se há dados suficientes
      if (!formData.queixaPrincipal || !formData.pressaoArterial) {
        alert('Por favor, preencha os campos obrigatórios antes de gerar o PDF');
        return;
      }
      
      const pdf = new jsPDF();
      
      // Configurações de estilo melhoradas
      const styles = {
        title: { fontSize: 20, color: [41, 128, 185] }, // Azul profissional
        subtitle: { fontSize: 16, color: [52, 73, 94] }, // Cinza escuro
        normal: { fontSize: 12, color: [0, 0, 0] },
        lineHeight: 8,
        margin: 20
      };
      
      let yPosition = styles.margin;
      
      // Cabeçalho com logo ou título institucional
      pdf.setFontSize(styles.title.fontSize);
      pdf.setTextColor(...styles.title.color);
      pdf.text('EvolP - Sistema de Evolução de Pacientes', styles.margin, yPosition);
      yPosition += styles.lineHeight * 3;
      
      // Informações do documento
      pdf.setFontSize(styles.normal.fontSize);
      pdf.setTextColor(...styles.normal.color);
      const currentDate = new Date().toLocaleDateString('pt-BR');
      const currentTime = new Date().toLocaleTimeString('pt-BR');
      pdf.text(`Data: ${currentDate} - Hora: ${currentTime}`, styles.margin, yPosition);
      yPosition += styles.lineHeight * 2;
      
      // Dados do Paciente com validação
      pdf.setFontSize(styles.subtitle.fontSize);
      pdf.setTextColor(...styles.subtitle.color);
      pdf.text('Dados do Paciente', styles.margin, yPosition);
      yPosition += styles.lineHeight;
      
      // Função auxiliar para adicionar campos com validação
      const addField = (label: string, value: string) => {
        if (value) {
          pdf.setFont('helvetica', 'bold');
          pdf.text(`${label}:`, styles.margin + 5, yPosition);
          pdf.setFont('helvetica', 'normal');
          pdf.text(value, styles.margin + 50, yPosition);
          yPosition += styles.lineHeight;
        }
      };
      
      // Seções do documento com dados dinâmicos
      const sections = [
        {
          title: 'Dados Subjetivos',
          fields: [
            { label: 'Queixa Principal', value: formData.queixaPrincipal },
            { label: 'Histórico Médico', value: formData.historicoMedico },
            { label: 'Alergias', value: formData.alergias },
            { label: 'Medicamentos', value: formData.medicamentosUso },
            { label: 'Observações', value: formData.observacoesSubjetivas }
          ]
        },
        {
          title: 'Dados Objetivos',
          fields: [
            { label: 'Pressão Arterial', value: formData.pressaoArterial },
            { label: 'Freq. Cardíaca', value: formData.frequenciaCardiaca },
            { label: 'Temperatura', value: formData.temperatura },
            { label: 'Result. Exames', value: formData.resultadosExames },
            { label: 'Obs. Exame Físico', value: formData.observacoesExameFisico }
          ]
        }
      ];
      
      // Renderizar seções
      sections.forEach(section => {
        // Verificar espaço na página
        if (yPosition > pdf.internal.pageSize.height - 50) {
          pdf.addPage();
          yPosition = styles.margin;
        }
      
        pdf.setFontSize(styles.subtitle.fontSize);
        pdf.setTextColor(...styles.subtitle.color);
        pdf.text(section.title, styles.margin, yPosition);
        yPosition += styles.lineHeight * 1.5;
      
        pdf.setFontSize(styles.normal.fontSize);
        pdf.setTextColor(...styles.normal.color);
        
        section.fields.forEach(({ label, value }) => {
          if (value) {
            addField(label, value);
          }
        });
        
        yPosition += styles.lineHeight;
      });
      
      // Rodapé
      const pageCount = pdf.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i);
        pdf.setFontSize(10);
        pdf.setTextColor(128, 128, 128);
        pdf.text(
          `Página ${i} de ${pageCount}`,
          pdf.internal.pageSize.width / 2,
          pdf.internal.pageSize.height - 10,
          { align: 'center' }
        );
      }
      
      // Salvar PDF com nome personalizado
      const fileName = `avaliacao_enfermagem_${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);
      
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      alert('Erro ao gerar o PDF. Por favor, tente novamente.');
    }
  };
  return (
    <Layout>
      <Container maxWidth="lg">
        <Paper elevation={3} sx={{ p: 4 }} id="assessment-form">
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h4" component="h1">
              Avaliação de Enfermagem
            </Typography>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => router.back()}
            >
              Voltar
            </Button>
          </Box>
          <Divider sx={{ my: 3 }} />

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Dados Subjetivos */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  <PersonIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                  Dados Subjetivos
                </Typography>
                <TextField
                  fullWidth
                  label="Queixa Principal"
                  name="queixaPrincipal"
                  value={formData.queixaPrincipal}
                  onChange={handleInputChange}
                  error={!!errors.queixaPrincipal}
                  helperText={errors.queixaPrincipal}
                />
                <TextField
                  fullWidth
                  label="Histórico Médico"
                  name="historicoMedico"
                  value={formData.historicoMedico}
                  onChange={handleInputChange}
                  sx={{ mt: 2 }}
                />
                <TextField
                  fullWidth
                  label="Alergias"
                  name="alergias"
                  value={formData.alergias}
                  onChange={handleInputChange}
                  sx={{ mt: 2 }}
                />
                <TextField
                  fullWidth
                  label="Medicamentos em Uso"
                  name="medicamentosUso"
                  value={formData.medicamentosUso}
                  onChange={handleInputChange}
                  sx={{ mt: 2 }}
                />
                <TextField
                  fullWidth
                  label="Observações Subjetivas"
                  name="observacoesSubjetivas"
                  value={formData.observacoesSubjetivas}
                  onChange={handleInputChange}
                  sx={{ mt: 2 }}
                />
              </Grid>

              {/* Dados Objetivos */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  <ScienceIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                  Dados Objetivos
                </Typography>
                <TextField
                  fullWidth
                  label="Pressão Arterial"
                  name="pressaoArterial"
                  value={formData.pressaoArterial}
                  onChange={handleInputChange}
                  error={!!errors.pressaoArterial}
                  helperText={errors.pressaoArterial}
                />
                <TextField
                  fullWidth
                  label="Frequência Cardíaca"
                  name="frequenciaCardiaca"
                  value={formData.frequenciaCardiaca}
                  onChange={handleInputChange}
                  error={!!errors.frequenciaCardiaca}
                  helperText={errors.frequenciaCardiaca}
                  sx={{ mt: 2 }}
                />
                <TextField
                  fullWidth
                  label="Temperatura"
                  name="temperatura"
                  value={formData.temperatura}
                  onChange={handleInputChange}
                  error={!!errors.temperatura}
                  helperText={errors.temperatura}
                  sx={{ mt: 2 }}
                />
                <TextField
                  fullWidth
                  label="Resultados de Exames"
                  name="resultadosExames"
                  value={formData.resultadosExames}
                  onChange={handleInputChange}
                  sx={{ mt: 2 }}
                />
                <TextField
                  fullWidth
                  label="Observações do Exame Físico"
                  name="observacoesExameFisico"
                  value={formData.observacoesExameFisico}
                  onChange={handleInputChange}
                  sx={{ mt: 2 }}
                />
              </Grid>

              {/* Botões de Ação */}
              <Grid item xs={12}>
                <Box display="flex" justifyContent="flex-end" gap={2}>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleGeneratePDF}
                    startIcon={<PictureAsPdfIcon />} // Usando o ícone importado
                  >
                    Gerar PDF
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<SaveIcon />}
                    type="submit"
                  >
                    Salvar
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Container>
    </Layout>
  );
}