import { useState } from 'react';
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
} from '@mui/icons-material';
import Layout from '../../components/Layout';

// Dados mockados para exemplo
const mockPacientes = [
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
  const [pacientes, setPacientes] = useState(mockPacientes);
  
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/login');
    },
  });

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    
    if (term === '') {
      setPacientes(mockPacientes);
    } else {
      const filtered = mockPacientes.filter(paciente =>
        paciente.nome.toLowerCase().includes(term) ||
        paciente.cpf.includes(term) ||
        paciente.leito.toLowerCase().includes(term)
      );
      setPacientes(filtered);
    }
  };

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString('pt-BR');
  };

  return (
    <Layout>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
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

        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Buscar paciente por nome, CPF ou leito..."
            value={searchTerm}
            onChange={handleSearch}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
          />
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nome</TableCell>
                <TableCell>CPF</TableCell>
                <TableCell>Data de Nascimento</TableCell>
                <TableCell>Leito</TableCell>
                <TableCell align="center">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pacientes.map((paciente) => (
                <TableRow key={paciente.id}>
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
                      onClick={() => {
                        // Implementar lógica de exclusão
                        console.log('Excluir paciente:', paciente.id);
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </Layout>
  );
}