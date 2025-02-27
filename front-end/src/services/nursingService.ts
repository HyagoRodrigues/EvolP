import api from './api';

export interface NursingAssessment {
  id: string;
  pacienteId: string;
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
}

export interface NursingDiagnosis {
  id: string;
  pacienteId: string;
  problemasSaude: Array<{
    descricao: string;
    gravidade: 'leve' | 'moderado' | 'grave';
    tipo: 'agudo' | 'cronico';
  }>;
  necessidadesCuidado: Array<{
    descricao: string;
    urgencia: 'baixa' | 'media' | 'alta';
  }>;
}

export interface NursingPlanning {
  id: string;
  pacienteId: string;
  diagnosticos: string[];
  resultadosEsperados: string[];
  intervencoes: string[];
}

export interface NursingImplementation {
  id: string;
  pacienteId: string;
  cuidadosAutonomos: {
    descricao: string;
    dataHora: string;
    observacoes: string;
  };
  colaboracao: {
    profissional: string;
    acoes: string;
    dataHora: string;
  };
  prescricoes: {
    descricao: string;
    status: 'cumprida' | 'parcial' | 'nao_cumprida';
    observacoes: string;
  };
}

export interface NursingEvolution {
  id: string;
  pacienteId: string;
  avaliacaoResultados: string;
  ajustesPropostos: string;
  dataCriacao: string;
}

export const nursingService = {
  // Avaliação
  createAssessment: async (assessment: Omit<NursingAssessment, 'id'>) => {
    const response = await api.post<NursingAssessment>('/avaliacoes', assessment);
    return response.data;
  },

  getAssessment: async (pacienteId: string) => {
    const response = await api.get<NursingAssessment>(`/avaliacoes/${pacienteId}`);
    return response.data;
  },

  // Diagnóstico
  createDiagnosis: async (diagnosis: Omit<NursingDiagnosis, 'id'>) => {
    const response = await api.post<NursingDiagnosis>('/diagnosticos', diagnosis);
    return response.data;
  },

  getDiagnosis: async (pacienteId: string) => {
    const response = await api.get<NursingDiagnosis>(`/diagnosticos/${pacienteId}`);
    return response.data;
  },

  // Planejamento
  createPlanning: async (planning: Omit<NursingPlanning, 'id'>) => {
    const response = await api.post<NursingPlanning>('/planejamentos', planning);
    return response.data;
  },

  getPlanning: async (pacienteId: string) => {
    const response = await api.get<NursingPlanning>(`/planejamentos/${pacienteId}`);
    return response.data;
  },

  // Implementação
  createImplementation: async (implementation: Omit<NursingImplementation, 'id'>) => {
    const response = await api.post<NursingImplementation>('/implementacoes', implementation);
    return response.data;
  },

  getImplementation: async (pacienteId: string) => {
    const response = await api.get<NursingImplementation>(`/implementacoes/${pacienteId}`);
    return response.data;
  },

  // Evolução
  createEvolution: async (evolution: Omit<NursingEvolution, 'id'>) => {
    const response = await api.post<NursingEvolution>('/evolucoes', evolution);
    return response.data;
  },

  getEvolutions: async (pacienteId: string) => {
    const response = await api.get<NursingEvolution[]>(`/evolucoes/${pacienteId}`);
    return response.data;
  },
};