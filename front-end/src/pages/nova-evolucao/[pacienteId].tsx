import { useRouter } from 'next/router'
import { Container, Typography, Box, TextField, Button, Paper, Alert } from '@mui/material'
import { Header } from '../../components/Header'
import { ProtectedRoute } from '../../components/ProtectedRoute'
import { useState } from 'react'
import { pacienteService } from '../../services/api'

export default function NovaEvolucao() {
  const router = useRouter()
  const { pacienteId } = router.query
  const [error, setError] = useState('')
  const [evolucao, setEvolucao] = useState({
    descricao: '',
    responsavel: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await pacienteService.createEvolucao(pacienteId as string, evolucao)
      router.push(`/pacientes/${pacienteId}`)
    } catch (error) {
      setError(error.message)
    }
  }

  return (
    <ProtectedRoute>
      <Header />
      <Container>
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Nova Evolução
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Paper sx={{ p: 3 }}>
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Descrição"
                multiline
                rows={4}
                value={evolucao.descricao}
                onChange={(e) => setEvolucao({ ...evolucao, descricao: e.target.value })}
                sx={{ mb: 2 }}
                required
              />
              <TextField
                fullWidth
                label="Responsável"
                value={evolucao.responsavel}
                onChange={(e) => setEvolucao({ ...evolucao, responsavel: e.target.value })}
                sx={{ mb: 3 }}
                required
              />
              <Button type="submit" variant="contained" color="primary">
                Salvar Evolução
              </Button>
            </form>
          </Paper>
        </Box>
      </Container>
    </ProtectedRoute>
  )
}