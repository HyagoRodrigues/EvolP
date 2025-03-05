import { useRef } from 'react';
import { Button, Box, Typography, Paper } from '@mui/material';
import { PictureAsPdf as PdfIcon } from '@mui/icons-material';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// Tipos
interface PDFGeneratorProps {
  patientData: {
    nome: string;
    prontuario: string;
    dataAdmissao?: string;
    leito?: string;
    medicoResponsavel?: string;
  };
  formData: Record<string, string>;
  stepName: string;
}

// Configurações do PDF
const PDF_CONFIG = {
  format: 'a4',
  margin: 10,
  scale: 2,
  width: 210, // A4 width in mm
  height: 297 // A4 height in mm
};

// Estilos
const styles = {
  container: {
    padding: '30px',
    margin: '20px',
    backgroundColor: '#fff',
    maxWidth: '800px',
    margin: '0 auto',
  },
  header: {
    borderBottom: '2px solid #80ed99',
    marginBottom: '30px',
    paddingBottom: '15px',
  },
  title: {
    fontSize: '24px',
    color: '#4A4A4A',
    marginBottom: '15px',
    fontWeight: 'bold',
  },
  patientInfo: {
    backgroundColor: '#f8f9fa',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '30px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  patientGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
  },
  section: {
    marginBottom: '30px',
  },
  sectionTitle: {
    fontSize: '20px',
    color: '#4A4A4A',
    borderLeft: '4px solid #80ed99',
    paddingLeft: '15px',
    marginBottom: '20px',
  },
  field: {
    marginBottom: '12px',
    padding: '8px',
    borderBottom: '1px solid #eee',
  },
  footer: {
    marginTop: '40px',
    borderTop: '1px solid #eee',
    paddingTop: '20px',
    textAlign: 'center',
    color: '#666666',
  },
};

export function PDFGenerator({ patientData, formData, stepName }: PDFGeneratorProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  const generatePDF = async () => {
    if (!contentRef.current) return;
  
    try {
      const canvas = await html2canvas(contentRef.current, {
        scale: PDF_CONFIG.scale,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });
  
      const imgHeight = (canvas.height * PDF_CONFIG.width) / canvas.width;
      const pdf = new jsPDF('p', 'mm', PDF_CONFIG.format);
      
      pdf.addImage(
        canvas.toDataURL('image/png'),
        'PNG',
        PDF_CONFIG.margin,
        PDF_CONFIG.margin,
        PDF_CONFIG.width - (PDF_CONFIG.margin * 2),
        imgHeight - (PDF_CONFIG.margin * 2)
      );
      
      pdf.save(`${stepName}_${patientData?.nome || 'paciente'}.pdf`);
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
    }
  };

  const formatFieldName = (name: string) => {
    return name
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase());
  };

  return (
    <>
      <Button
        variant="contained"
        color="secondary"
        startIcon={<PdfIcon />}
        onClick={generatePDF}
        sx={{ mb: 2 }}
      >
        Gerar PDF
      </Button>
  
      <div ref={contentRef} style={styles.container}>
        <Box sx={styles.header}>
          <Typography sx={styles.title}>
            EvolP - Sistema de Evolução de Enfermagem
          </Typography>
          <Typography variant="subtitle1">
            {new Date().toLocaleString('pt-BR')}
          </Typography>
        </Box>
  
        <Paper sx={styles.patientInfo}>
          <Typography variant="h6" gutterBottom>
            Dados do Paciente
          </Typography>
          <Box sx={styles.patientGrid}>
            <Typography><strong>Nome:</strong> {patientData?.nome || 'N/A'}</Typography>
            <Typography><strong>Prontuário:</strong> {patientData?.prontuario || 'N/A'}</Typography>
            {patientData?.dataAdmissao && (
              <Typography><strong>Data de Admissão:</strong> {patientData.dataAdmissao}</Typography>
            )}
            {patientData?.leito && (
              <Typography><strong>Leito:</strong> {patientData.leito}</Typography>
            )}
            {patientData?.medicoResponsavel && (
              <Typography><strong>Médico:</strong> {patientData.medicoResponsavel}</Typography>
            )}
          </Box>
        </Paper>
  
        <Box sx={styles.section}>
          <Typography sx={styles.sectionTitle}>
            {formatFieldName(stepName)}
          </Typography>
          {formData && Object.entries(formData).map(([key, value]) => (
            <Box key={key} sx={styles.field}>
              <Typography>
                <strong>{formatFieldName(key)}:</strong> {value || 'N/A'}
              </Typography>
            </Box>
          ))}
        </Box>
  
        <Box sx={styles.footer}>
          <Typography variant="body2">
            Documento gerado pelo Sistema EvolP em {new Date().toLocaleDateString('pt-BR')}
          </Typography>
        </Box>
      </div>
    </>
  );
}