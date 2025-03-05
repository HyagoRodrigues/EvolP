import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

// Paleta de cores
const palette = {
  primary: '#80ed99',
  secondary: '#FFB0E0',
  error: '#FF6B6B',
  warning: '#FFD700',
  success: '#77DD77',
  text: {
    primary: '#4A4A4A',
    secondary: '#666666',
  },
  background: {
    default: '#eff7f6',
    paper: 'rgba(255, 255, 255, 0.9)',
  },
};

const templates = {
  avaliacao: {
    title: 'Avaliação de Enfermagem',
    sections: [
      {
        title: 'Dados Subjetivos',
        fields: [
          { key: 'queixaPrincipal', label: 'Queixa Principal' },
          { key: 'historicoMedico', label: 'Histórico Médico' },
          { key: 'alergias', label: 'Alergias' },
          { key: 'medicamentosUso', label: 'Medicamentos em Uso' },
          { key: 'observacoesSubjetivas', label: 'Observações' },
        ],
      },
      {
        title: 'Dados Objetivos',
        fields: [
          { key: 'pressaoArterial', label: 'Pressão Arterial' },
          { key: 'frequenciaCardiaca', label: 'Frequência Cardíaca' },
          { key: 'temperatura', label: 'Temperatura' },
          { key: 'resultadosExames', label: 'Resultados de Exames' },
          { key: 'observacoesExameFisico', label: 'Observações do Exame Físico' },
        ],
      },
    ],
  },
};

export const pdfService = {
  async generateStepPDF(data: any, stepName: string, patientData: any) {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595.276, 841.890]); // Tamanho A4
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    // Margens e espaçamentos padrão
    const margin = {
      top: 50,
      left: 50,
      right: 50,
      bottom: 50,
    };
    const lineSpacing = 20;
    const sectionSpacing = 40;

    // Função para desenhar texto com formatação
    const drawText = (
      text: string,
      x: number,
      y: number,
      size: number,
      isBold: boolean = false,
      color: any = rgb(0, 0, 0)
    ) => {
      page.drawText(text, {
        x,
        y,
        size,
        font: isBold ? boldFont : font,
        color,
      });
    };

    // Cabeçalho
    drawText(
      'EvolP - Sistema de Evolução de Enfermagem',
      margin.left,
      page.getHeight() - margin.top,
      20,
      true,
      rgb(0.2, 0.2, 0.2) // Cor escura para o título
    );

    // Data e Hora
    const now = new Date().toLocaleString('pt-BR');
    drawText(
      `Data e Hora: ${now}`,
      margin.left,
      page.getHeight() - margin.top - 30,
      12,
      false,
      rgb(0.4, 0.4, 0.4) // Cor secundária
    );

    // Dados do Paciente
    drawText('Dados do Paciente:', margin.left, page.getHeight() - margin.top - 80, 16, true, rgb(0.2, 0.2, 0.2));

    const patientFields = [
      { label: 'Nome', value: patientData.nome },
      { label: 'Prontuário', value: patientData.prontuario },
      { label: 'Data de Admissão', value: patientData.dataAdmissao || 'N/A' },
      { label: 'Leito', value: patientData.leito || 'N/A' },
      { label: 'Médico Responsável', value: patientData.medicoResponsavel || 'N/A' },
    ];

    let patientY = page.getHeight() - margin.top - 110;
    patientFields.forEach((field) => {
      drawText(`${field.label}:`, margin.left, patientY, 12, true, rgb(0.4, 0.4, 0.4));
      drawText(field.value, margin.left + 100, patientY, 12, false, rgb(0.2, 0.2, 0.2));
      patientY -= lineSpacing;
    });

    // Conteúdo do formulário
    let yPosition = patientY - sectionSpacing;
    const template = templates[stepName as keyof typeof templates];

    if (template && data) {
      template.sections.forEach((section) => {
        // Título da seção
        yPosition -= sectionSpacing;

        // Linha divisória acima do título da seção
        page.drawLine({
          start: { x: margin.left, y: yPosition + 15 },
          end: { x: page.getWidth() - margin.right, y: yPosition + 15 },
          thickness: 1,
          color: rgb(0.8, 0.8, 0.8),
        });

        drawText(section.title, margin.left, yPosition, 16, true, rgb(0.2, 0.2, 0.2));

        // Campos da seção
        section.fields.forEach((field) => {
          if (data[field.key]) {
            yPosition -= lineSpacing * 2;

            // Label do campo
            drawText(`${field.label}:`, margin.left + 15, yPosition, 12, true, rgb(0.4, 0.4, 0.4));

            // Valor do campo
            drawText(data[field.key], margin.left + 25, yPosition - lineSpacing, 12, false, rgb(0.2, 0.2, 0.2));

            yPosition -= lineSpacing;
          }
        });

        yPosition -= sectionSpacing;
      });
    }

    // Rodapé
    const footerText = 'Documento gerado pelo Sistema EvolP';
    const textWidth = font.widthOfTextAtSize(footerText, 10);

    drawText(
      footerText,
      (page.getWidth() - textWidth) / 2,
      margin.bottom,
      10,
      false,
      rgb(0.5, 0.5, 0.5) // Cor cinza para o rodapé
    );

    return pdfDoc.save();
  },
};