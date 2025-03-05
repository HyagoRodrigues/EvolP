import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

// Registrando fontes personalizadas (opcional)
Font.register({
  family: 'Open Sans',
  fonts: [
    { src: 'https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-regular.ttf' },
    { src: 'https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-600.ttf', fontWeight: 600 }
  ]
});

const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: '#ffffff'
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 10,
    fontFamily: 'Open Sans'
  },
  datetime: {
    fontSize: 12,
    color: '#718096',
    marginBottom: 20
  },
  patientBox: {
    backgroundColor: '#F7FAFC',
    padding: 20,
    borderRadius: 5,
    marginBottom: 30
  },
  patientTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4A5568',
    marginBottom: 10
  },
  patientInfo: {
    flexDirection: 'row',
    marginBottom: 5
  },
  label: {
    width: 120,
    fontSize: 12,
    color: '#718096'
  },
  value: {
    flex: 1,
    fontSize: 12,
    color: '#2D3748'
  },
  section: {
    marginBottom: 20
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4A5568',
    marginBottom: 10,
    backgroundColor: '#EDF2F7',
    padding: 8,
    borderRadius: 3
  },
  field: {
    marginBottom: 10,
    paddingLeft: 10
  },
  fieldLabel: {
    fontSize: 12,
    color: '#718096',
    marginBottom: 3
  },
  fieldValue: {
    fontSize: 12,
    color: '#2D3748'
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: 'center',
    color: '#A0AEC0',
    fontSize: 10
  }
});

interface PDFDocumentProps {
  data: any;
  stepName: string;
  patientData: {
    nome: string;
    prontuario: string;
    dataAdmissao?: string;
    leito?: string;
    medicoResponsavel?: string;
  };
}

export const NursingPDFDocument = ({ data, stepName, patientData }: PDFDocumentProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <Text style={styles.title}>EvolP - Sistema de Evolução de Enfermagem</Text>
        <Text style={styles.datetime}>
          {new Date().toLocaleString('pt-BR')}
        </Text>
      </View>

      {/* Dados do Paciente */}
      <View style={styles.patientBox}>
        <Text style={styles.patientTitle}>Dados do Paciente</Text>
        <View style={styles.patientInfo}>
          <Text style={styles.label}>Nome:</Text>
          <Text style={styles.value}>{patientData.nome}</Text>
        </View>
        <View style={styles.patientInfo}>
          <Text style={styles.label}>Prontuário:</Text>
          <Text style={styles.value}>{patientData.prontuario}</Text>
        </View>
        {patientData.dataAdmissao && (
          <View style={styles.patientInfo}>
            <Text style={styles.label}>Data de Admissão:</Text>
            <Text style={styles.value}>{patientData.dataAdmissao}</Text>
          </View>
        )}
        {patientData.leito && (
          <View style={styles.patientInfo}>
            <Text style={styles.label}>Leito:</Text>
            <Text style={styles.value}>{patientData.leito}</Text>
          </View>
        )}
        {patientData.medicoResponsavel && (
          <View style={styles.patientInfo}>
            <Text style={styles.label}>Médico Responsável:</Text>
            <Text style={styles.value}>{patientData.medicoResponsavel}</Text>
          </View>
        )}
      </View>

      {/* Conteúdo do Formulário */}
      {data && Object.entries(data).map(([section, fields]: [string, any]) => (
        <View key={section} style={styles.section}>
          <Text style={styles.sectionTitle}>{section}</Text>
          {Object.entries(fields).map(([fieldName, value]: [string, any]) => (
            <View key={fieldName} style={styles.field}>
              <Text style={styles.fieldLabel}>{fieldName}:</Text>
              <Text style={styles.fieldValue}>{value}</Text>
            </View>
          ))}
        </View>
      ))}

      {/* Rodapé */}
      <Text style={styles.footer}>
        Documento gerado pelo Sistema EvolP
      </Text>
    </Page>
  </Document>
);