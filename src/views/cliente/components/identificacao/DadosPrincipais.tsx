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
import { Backdrop, Button, CardActions, CircularProgress, MenuItem } from '@mui/material'

import CustomTextField from '@core/components/mui/TextField'
import { type IdentificacaoType } from '@/types/ClienteType'
import type { cepType } from '@/utils/cep'
import { estadosOptions } from '@/utils/estados'
import { cpfCnpjMask, telefoleMask } from '@/utils/string'

//const initialData: IdentificacaoType = { cep: '' }

// const status = ['Status', 'Active', 'Inactive', 'Suspended']

const DadosPrincipais = ({ clienteData }: { clienteData?: IdentificacaoType }) => {
  // States
  const [reload, setReload] = useState(false)
  const [clienteDataEdit, setClienteDataEdit] = useState<IdentificacaoType | undefined>(clienteData)

  const handleReset = () => {
    setClienteDataEdit(clienteData)
  }

  const getCep = (cep: string): cepType | undefined => {
    try {
      if (cep.length < 8) {
        return {}
      } else {
        fetch(`http://viacep.com.br/ws/${cep}/json/`, { mode: 'cors' })
          .then(res => res.json())
          .then(data => {
            if (data.hasOwnProperty('erro')) {
              throw 'CEP não existe'
            } else {
              setClienteDataEdit({
                ...clienteDataEdit,
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
    setClienteDataEdit({ ...clienteDataEdit, cep: e.target.value })
    getCep(e.target.value)
  }

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Handle the click event for the button
    setReload(true)
    console.log(clienteDataEdit)
    setTimeout(() => {
      setReload(false)
    }, 2000)
  }

  return (
    <Card className='relative'>
      <form onSubmit={e => handleFormSubmit(e)}>
        <CardHeader title='Dados Pessoais' />
        <CardContent className='flex flex-col gap-4'>
          <Alert icon={false} severity='warning' onClose={() => {}}>
            <AlertTitle>Cuidado ao digitar os dados</AlertTitle>
            confira se está tudo ok
          </Alert>
          <Grid container spacing={5}>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label='Nome'
                value={clienteDataEdit?.nome}
                onChange={e => setClienteDataEdit({ ...clienteDataEdit, nome: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                type='email'
                fullWidth
                label='Email'
                value={clienteDataEdit?.email}
                onChange={e => setClienteDataEdit({ ...clienteDataEdit, email: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label='Identidade'
                value={clienteDataEdit?.identidade}
                onChange={e => setClienteDataEdit({ ...clienteDataEdit, identidade: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label='CPF/CNPJ'
                value={cpfCnpjMask(clienteDataEdit?.cpfCnpj)}
                onChange={e => setClienteDataEdit({ ...clienteDataEdit, cpfCnpj: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                type='tel'
                fullWidth
                label='celular'
                placeholder='(00) 00000-0000'
                value={telefoleMask(clienteDataEdit?.telefone)}
                onChange={e => setClienteDataEdit({ ...clienteDataEdit, telefone: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                type='date'
                fullWidth
                label='Data de Nascimento'
                value={clienteDataEdit?.dataNascimento}
                onChange={e => setClienteDataEdit({ ...clienteDataEdit, dataNascimento: e.target.value })}
              />
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        <CardHeader title='Endereço' />
        <CardContent className='flex flex-col gap-4'>
          <Grid container spacing={5}>
            <Grid item xs={12}>
              <CustomTextField fullWidth label='CEP' value={clienteDataEdit?.cep} onChange={e => handleCepChange(e)} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label='Logradouro'
                value={clienteDataEdit?.endereco}
                onChange={e => setClienteDataEdit({ ...clienteDataEdit, endereco: e.target.value })}
                disabled
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label='Bairro'
                value={clienteDataEdit?.bairro}
                onChange={e => setClienteDataEdit({ ...clienteDataEdit, bairro: e.target.value })}
                disabled
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label='Número'
                value={clienteDataEdit?.numero}
                onChange={e => setClienteDataEdit({ ...clienteDataEdit, numero: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label='Complemento'
                value={clienteDataEdit?.complemento}
                onChange={e => setClienteDataEdit({ ...clienteDataEdit, complemento: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label='Cidade'
                value={clienteDataEdit?.cidade}
                onChange={e => setClienteDataEdit({ ...clienteDataEdit, cidade: e.target.value })}
                disabled
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                select
                fullWidth
                label='Estado'
                value={clienteDataEdit?.estado ? clienteDataEdit?.estado : ''}
                onChange={e => setClienteDataEdit({ ...clienteDataEdit, estado: e.target.value as string })}
                disabled
              >
                {estadosOptions.map((estado, index) => (
                  <MenuItem key={index} value={estado.value} selected={clienteDataEdit?.estado === estado.value}>
                    {estado.label}
                  </MenuItem>
                ))}
              </CustomTextField>
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        <CardActions>
          <Button type='submit' variant='contained' className='mie-2'>
            {reload ? (
              <>
                <i className='tabler-refresh text-xl' /> aguarde...
              </>
            ) : (
              'Salvar'
            )}
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
      <Backdrop open={reload} className='absolute text-white z-[cal(var(--mui-zIndex-mobileStepper)-1)]'>
        <CircularProgress color='inherit' />
      </Backdrop>
    </Card>
  )
}

export default DadosPrincipais
