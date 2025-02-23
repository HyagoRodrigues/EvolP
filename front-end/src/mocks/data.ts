export const mockPacientes = [
  { 
    id: '1',
    nome: 'João Silva',
    idade: 45,
    sexo: 'M'
  },
  { 
    id: '2',
    nome: 'Maria Santos',
    idade: 32,
    sexo: 'F'
  },
  { 
    id: '3',
    nome: 'Pedro Oliveira',
    idade: 28,
    sexo: 'M'
  }
]

export const mockEvolucoes = {
  '1': [
    {
      id: '1',
      data: '2024-01-15',
      descricao: 'Paciente apresentou melhora significativa.',
      responsavel: 'Dr. Carlos Santos',
      pacienteId: '1'
    },
    {
      id: '2',
      data: '2024-01-14',
      descricao: 'Iniciado novo protocolo de medicação.',
      responsavel: 'Dra. Ana Lima',
      pacienteId: '1'
    }
  ],
  '2': [
    {
      id: '3',
      data: '2024-01-15',
      descricao: 'Primeira consulta realizada.',
      responsavel: 'Dr. Carlos Santos',
      pacienteId: '2'
    }
  ]
}