interface Assessment extends AssessmentForm {
  id: string;
  pacienteId: string;
  dataCriacao: string;
}

const STORAGE_KEY = 'evolp_avaliacoes';

export const storageService = {
  salvarAvaliacao: (pacienteId: string, dados: AssessmentForm): void => {
    const avaliacoes: Assessment[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    
    const novaAvaliacao: Assessment = {
      ...dados,
      id: crypto.randomUUID(),
      pacienteId,
      dataCriacao: new Date().toISOString()
    };

    avaliacoes.push(novaAvaliacao);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(avaliacoes));
  },

  buscarAvaliacoes: (pacienteId: string): Assessment[] => {
    const avaliacoes: Assessment[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return avaliacoes.filter(avaliacao => avaliacao.pacienteId === pacienteId);
  },

  buscarTodasAvaliacoes: (): Assessment[] => {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  },

  excluirAvaliacao: (avaliacaoId: string): void => {
    const avaliacoes: Assessment[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const filtradas = avaliacoes.filter(avaliacao => avaliacao.id !== avaliacaoId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtradas));
  }
};