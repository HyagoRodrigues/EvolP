import { useState, useEffect } from 'react'; // Certifique-se de importar useEffect
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
  PictureAsPdf as PictureAsPdfIcon,
} from '@mui/icons-material';
import Layout from '../../../../components/Layout';
import { useNursing } from '../../../../contexts/NursingContext';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { storageService } from '../../../../services/storageService';

export default function NursingAssessment() {
  const router = useRouter();
  const { id } = router.query;

  // Estado do paciente
  const [paciente, setPaciente] = useState({
    nome: '',
    dataNascimento: '',
    leito: '',
  });

  // Carregar dados do paciente ao montar o componente
  useEffect(() => {
    if (id) {
      const storedPacientes = JSON.parse(localStorage.getItem('pacientes') || '[]');
      const pacienteEncontrado = storedPacientes.find((p: any) => p.id.toString() === id.toString());
      if (pacienteEncontrado) {
        setPaciente(pacienteEncontrado);
      }
    }
  }, [id]);

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
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        storageService.salvarAvaliacao(id as string, formData);
        updateNursingData(id as string, formData);
        alert('Avaliação salva com sucesso!');
        router.push('/');
      } catch (error) {
        console.error('Erro ao salvar avaliação:', error);
        alert('Erro ao salvar a avaliação. Por favor, tente novamente.');
      }
    }
  };
  // Add these utility functions before handleGeneratePDF
    const formatarData = (data: string) => {
      if (!data) return 'Data não informada';
      return new Date(data).toLocaleDateString('pt-BR');
    };
  
    const calcularIdade = (dataNascimento: string) => {
      if (!dataNascimento) return 'Idade não calculada';
      const hoje = new Date();
      const nascimento = new Date(dataNascimento);
      let idade = hoje.getFullYear() - nascimento.getFullYear();
      const mesAtual = hoje.getMonth();
      const mesNascimento = nascimento.getMonth();
      
      if (mesAtual < mesNascimento || 
          (mesAtual === mesNascimento && hoje.getDate() < nascimento.getDate())) {
        idade--;
      }
      return `${idade} anos`;
    };
  
    const handleGeneratePDF = async () => {
      try {
        if (!formData.queixaPrincipal || !formData.pressaoArterial) {
          alert('Por favor, preencha os campos obrigatórios antes de gerar o PDF');
          return;
        }
  
        const pdf = new jsPDF();
  
        const styles = {
          title: { fontSize: 18, color: [41, 128, 185] },
          subtitle: { fontSize: 14, color: [52, 73, 94] },
          normal: { fontSize: 11, color: [0, 0, 0] },
          lineHeight: 7,
          margin: 15,
          fieldIndent: 40
        };
  
        let yPosition = styles.margin;
  
        // Cabeçalho
        pdf.setFontSize(styles.title.fontSize);
        pdf.setTextColor(...styles.title.color);
        pdf.text('EvolP - Sistema de Evolução de Pacientes', styles.margin, yPosition);
        yPosition += styles.lineHeight * 2;
  
        // Data e Hora
        pdf.setFontSize(styles.normal.fontSize);
        pdf.setTextColor(...styles.normal.color);
        const currentDate = new Date().toLocaleDateString('pt-BR');
        const currentTime = new Date().toLocaleTimeString('pt-BR');
        pdf.text(`Avaliação de Enfermagem - ${currentDate} às ${currentTime}`, styles.margin, yPosition);
        yPosition += styles.lineHeight * 2;
  
        // Função auxiliar para adicionar campos
        const addField = (label: string, value: string | undefined) => {
          if (value) {
            const maxWidth = pdf.internal.pageSize.width - (styles.margin * 2 + styles.fieldIndent + 10);
            pdf.setFont('helvetica', 'bold');
            pdf.text(`${label}:`, styles.margin, yPosition);
            pdf.setFont('helvetica', 'normal');
            
            const lines = pdf.splitTextToSize(value, maxWidth);
            pdf.text(lines, styles.margin + styles.fieldIndent, yPosition);
            yPosition += (lines.length * styles.lineHeight) + 2;
          }
        };
  
        // Dados do Paciente
        pdf.setFontSize(styles.subtitle.fontSize);
        pdf.setTextColor(...styles.subtitle.color);
        pdf.text('Dados do Paciente', styles.margin, yPosition);
        yPosition += styles.lineHeight * 1.5;
        
        pdf.setFontSize(styles.normal.fontSize);
        pdf.setTextColor(...styles.normal.color);
        
        addField('Nome', paciente.nome);
        addField('Data de Nascimento', `${formatarData(paciente.dataNascimento)} (${calcularIdade(paciente.dataNascimento)})`);
        addField('Leito', paciente.leito);
        if (paciente.tipoSanguineo) addField('Tipo Sanguíneo', paciente.tipoSanguineo);
        if (paciente.alergias?.length > 0) addField('Alergias', paciente.alergias.join(', '));
        
        yPosition += styles.lineHeight;
  
        // Seções da avaliação
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
  
        sections.forEach(section => {
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
  
        // Rodapé com paginação
        const pageCount = pdf.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
          pdf.setPage(i);
          pdf.setFontSize(9);
          pdf.setTextColor(128, 128, 128);
          pdf.text(
            `Página ${i} de ${pageCount}`,
            pdf.internal.pageSize.width / 2,
            pdf.internal.pageSize.height - 10,
            { align: 'center' }
          );
        }
  
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

              <Grid item xs={12}>
                <Box display="flex" justifyContent="flex-end" gap={2}>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleGeneratePDF}
                    startIcon={<PictureAsPdfIcon />}
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