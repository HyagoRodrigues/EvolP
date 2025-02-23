import axios from 'axios'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'
})

interface Paciente {
  id: string
  nome: string
  idade: number
  sexo: 'M' | 'F'
}

interface Evolucao {
  id: string
  data: string
  descricao: string
  responsavel: string
  pacienteId: string
}

interface EvolucaoInput {
  descricao: string
  responsavel: string
}

import { mockPacientes, mockEvolucoes } from '../mocks/data'

export const pacienteService = {
  async getPacientes(): Promise<Paciente[]> {
    // Simulando delay de rede
    await new Promise(resolve => setTimeout(resolve, 500))
    return mockPacientes
  },

  async getPacienteById(id: string): Promise<Paciente> {
    await new Promise(resolve => setTimeout(resolve, 500))
    const paciente = mockPacientes.find(p => p.id === id)
    if (!paciente) {
      throw new Error('Paciente não encontrado')
    }
    return paciente
  },

  async getEvolucoesByPacienteId(pacienteId: string): Promise<Evolucao[]> {
    await new Promise(resolve => setTimeout(resolve, 500))
    const evolucoes = mockEvolucoes[pacienteId] || []
    return evolucoes
  },

  async createEvolucao(pacienteId: string, data: EvolucaoInput): Promise<Evolucao> {
    await new Promise(resolve => setTimeout(resolve, 500))
    const novaEvolucao = {
      id: Math.random().toString(36).substr(2, 9),
      data: new Date().toISOString(),
      pacienteId,
      ...data
    }
    
    if (!mockEvolucoes[pacienteId]) {
      mockEvolucoes[pacienteId] = []
    }
    mockEvolucoes[pacienteId].push(novaEvolucao)
    
    return novaEvolucao
  }
}