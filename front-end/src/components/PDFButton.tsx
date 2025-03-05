import { Button } from '@mui/material';
import { PictureAsPdf as PdfIcon } from '@mui/icons-material';
import { pdf } from '@react-pdf/renderer';
import { NursingPDFDocument } from './PDFDocument';
import { PDFGenerator } from './PDFGenerator';

interface PDFButtonProps {
  stepName: string;
  patientData: {
    nome: string;
    prontuario: string;
    dataAdmissao?: string;
    leito?: string;
    medicoResponsavel?: string;
  };
  formData: any;
}

export function PDFButton(props: PDFButtonProps) {
  return <PDFGenerator {...props} />;
}