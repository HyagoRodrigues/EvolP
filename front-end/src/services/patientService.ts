import api from './api';

export interface Patient {
  id: string;
  nome: string;
  dataNascimento: string;
  cpf: string;
  // Add other patient fields as needed
}

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