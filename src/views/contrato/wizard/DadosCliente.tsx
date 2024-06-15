import { useState } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'

import { Controller, useForm } from 'react-hook-form'
import * as v from 'valibot'
import { valibotResolver } from '@hookform/resolvers/valibot'
import type { SubmitHandler } from 'react-hook-form'

import moment, { locale } from 'moment'
import 'moment/locale/pt-br'

// Component Imports
import { Button, CardActions } from '@mui/material'

import CustomTextField from '@core/components/mui/TextField'
import { cpfCnpjMask, telefoleMask } from '@/utils/string'

import { useClienteContext } from '@/contexts/ClienteContext'
import DirectionalIcon from '@/components/DirectionalIcon'

locale('pt-br')

type Props = {
  activeStep: number
  handleNext: () => void
  handlePrev: () => void
  steps: { title: string; subtitle: string }[]
}

type ErrorType = {
  message: string[]
}

type FormData = v.InferInput<typeof schema>

const schema = v.object({
  nome: v.string('É preciso digitar um nome'),
  email: v.pipe(v.string('É preciso digitar um email'), v.email('Email inválido')),
  cpfCnpj: v.string('É preciso digitar um CPF ou um CNPJ')
})

const DadosCliente = ({ activeStep, handleNext, handlePrev, steps }: Props) => {
  // States
  const [errorState, setErrorState] = useState<ErrorType | null>(null)

  //hooks
  const { cliente, setClienteContext } = useClienteContext()

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({
    resolver: valibotResolver(schema),
    defaultValues: {
      nome: cliente?.nome,
      email: cliente?.email,
      cpfCnpj: cliente?.cpfCnpj
    }
  })

  const onSubmit: SubmitHandler<FormData> = async (data: FormData) => {
    console.log('data', data)
    handleNext()
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card className='relative'>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardHeader title='Dados Pessoais' />
            <CardContent className='flex flex-col gap-4'>
              <Grid container spacing={5}>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name='nome'
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <CustomTextField
                        {...field}
                        autoFocus
                        fullWidth
                        label='Nome'
                        placeholder='nome'
                        value={cliente?.nome || ''}
                        onChange={e => {
                          field.onChange(e.target.value)
                          setClienteContext({ ...cliente, nome: e.target.value })
                          errorState !== null && setErrorState(null)
                        }}
                        {...((errors.nome || errorState !== null) && {
                          error: true,
                          helperText: errors?.nome?.message || errorState?.message
                        })}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name='email'
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <CustomTextField
                        {...field}
                        fullWidth
                        type='email'
                        label='Email'
                        placeholder='email'
                        onChange={e => {
                          field.onChange(e.target.value)
                          setClienteContext({ ...cliente, email: e.target.value })
                          errorState !== null && setErrorState(null)
                        }}
                        {...((errors.email || errorState !== null) && {
                          error: true,
                          helperText: errors?.email?.message || errorState?.message
                        })}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <CustomTextField
                    fullWidth
                    label='Identidade'
                    value={cliente?.identidade || ''}
                    onChange={e => setClienteContext({ ...cliente, identidade: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name='cpfCnpj'
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <CustomTextField
                        {...field}
                        fullWidth
                        label='CPF/CNPJ'
                        value={cpfCnpjMask(cliente?.cpfCnpj)}
                        onChange={e => {
                          field.onChange(e.target.value)
                          setClienteContext({ ...cliente, cpfCnpj: e.target.value })
                          errorState !== null && setErrorState(null)
                        }}
                        {...((errors.cpfCnpj || errorState !== null) && {
                          error: true,
                          helperText: errors?.cpfCnpj?.message || errorState?.message
                        })}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <CustomTextField
                    type='tel'
                    fullWidth
                    label='celular'
                    placeholder='(00) 00000-0000'
                    value={telefoleMask(cliente?.telefone)}
                    onChange={e => setClienteContext({ ...cliente, telefone: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <CustomTextField
                    type='date'
                    fullWidth
                    label='Data de Nascimento'
                    value={cliente?.dataNascimento ? moment(cliente?.dataNascimento).format('YYYY-MM-DD') : ''}
                    onChange={e => setClienteContext({ ...cliente, dataNascimento: e.target.value })}
                  />
                </Grid>
              </Grid>
            </CardContent>
            <Divider />
            <CardActions>
              <Button
                variant='contained'
                color={activeStep === steps.length - 1 ? 'success' : 'primary'}
                type='submit'
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
            </CardActions>
          </form>
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
            onClick={handleSubmit(onSubmit)}
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

export default DadosCliente
