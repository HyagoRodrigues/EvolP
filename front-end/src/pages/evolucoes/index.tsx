import { useState } from 'react';
import { useRouter } from 'next/router';
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
  Box,
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import Layout from '../../components/Layout';

// Dados temporários para exemplo
const mockEvolucoes = [
  {
    id: 1,
    paciente: 'João Silva',
    data: '2024-01-15',
    profissional: 'Dr. Carlos',
    tipo: 'Avaliação Inicial',
  },
  {
    id: 2,
    paciente: 'Maria Santos',
    data: '2024-01-14',
    profissional: 'Dra. Ana',
    tipo: 'Acompanhamento',
  },
];

export default function ListaEvolucoes() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [evolucoes, setEvolucoes] = useState(mockEvolucoes);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    
    if (term === '') {
      setEvolucoes(mockEvolucoes);
    } else {
      const filtered = mockEvolucoes.filter(evolucao =>
        evolucao.paciente.toLowerCase().includes(term) ||
        evolucao.profissional.toLowerCase().includes(term) ||
        evolucao.tipo.toLowerCase().includes(term)
      );
      setEvolucoes(filtered);
    }
  };

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString('pt-BR');
  };

  return (
    <Layout>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom color="primary">
          Evoluções
        </Typography>

        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Buscar evolução por paciente, profissional ou tipo..."
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
                <TableCell>Paciente</TableCell>
                <TableCell>Data</TableCell>
                <TableCell>Profissional</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell align="center">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {evolucoes.map((evolucao) => (
                <TableRow key={evolucao.id}>
                  <TableCell>{evolucao.paciente}</TableCell>
                  <TableCell>{formatarData(evolucao.data)}</TableCell>
                  <TableCell>{evolucao.profissional}</TableCell>
                  <TableCell>{evolucao.tipo}</TableCell>
                  <TableCell align="center">
                    <IconButton
                      color="primary"
                      onClick={() => router.push(`/evolucoes/${evolucao.id}`)}
                    >
                      <VisibilityIcon />
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