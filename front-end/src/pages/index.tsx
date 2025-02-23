import { Container, Typography, Grid } from '@mui/material'
import { Header } from '../components/Header'
import { PacienteCard } from '../components/PacienteCard'
import { ProtectedRoute } from '../components/ProtectedRoute'
import { useEffect, useState } from 'react'
import { pacienteService } from '../services/api'

export default function Home() {
  const [pacientes, setPacientes] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadPacientes() {
      try {
        const data = await pacienteService.getPacientes()
        setPacientes(data)
      } catch (error) {
        setError(error.message)
      }
    }
    loadPacientes()
  }, [])

  return (
    <ProtectedRoute>
      <Header />
      <Container>
        <Typography variant="h4" component="h1" sx={{ my: 4 }}>
          Lista de Pacientes
        </Typography>
        <Grid container spacing={3}>
          {pacientes.map((paciente) => (
            <Grid item xs={12} sm={6} md={4} key={paciente.id}>
              <PacienteCard {...paciente} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </ProtectedRoute>
  )
}