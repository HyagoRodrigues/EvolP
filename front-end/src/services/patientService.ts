import api from './api';

export interface Patient {
  id: string;
  nome: string;
  dataNascimento: string;
  cpf: string;
  
}

const STORAGE_KEY = 'evolp_pacientes';

export const patientService = {
  salvarPaciente: (dados: Omit<Patient, 'id'>): Patient => {
    const pacientes: Patient[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    
    const novoPaciente: Patient = {
      ...dados,
      id: crypto.randomUUID()
    };

    pacientes.push(novoPaciente);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pacientes));
    return novoPaciente;
  },

  buscarPacientes: (): Patient[] => {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  },

  buscarPacientePorId: (id: string): Patient | undefined => {
    const pacientes = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return pacientes.find((p: Patient) => p.id === id);
  },

  atualizarPaciente: (id: string, dados: Partial<Patient>): void => {
    const pacientes: Patient[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const index = pacientes.findIndex(p => p.id === id);
    
    if (index !== -1) {
      pacientes[index] = { ...pacientes[index], ...dados };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(pacientes));
    }
  }
};

export const patientService = {
  getAll: async () => {
    const response = await api.get<Patient[]>('/pacientes');
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get<Patient>(`/pacientes/${id}`);
    return response.data;
  },

  create: async (patient: Omit<Patient, 'id'>) => {
    const response = await api.post<Patient>('/pacientes', patient);
    return response.data;
  },

  update: async (id: string, patient: Partial<Patient>) => {
    const response = await api.put<Patient>(`/pacientes/${id}`, patient);
    return response.data;
  },

  delete: async (id: string) => {
    await api.delete(`/pacientes/${id}`);
  },
};