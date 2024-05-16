'use client'

// React Imports
import { useState } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'

// Component Imports
import { Box, Button, CardActions, Divider, MenuItem, Paper } from '@mui/material'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'
import type { ContratoType } from '@/types/ContratoType'
import { contratoInit, prazoList } from '@/types/ContratoType'
import ComprovanteUpload from './DocumentoUpload'
import type { arquivoUploadType, erroType } from '@/types/utilTypes'

interface props {
  tokenCliente: string
}

const ContratoEdit = ({ tokenCliente }: props) => {
  // States
  const [erro, setErro] = useState<erroType>()
  const [reload, setReload] = useState(false)
  const [contratoEdit, setContratoEdit] = useState<ContratoType>(contratoInit)

  const arquivoUploadData = {
    token: '',
    titulo: 'Comprovante de depósito',
    nomeArquivo: '',
    tipoUpload: 'COMPROVANTE_DEPOSITO'
  }

  const handleReset = () => {
    setContratoEdit(contratoInit)
  }

  return (
    <Card>
      <CardHeader title='Contratos' />
      <CardContent className='flex flex-col gap-4'>
        <Grid container spacing={6}>
          <Grid item xs={12} md={8}>
            <Card>
              <form onSubmit={e => e.preventDefault()}>
                {' '}
                <CardContent className='flex flex-col gap-4'>
                  {erro && (
                    <Alert icon={false} severity='error' onClose={() => {}}>
                      <AlertTitle>Erro</AlertTitle>
                      {erro?.msg}
                    </Alert>
                  )}
                  <Grid container spacing={2}>
                    <Grid container spacing={4}>
                      <Grid item xs={12} sm={6}>
                        <CustomTextField
                          fullWidth
                          label='Valor'
                          value={contratoEdit?.valor}
                          onChange={e => setContratoEdit({ ...contratoEdit, valor: parseFloat(e.target.value) })}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <CustomTextField
                          select
                          fullWidth
                          label='prazo'
                          value={contratoEdit?.prazo}
                          onChange={e => setContratoEdit({ ...contratoEdit, prazo: parseInt(e.target.value) })}
                        >
                          {prazoList.map((prazo, index) => (
                            <MenuItem
                              key={index}
                              value={index === 0 ? '' : prazo}
                              selected={contratoEdit?.prazo === prazo}
                            >
                              {prazo} meses
                            </MenuItem>
                          ))}
                        </CustomTextField>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <CustomTextField
                          fullWidth
                          label='Taxa'
                          value={contratoEdit?.taxa}
                          onChange={e => setContratoEdit({ ...contratoEdit, taxa: parseFloat(e.target.value) })}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <CustomTextField
                          fullWidth
                          label='Observação'
                          value={contratoEdit?.observacao}
                          onChange={e => setContratoEdit({ ...contratoEdit, observacao: e.target.value })}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                </CardContent>
                <Divider />
                <CardActions>
                  <Button type='submit' variant='contained' className='mie-2'>
                    Salvar
                  </Button>
                  <Button
                    type='reset'
                    variant='tonal'
                    color='secondary'
                    onClick={() => {
                      handleReset()
                    }}
                  >
                    Reset
                  </Button>
                </CardActions>
              </form>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <ComprovanteUpload arquivoUploadData={arquivoUploadData} />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default ContratoEdit
