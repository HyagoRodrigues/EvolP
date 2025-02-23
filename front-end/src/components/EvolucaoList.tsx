import { List, ListItem, ListItemText, Paper, Typography, Divider } from '@mui/material'
import { useState, useEffect } from 'react'

interface Evolucao {
  data: string
  descricao: string
  responsavel: string
}

interface EvolucaoListProps {
  evolucoes: Evolucao[]
}

export function EvolucaoList({ evolucoes }: EvolucaoListProps) {
  return (
    <Paper elevation={0} variant="outlined">
      <List>
        {evolucoes.map((evolucao, index) => (
          <div key={index}>
            <ListItem>
              <ListItemText
                primary={
                  <Typography component="div" variant="subtitle1" suppressHydrationWarning>
                    {new Date(evolucao.data).toLocaleDateString()}
                  </Typography>
                }
                secondary={
                  <div>
                    <Typography component="div" variant="body2" color="text.primary" sx={{ mt: 1 }}>
                      {evolucao.descricao}
                    </Typography>
                    <Typography component="div" variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                      Responsável: {evolucao.responsavel}
                    </Typography>
                  </div>
                }
              />
            </ListItem>
            {index < evolucoes.length - 1 && <Divider />}
          </div>
        ))}
      </List>
    </Paper>
  )
}