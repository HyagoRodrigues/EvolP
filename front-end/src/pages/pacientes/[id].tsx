import { useRouter } from 'next/router'
import { Container, Typography, Box, Paper, Button, Alert, CircularProgress } from '@mui/material'
import { Header } from '../../components/Header'
import { EvolucaoList } from '../../components/EvolucaoList'
import { ProtectedRoute } from '../../components/ProtectedRoute'
import { useEffect, useState } from 'react'
import { pacienteService } from '../../services/api'

export default function DetalhePaciente() {
  const router = useRouter()
  const { id } = router.query
  const [paciente, setPaciente] = useState(null)
  const [evolucoes, setEvolucoes] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      if (!id) return
      
      try {
        const [pacienteData, evolucoesData] = await Promise.all([
          pacienteService.getPacienteById(id as string),
          pacienteService.getEvolucoesByPacienteId(id as string)
        ])
        
        setPaciente(pacienteData)
        setEvolucoes(evolucoesData)
      } catch (error) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }
    
    loadData()
  }, [id])

  if (loading) return <CircularProgress />
  if (error) return <Alert severity="error">{error}</Alert>
  if (!paciente) return null

  return (
    <ProtectedRoute>
      <Header />
      <Container>
        <Box sx={{ my: 4 }}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              {paciente.nome}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Idade: {paciente.idade} anos | Sexo: {paciente.sexo}
            </Typography>
            <Button
              variant="contained"
              onClick={() => router.push(`/nova-evolucao/${id}`)}
            >
              Nova Evolução
            </Button>
          </Paper>

          <Typography variant="h5" component="h2" sx={{ mb: 2 }}>
            Histórico de Evoluções
          </Typography>
          <EvolucaoList evolucoes={evolucoes} />
        </Box>
      </Container>
    </ProtectedRoute>
  )
}