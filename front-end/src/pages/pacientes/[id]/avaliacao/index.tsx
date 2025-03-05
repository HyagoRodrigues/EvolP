import { useState, useEffect } from 'react';
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
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  Person as PersonIcon,
  PictureAsPdf as PictureAsPdfIcon,
} from '@mui/icons-material';
import Layout from '../../../../components/Layout';
import { useNursing } from '../../../../contexts/NursingContext';
import jsPDF from 'jspdf';
import { storageService } from '../../../../services/storageService';

export default function NursingAssessment() {
  const router = useRouter();
  const { id } = router.query;

  const [paciente, setPaciente] = useState({
    nome: '',
    dataNascimento: '',
    leito: '',
  });

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

  interface AssessmentForm {
    queixaPrincipal: string;
    historicoMedico: string;
    alergias: string;
    medicamentosUso: string;
    observacoesSubjetivas: string;
    pressaoArterial: string;
    frequenciaCardiaca: string;
    temperatura: string;
    resultadosExames: string;
    observacoesExameFisico: string;
    nomeEnfermeiro: string;
    corenEnfermeiro: string;
  }

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
    nomeEnfermeiro: '',
    corenEnfermeiro: '',
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

    if (!formData.nomeEnfermeiro.trim()) {
      newErrors.nomeEnfermeiro = 'Campo obrigatório';
    }
    if (!formData.corenEnfermeiro.trim()) {
      newErrors.corenEnfermeiro = 'Campo obrigatório';
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

  const handleGeneratePDF = async () => {
    if (!validateForm()) {
      alert('Por favor, preencha o nome e o COREN do enfermeiro antes de gerar o PDF');
      return;
    }
  
    try {
      const pdf = new jsPDF();
  
      const styles = {
        title: { fontSize: 18, color: [41, 128, 185] },
        subtitle: { fontSize: 14, color: [52, 73, 94] },
        normal: { fontSize: 11, color: [0, 0, 0] },
        lineHeight: 10,
        margin: 20,
        fieldIndent: 45
      };
  
      let yPosition = styles.margin;
  
      pdf.setFontSize(styles.title.fontSize);
      pdf.setTextColor(...styles.title.color);
      pdf.text('EvolP - Sistema de Evolução de Pacientes', styles.margin, yPosition);
      yPosition += styles.lineHeight * 2;
  
      pdf.setFontSize(styles.normal.fontSize);
      pdf.setTextColor(...styles.normal.color);
      const currentDate = new Date().toLocaleDateString('pt-BR');
      const currentTime = new Date().toLocaleTimeString('pt-BR');
      pdf.text(`Avaliação de Enfermagem - ${currentDate} às ${currentTime}`, styles.margin, yPosition);
      yPosition += styles.lineHeight * 2;
  
      const addField = (label: string, value: string | undefined) => {
        if (value && value.trim()) {
          const maxWidth = pdf.internal.pageSize.width - (styles.margin * 2 + styles.fieldIndent + 10);
          pdf.setFont('helvetica', 'bold');
          pdf.text(`${label}:`, styles.margin, yPosition);
          pdf.setFont('helvetica', 'normal');
          
          const lines = pdf.splitTextToSize(value, maxWidth);
          pdf.text(lines, styles.margin + styles.fieldIndent, yPosition);
          yPosition += (lines.length * styles.lineHeight) + 3;
        }
      };
  
      pdf.setFontSize(styles.subtitle.fontSize);
      pdf.setTextColor(...styles.subtitle.color);
      pdf.text('Dados do Paciente', styles.margin, yPosition);
      yPosition += styles.lineHeight * 1.5;
  
      pdf.setFontSize(styles.normal.fontSize);
      pdf.setTextColor(...styles.normal.color);
  
      addField('Nome', paciente.nome);
      addField('Data de Nascimento', paciente.dataNascimento);
      addField('Leito', paciente.leito);
      yPosition += styles.lineHeight;
  
      const sections = [
        {
          title: 'Dados Subjetivos',
          fields: [
            { label: 'Queixa Principal', value: formData.queixaPrincipal },
            { label: 'Histórico Médico', value: formData.historicoMedico },
            { label: 'Alergias', value: formData.alergias },
            { label: 'Medicamentos', value: formData.medicamentosUso },
            { label: 'Observações', value: formData.observacoesSubjetivas },
          ],
        },
      ];
  
      sections.forEach((section) => {
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
  
      // Verifica se há espaço suficiente para a assinatura
      const spaceNeededForSignature = 40; // Espaço necessário para a assinatura
      if (yPosition > pdf.internal.pageSize.height - spaceNeededForSignature) {
        pdf.addPage(); // Adiciona uma nova página se não houver espaço
        yPosition = styles.margin; // Reinicia a posição Y para o topo da nova página
      }
  
      // Posiciona a assinatura no final da página
      yPosition = pdf.internal.pageSize.height - 50; // Ajusta a posição Y para o final da página
  
      // Posicionamento da assinatura
      const signatureWidth = 100;
      const signatureX = (pdf.internal.pageSize.width / 2) - (signatureWidth / 2);
  
      // Linha da assinatura
      pdf.line(signatureX, yPosition, signatureX + signatureWidth, yPosition);
  
      // Texto da assinatura
      pdf.setFontSize(10);
      pdf.setTextColor(0);
      const signatureText = `${formData.nomeEnfermeiro}\nEnfermeiro(a) - COREN: ${formData.corenEnfermeiro}`;
      pdf.text(signatureText, pdf.internal.pageSize.width / 2, yPosition + 10, { align: 'center' });
  
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
                  Dados do Profissional
                </Typography>
                <TextField
                  fullWidth
                  label="Nome do Enfermeiro"
                  name="nomeEnfermeiro"
                  value={formData.nomeEnfermeiro}
                  onChange={handleInputChange}
                  error={!!errors.nomeEnfermeiro}
                  helperText={errors.nomeEnfermeiro}
                  required
                />
                <TextField
                  fullWidth
                  label="COREN"
                  name="corenEnfermeiro"
                  value={formData.corenEnfermeiro}
                  onChange={handleInputChange}
                  error={!!errors.corenEnfermeiro}
                  helperText={errors.corenEnfermeiro}
                  sx={{ mt: 2 }}
                  required
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