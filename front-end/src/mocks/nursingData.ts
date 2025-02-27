import { INursingEvolutionData } from '@/types/nursing';

export const mockNursingData: INursingEvolutionData = {
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