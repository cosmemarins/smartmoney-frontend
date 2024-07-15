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
import ParceiroService from '@/services/ParceiroService'

import { useParceiroContext } from '@/contexts/ParceiroContext'
import DirectionalIcon from '@/components/DirectionalIcon'
import { trataErro } from '@/utils/erro'
import isCPF from '@/utils/cpf'
import { CargoEnum } from '@/utils/enums/CargoEnum'

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
  cpf: v.pipe(
    v.string('É preciso digitar um CPF'),
    v.check(input => isCPF(input), 'Cpf inválido, é preciso digitar um CPF válido.')
  ),
  nome: v.string('É preciso digitar um nome'),
  email: v.pipe(v.string('É preciso digitar um email'), v.email('Email inválido')),
  telefone: v.string('É preciso informar um celular'),
  dataNascimento: v.pipe(
    v.date('É preciso infromar uma data válida'),
    v.minValue(moment().subtract(110, 'years').toDate(), 'Não pode ser tão velho'),
    v.maxValue(moment().subtract(18, 'years').toDate(), 'Preciser ser maior de 18 anos')
  )
})

const DadosSocio = ({ activeStep, handleNext, handlePrev, steps }: Props) => {
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
      cpf: parceiro?.socioResponsavel?.cpf,
      nome: parceiro?.socioResponsavel?.nome,
      email: parceiro?.socioResponsavel?.email,
      telefone: parceiro?.socioResponsavel?.telefone,
      dataNascimento: moment(parceiro?.socioResponsavel?.dataNascimento).toDate()
    }
  })

  const onSubmit: SubmitHandler<FormData> = async (data: FormData) => {
    if (parceiro?.token && parceiro?.socioResponsavel && data.nome && data.email) {
      setSending(true)

      //não usei a variavel do contexto pq quando muda, ela não assume imediatamento o valor do cargo
      //e acaba mandando para o back o valor sem o cargo
      const socioResponsavel = {
        ...parceiro?.socioResponsavel,
        cargo: CargoEnum.SOCIO_ADMIN
      }

      ParceiroService.salvarUsuario(parceiro.token, socioResponsavel)
        .then(respUsuario => {
          setParceiroContext({
            ...parceiro,
            socioResponsavel: respUsuario
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
            <CardHeader title='Dados Pessoais do Sócio Responsável' />
            <CardContent className='flex flex-col gap-4'>
              <Grid container spacing={5}>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name='cpf'
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <CustomTextField
                        {...field}
                        autoFocus
                        fullWidth
                        label='CPF'
                        disabled={sending}
                        value={cpfCnpjMask(parceiro?.socioResponsavel?.cpf)}
                        onChange={e => {
                          field.onChange(e.target.value)
                          setParceiroContext({
                            ...parceiro,
                            socioResponsavel: { ...parceiro?.socioResponsavel, cpf: e.target.value }
                          })
                          errorState !== null && setErrorState(null)
                        }}
                        {...((errors.cpf || errorState !== null) && {
                          error: true,
                          helperText: errors?.cpf?.message || errorState?.message
                        })}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name='nome'
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <CustomTextField
                        {...field}
                        fullWidth
                        label='Nome'
                        placeholder='nome'
                        value={parceiro?.socioResponsavel?.nome || ''}
                        onChange={e => {
                          field.onChange(e.target.value)
                          setParceiroContext({
                            ...parceiro,
                            socioResponsavel: { ...parceiro?.socioResponsavel, nome: e.target.value }
                          })
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
                        value={parceiro?.socioResponsavel?.email || ''}
                        onChange={e => {
                          field.onChange(e.target.value)
                          setParceiroContext({
                            ...parceiro,
                            socioResponsavel: { ...parceiro?.socioResponsavel, email: e.target.value }
                          })
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
                        label='Celular'
                        placeholder='(00) 00000-0000'
                        value={telefoleMask(parceiro?.socioResponsavel?.telefone)}
                        onChange={e => {
                          field.onChange(e.target.value)
                          setParceiroContext({
                            ...parceiro,
                            socioResponsavel: { ...parceiro?.socioResponsavel, telefone: e.target.value }
                          })
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
                        value={
                          parceiro?.socioResponsavel?.dataNascimento
                            ? moment(parceiro?.socioResponsavel?.dataNascimento).format('YYYY-MM-DD')
                            : ''
                        }
                        onChange={e => {
                          field.onChange(new Date(e.target.value))
                          setParceiroContext({
                            ...parceiro,
                            socioResponsavel: { ...parceiro?.socioResponsavel, dataNascimento: e.target.value }
                          })
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
            {activeStep === steps.length - 1 ? 'Salvar Parceiro' : 'Próximo'}
          </Button>
        </div>
      </Grid>
    </Grid>
  )
}

export default DadosSocio
