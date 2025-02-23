import { Card, CardContent, Typography, Box, Button } from '@mui/material'
import { useRouter } from 'next/router'

interface PacienteCardProps {
  nome: string
  idade: number
  sexo: 'M' | 'F'
  id?: string // Adicionando ID para navegação
}

export function PacienteCard({ nome, idade, sexo, id }: PacienteCardProps) {
  const router = useRouter()

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" component="h2" gutterBottom>
          {nome}
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Idade: {idade} anos
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Sexo: {sexo}
          </Typography>
        </Box>
        <Button 
          variant="contained" 
          onClick={() => router.push(`/pacientes/${id}`)}
          fullWidth
        >
          Ver Detalhes
        </Button>
      </CardContent>
    </Card>
  )
}