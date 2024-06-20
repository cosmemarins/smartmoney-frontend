import { useState } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'

import { Controller, useForm } from 'react-hook-form'
import * as v from 'valibot'
import { valibotResolver } from '@hookform/resolvers/valibot'
import type { SubmitHandler } from 'react-hook-form'

import moment, { locale } from 'moment'
import 'moment/locale/pt-br'

// Component Imports
import { Button, CardActions, CircularProgress } from '@mui/material'

import { toast } from 'react-toastify'

import CustomTextField from '@core/components/mui/TextField'
import { cpfCnpjMask, telefoleMask } from '@/utils/string'
import { salvarCliente } from '@/services/ClienteService'

import { useClienteContext } from '@/contexts/ClienteContext'
import { useContratoContext } from '@/contexts/ContratoContext'
import DirectionalIcon from '@/components/DirectionalIcon'
import { trataErro } from '@/utils/erro'

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
  identidade: v.string('É preciso informar a identidade'),
  telefone: v.string('É preciso informar um celular'),
  dataNascimento: v.pipe(
    v.date('É preciso infromar uma data válida'),
    v.minValue(moment().subtract(110, 'years').toDate(), 'Não pode ser tão velho'),
    v.maxValue(moment().subtract(18, 'years').toDate(), 'Preciser ser maior de 18 anos')
  )
})

const DadosCliente = ({ activeStep, handleNext, handlePrev, steps }: Props) => {
  // States
  const [errorState, setErrorState] = useState<ErrorType | null>(null)
  const [sending, setSending] = useState<boolean>(false)

  //hooks
  const { cliente, setClienteContext } = useClienteContext()
  const { contrato, setContratoContext } = useContratoContext()

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({
    resolver: valibotResolver(schema),
    defaultValues: {
      nome: cliente?.nome,
      email: cliente?.email,
      identidade: cliente?.identidade,
      telefone: cliente?.telefone,
      dataNascimento: moment(cliente?.dataNascimento).toDate()
    }
  })

  const onSubmit: SubmitHandler<FormData> = async (data: FormData) => {
    if (cliente && data.nome && data.email) {
      setSending(true)
      salvarCliente(cliente)
        .then(respCliente => {
          setClienteContext(respCliente)
          if (!contrato?.cliente)
            setContratoContext({
              ...contrato,
              cliente: { id: cliente?.id, token: cliente?.token }
            })
          handleNext()
        })
        .catch(err => {
          const msgErro = trataErro(err)

          toast.error(msgErro)
        })
        .finally(() => {
          setSending(false)
        })
    }
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
                        value={cliente?.email || ''}
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
                  <Controller
                    name='identidade'
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <CustomTextField
                        {...field}
                        fullWidth
                        label='Identidade'
                        placeholder='identidade'
                        value={cliente?.identidade || ''}
                        onChange={e => {
                          field.onChange(e.target.value)
                          setClienteContext({ ...cliente, identidade: e.target.value })
                          errorState !== null && setErrorState(null)
                        }}
                        {...((errors.identidade || errorState !== null) && {
                          error: true,
                          helperText: errors?.identidade?.message || errorState?.message
                        })}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <CustomTextField disabled fullWidth label='CPF/CNPJ' value={cpfCnpjMask(cliente?.cpfCnpj)} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name='telefone'
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <CustomTextField
                        {...field}
                        type='tel'
                        fullWidth
                        label='Celular'
                        placeholder='(00) 00000-0000'
                        value={telefoleMask(cliente?.telefone)}
                        onChange={e => {
                          field.onChange(e.target.value)
                          setClienteContext({ ...cliente, telefone: e.target.value })
                          errorState !== null && setErrorState(null)
                        }}
                        {...((errors.telefone || errorState !== null) && {
                          error: true,
                          helperText: errors?.telefone?.message || errorState?.message
                        })}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name='dataNascimento'
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <CustomTextField
                        {...field}
                        type='date'
                        fullWidth
                        label='Data de Nascimento'
                        value={cliente?.dataNascimento ? moment(cliente?.dataNascimento).format('YYYY-MM-DD') : ''}
                        onChange={e => {
                          field.onChange(new Date(e.target.value))
                          setClienteContext({ ...cliente, dataNascimento: e.target.value })
                          errorState !== null && setErrorState(null)
                        }}
                        {...((errors.dataNascimento || errorState !== null) && {
                          error: true,
                          helperText: errors?.dataNascimento?.message || errorState?.message
                        })}
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </CardContent>
            <CardActions></CardActions>
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
              ) : !sending ? (
                <DirectionalIcon ltrIconClass='tabler-arrow-right' rtlIconClass='tabler-arrow-left' />
              ) : (
                <CircularProgress size={20} color='inherit' />
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
