export interface INursingAssessment {
  queixaPrincipal: string;
  historicoMedico: string;
  sinaisVitais: {
    pressao: string;
    temperatura: string;
    frequenciaCardiaca: string;
  };
}

export interface INursingDiagnosis {
  problemasSaude: string[];
  necessidadesCuidado: string[];
}

export interface INursingPlanning {
  intervencoes: string[];
}

export interface INursingImplementation {
  acoes: string[];
}

export interface INursingEvolutionForm {
  avaliacaoResultados: string;
  ajustesPropostos: string;
}

export interface INursingEvolutionData {
  avaliacao: INursingAssessment;
  diagnostico: INursingDiagnosis;
  planejamento: INursingPlanning;
  implementacao: INursingImplementation;
}