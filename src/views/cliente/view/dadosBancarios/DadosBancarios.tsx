'use client'

// React Imports
import { useState, type ChangeEvent } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import Divider from '@mui/material/Divider'

// Component Imports
import { Button, CardActions, MenuItem } from '@mui/material'

import CustomTextField from '@core/components/mui/TextField'
import { dadosBancariosInit, tiposContaBancaria, tiposPix } from '@/types/DadosBancariosType'
import type { DadosBancariosType } from '@/types/DadosBancariosType'

const initialData: DadosBancariosType = {}

const bancoList = [
  { codigo: '001', nome: 'Banco do Brasil S/A', apelido: 'Banco do Brasil' },
  { codigo: '104', nome: 'Caixa Econômica Federal', apelido: 'CEF' },
  { codigo: '338', nome: 'Santander S/A', apelido: 'Santader' }
]

const DadosBancarios = () => {
  // States
  const [dadosBancariosData, setDadosBancariosData] = useState<DadosBancariosType>(initialData)

  const handleReset = () => {
    setDadosBancariosData(dadosBancariosInit)
  }

  return (
    <Card>
      <form onSubmit={e => e.preventDefault()}>
        <CardHeader title='Dados Bancários' />
        <CardContent className='flex flex-col gap-4'>
          <Alert icon={false} severity='warning' onClose={() => {}}>
            <AlertTitle>Cuidado ao digitar os dados</AlertTitle>
            confira se está tudo ok
          </Alert>
          <Grid container spacing={5}>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                select
                fullWidth
                label='Banco'
                value={dadosBancariosData?.banco?.codigo}
                onChange={e => setDadosBancariosData({ ...dadosBancariosData, banco: { codigo: e.target.value } })}
              >
                {bancoList.map((banco, index) => (
                  <MenuItem
                    key={index}
                    value={index === 0 ? '' : banco.codigo}
                    selected={dadosBancariosData?.banco?.codigo === banco.codigo}
                  >
                    {banco.codigo} - {banco.apelido}
                  </MenuItem>
                ))}
              </CustomTextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                select
                fullWidth
                label='Tipo Conta'
                value={dadosBancariosData?.tipoConta}
                onChange={e => setDadosBancariosData({ ...dadosBancariosData, tipoConta: e.target.value })}
              >
                <MenuItem>Selecione um tipo de conta</MenuItem>
                {tiposContaBancaria.map((tipoConta, index) => (
                  <MenuItem key={index} value={tipoConta} selected={dadosBancariosData.tipoConta === tipoConta}>
                    {tipoConta}
                  </MenuItem>
                ))}
              </CustomTextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label='Agência'
                value={dadosBancariosData?.agencia}
                onChange={e => setDadosBancariosData({ ...dadosBancariosData, agencia: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label='Número da conta (com dv)'
                value={dadosBancariosData?.conta}
                onChange={e => setDadosBancariosData({ ...dadosBancariosData, conta: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label='Tipo poupança'
                value={dadosBancariosData?.tipoPoupanca}
                onChange={e => setDadosBancariosData({ ...dadosBancariosData, tipoPoupanca: e.target.value })}
              />
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        <CardHeader title='PIX' />
        <CardContent className='flex flex-col gap-4'>
          <Grid container spacing={5}>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                select
                fullWidth
                label='Tipo pix'
                value={dadosBancariosData?.tipoPix}
                onChange={e => setDadosBancariosData({ ...dadosBancariosData, tipoPix: e.target.value })}
              >
                <MenuItem>Selecione um tipo de pix</MenuItem>
                {tiposPix.map((tipoPix, index) => (
                  <MenuItem key={index} value={tipoPix} selected={dadosBancariosData.tipoPix === tipoPix}>
                    {tipoPix}
                  </MenuItem>
                ))}
              </CustomTextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label='Chave pix'
                value={dadosBancariosData?.chavePix}
                onChange={e => setDadosBancariosData({ ...dadosBancariosData, chavePix: e.target.value })}
              />
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        <CardActions>
          <Button type='submit' variant='contained' className='mie-2'>
            Submit
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
  )
}

export default DadosBancarios
