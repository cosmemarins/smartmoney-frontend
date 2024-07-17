import { useState } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'

import { Controller, useForm } from 'react-hook-form'
import * as v from 'valibot'
import { pipe } from 'valibot'
import { valibotResolver } from '@hookform/resolvers/valibot'
import type { SubmitHandler } from 'react-hook-form'

import moment, { locale } from 'moment'
import 'moment/locale/pt-br'

// Component Imports
import { Button, CardActions, CircularProgress } from '@mui/material'

import { toast } from 'react-toastify'

import CustomTextField from '@core/components/mui/TextField'
import { telefoleMask } from '@/utils/string'
import ParceiroService from '@/services/ParceiroService'

import { useParceiroContext } from '@/contexts/ParceiroContext'
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
  nomeFantasia: v.string('É preciso digitar um nome'),
  email: pipe(v.string('É preciso digitar um email'), v.email('Email inválido')),
  telefone: v.string('É preciso informar um celular')
})

const DadosEmpresa = ({ activeStep, handleNext, handlePrev, steps }: Props) => {
  // States
  const [errorState, setErrorState] = useState<ErrorType | null>(null)
  const [sending, setSending] = useState<boolean>(false)

  //hooks
  const { parceiro, setParceiroContext } = useParceiroContext()

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({
    resolver: valibotResolver(schema),
    defaultValues: {
      nomeFantasia: parceiro?.nomeFantasia,
      email: parceiro?.email,
      telefone: parceiro?.telefone
    }
  })

  const onSubmit: SubmitHandler<FormData> = async (data: FormData) => {
    if (parceiro && data.nomeFantasia && data.email) {
      setSending(true)
      ParceiroService.salvar(parceiro)
        .then(respParceiro => {
          setParceiroContext(respParceiro)
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
            <CardHeader title='Dados da Empresa' />
            <CardContent className='flex flex-col gap-4'>
              <Grid container spacing={5}>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name='nomeFantasia'
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <CustomTextField
                        {...field}
                        autoFocus
                        fullWidth
                        label='Nome Fantasia'
                        placeholder='Nome fantasia'
                        value={parceiro?.nomeFantasia || ''}
                        onChange={e => {
                          field.onChange(e.target.value)
                          setParceiroContext({ ...parceiro, nomeFantasia: e.target.value })
                          errorState !== null && setErrorState(null)
                        }}
                        {...((errors.nomeFantasia || errorState !== null) && {
                          error: true,
                          helperText: errors?.nomeFantasia?.message || errorState?.message
                        })}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <CustomTextField
                    name='razaoSocial'
                    fullWidth
                    label='Razão Social'
                    placeholder='razão social'
                    value={parceiro?.razaoSocial || ''}
                    onChange={e => {
                      setParceiroContext({ ...parceiro, razaoSocial: e.target.value })
                    }}
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
                        label='Email da Empresa'
                        placeholder='email'
                        value={parceiro?.email || ''}
                        onChange={e => {
                          field.onChange(e.target.value)
                          setParceiroContext({ ...parceiro, email: e.target.value })
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
                    name='telefone'
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <CustomTextField
                        {...field}
                        type='tel'
                        fullWidth
                        label='Telefone da Empresa'
                        placeholder='(00) 00000-0000'
                        value={telefoleMask(parceiro?.telefone)}
                        onChange={e => {
                          field.onChange(e.target.value)
                          setParceiroContext({ ...parceiro, telefone: e.target.value })
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
                  <CustomTextField
                    name='Inscrição Estadual'
                    fullWidth
                    label='Inscrição Estadual'
                    placeholder='Inscrição estadual'
                    value={parceiro?.inscricaoEstadual || ''}
                    onChange={e => {
                      setParceiroContext({ ...parceiro, inscricaoEstadual: e.target.value })
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <CustomTextField
                    name='dataAbertura'
                    type='date'
                    fullWidth
                    label='Data de Abertura'
                    value={parceiro?.dataAbertura ? moment(parceiro?.dataAbertura).format('YYYY-MM-DD') : ''}
                    onChange={e => {
                      setParceiroContext({ ...parceiro, dataAbertura: moment(e.target.value).toDate() })
                    }}
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
            {activeStep === steps.length - 1 ? 'Salvar Parceiro' : 'Próximo'}
          </Button>
        </div>
      </Grid>
    </Grid>
  )
}

export default DadosEmpresa
