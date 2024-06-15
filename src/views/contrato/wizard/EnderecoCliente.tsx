// React Imports
import { type ChangeEvent } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'

// Component Imports
import { Button, CardActions, MenuItem } from '@mui/material'

import CustomTextField from '@core/components/mui/TextField'
import type { cepType } from '@/utils/cep'
import { estadosOptions } from '@/utils/estados'

import { useClienteContext } from '@/contexts/ClienteContext'
import DirectionalIcon from '@/components/DirectionalIcon'

type Props = {
  activeStep: number
  handleNext: () => void
  handlePrev: () => void
  steps: { title: string; subtitle: string }[]
}

const EnderecoCliente = ({ activeStep, handleNext, handlePrev, steps }: Props) => {
  const { cliente, setClienteContext } = useClienteContext()

  const getCep = (value: string): cepType | undefined => {
    try {
      const cep = value.replace(/\D/g, '')

      if (cep.length < 8) {
        return {}
      } else {
        fetch(`https://viacep.com.br/ws/${cep}/json/`, { mode: 'cors' })
          .then(res => res.json())
          .then(data => {
            if (data.hasOwnProperty('erro')) {
              throw 'CEP não existe'
            } else {
              setClienteContext({
                ...cliente,
                cep: data?.cep,
                endereco: data?.logradouro,
                bairro: data?.bairro,
                cidade: data?.localidade,
                estado: data?.uf
              })
            }
          })
          .catch(err => console.log(err))
      }
    } catch (err) {
      // Throw error
      throw err
    }
  }

  const handleCepChange = (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setClienteContext({ ...cliente, cep: e.target.value })
    getCep(e.target.value)
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card className='relative'>
          <CardHeader title='Endereço' />
          <CardContent className='flex flex-col gap-4'>
            <Grid container spacing={5}>
              <Grid item xs={12}>
                <CustomTextField fullWidth label='CEP' value={cliente?.cep || ''} onChange={e => handleCepChange(e)} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <CustomTextField
                  fullWidth
                  label='Número'
                  value={cliente?.numero || ''}
                  onChange={e => setClienteContext({ ...cliente, numero: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <CustomTextField
                  fullWidth
                  label='Complemento'
                  value={cliente?.complemento || ''}
                  onChange={e => setClienteContext({ ...cliente, complemento: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <CustomTextField
                  fullWidth
                  label='Logradouro'
                  value={cliente?.endereco || ''}
                  onChange={e => setClienteContext({ ...cliente, endereco: e.target.value })}
                  disabled
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <CustomTextField
                  fullWidth
                  label='Bairro'
                  value={cliente?.bairro || ''}
                  onChange={e => setClienteContext({ ...cliente, bairro: e.target.value })}
                  disabled
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <CustomTextField
                  fullWidth
                  label='Cidade'
                  value={cliente?.cidade || ''}
                  onChange={e => setClienteContext({ ...cliente, cidade: e.target.value })}
                  disabled
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <CustomTextField
                  select
                  fullWidth
                  label='Estado'
                  value={cliente?.estado ? cliente?.estado : ''}
                  onChange={e => setClienteContext({ ...cliente, estado: e.target.value as string })}
                  disabled
                >
                  {estadosOptions.map((estado, index) => (
                    <MenuItem key={index} value={estado.value} selected={cliente?.estado === estado.value}>
                      {estado.label}
                    </MenuItem>
                  ))}
                </CustomTextField>
              </Grid>
            </Grid>
          </CardContent>
          <Divider />
          <CardActions></CardActions>
        </Card>
      </Grid>
      <Grid item xs={12}>
        <div className='flex items-center justify-between'>
          <Button
            variant='tonal'
            color='secondary'
            disabled={activeStep === 0}
            onClick={handlePrev}
            startIcon={<DirectionalIcon ltrIconClass='tabler-arrow-left' rtlIconClass='tabler-arrow-right' />}
          >
            Anterior
          </Button>
          <Button
            variant='contained'
            color={activeStep === steps.length - 1 ? 'success' : 'primary'}
            onClick={handleNext}
            endIcon={
              activeStep === steps.length - 1 ? (
                <i className='tabler-check' />
              ) : (
                <DirectionalIcon ltrIconClass='tabler-arrow-right' rtlIconClass='tabler-arrow-left' />
              )
            }
          >
            {activeStep === steps.length - 1 ? 'Enviar Contrato' : 'Próximo'}
          </Button>
        </div>
      </Grid>
    </Grid>
  )
}

export default EnderecoCliente
