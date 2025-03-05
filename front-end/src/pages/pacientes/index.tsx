import { useState, useEffect } from 'react'; // Importando useEffect
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import {
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  TextField,
  IconButton,
  Button,
  Box,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Description as DescriptionIcon,
  Search as SearchIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import Layout from '../../components/Layout';

// Definindo a interface para o tipo Paciente
interface Paciente {
  id: number;
  nome: string;
  cpf: string;
  dataNascimento: string;
  leito: string;
}

// Dados mockados para exemplo
const mockPacientes: Paciente[] = [
  {
    id: 1,
    nome: 'João Silva',
    cpf: '123.456.789-00',
    dataNascimento: '1990-01-01',
    leito: '101A',
  },
  {
    id: 2,
    nome: 'Maria Santos',
    cpf: '987.654.321-00',
    dataNascimento: '1985-05-15',
    leito: '102B',
  },
];

export default function ListaPacientes() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [pacientes, setPacientes] = useState<Paciente[]>([]); // Tipando o estado

  // Carregar pacientes do localStorage
  useEffect(() => {
    const storedPacientes = localStorage.getItem('pacientes');
    if (storedPacientes) {
      setPacientes(JSON.parse(storedPacientes));
    } else {
      setPacientes(mockPacientes);
      localStorage.setItem('pacientes', JSON.stringify(mockPacientes));
    }
  }, []);

  // Função para excluir paciente
  const handleDelete = (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este paciente?')) {
      const updatedPacientes = pacientes.filter(paciente => paciente.id !== id);
      setPacientes(updatedPacientes);
      localStorage.setItem('pacientes', JSON.stringify(updatedPacientes));
    }
  };

  // Atualizar a função handleSearch para usar o estado atual
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    
    const storedPacientes = JSON.parse(localStorage.getItem('pacientes') || '[]');
    
    if (term === '') {
      setPacientes(storedPacientes);
    } else {
      const filtered = storedPacientes.filter((paciente: Paciente) =>
        paciente.nome.toLowerCase().includes(term) ||
        paciente.cpf.includes(term) ||
        paciente.leito.toLowerCase().includes(term)
      );
      setPacientes(filtered);
    }
  };

  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/login');
    },
  });

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString('pt-BR');
  };

  return (
    <Layout>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            mb: 4 
          }}>
            <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
              <Button
                startIcon={<ArrowBackIcon />}
                variant="outlined"
                sx={{
                  color: 'primary.light',
                  borderColor: 'primary.light',
                  '&:hover': {
                    borderColor: 'primary.main',
                    color: 'primary.main',
                  },
                }}
                onClick={() => router.back()}
              >
                Voltar
              </Button>
            </Box>
            <Typography variant="h4" component="h1" color="primary">
              Lista de Pacientes
            </Typography>
            <Button
              variant="contained"
              onClick={() => router.push('/cadastrar-paciente')}
            >
              Novo Paciente
            </Button>
          </Box>

          <TextField
            fullWidth
            variant="outlined"
            placeholder="Buscar paciente por nome, CPF ou leito..."
            value={searchTerm}
            onChange={handleSearch}
            sx={{ mb: 4 }}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
          />

          <TableContainer sx={{ 
            boxShadow: 1,
            borderRadius: 1,
            overflow: 'hidden'
          }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: 'primary.light' }}>
                  <TableCell sx={{ color: 'white' }}>Nome</TableCell>
                  <TableCell sx={{ color: 'white' }}>CPF</TableCell>
                  <TableCell sx={{ color: 'white' }}>Data de Nascimento</TableCell>
                  <TableCell sx={{ color: 'white' }}>Leito</TableCell>
                  <TableCell align="center" sx={{ color: 'white' }}>Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pacientes.map((paciente) => (
                  <TableRow 
                    key={paciente.id}
                    sx={{ '&:hover': { backgroundColor: 'action.hover' } }}
                  >
                    <TableCell>{paciente.nome}</TableCell>
                    <TableCell>{paciente.cpf}</TableCell>
                    <TableCell>{formatarData(paciente.dataNascimento)}</TableCell>
                    <TableCell>{paciente.leito}</TableCell>
                    <TableCell align="center">
                      <IconButton
                        color="primary"
                        onClick={() => router.push(`/pacientes/${paciente.id}`)}
                      >
                        <DescriptionIcon />
                      </IconButton>
                      <IconButton
                        color="primary"
                        onClick={() => router.push(`/pacientes/${paciente.id}/editar`)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(paciente.id)} // Corrigindo a chamada da função
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Container>
    </Layout>
  );
}