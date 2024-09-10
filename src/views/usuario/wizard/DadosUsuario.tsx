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
import { cpfCnpjMask, telefoleMask } from '@/utils/string'
import UsuarioService from '@/services/UsuarioService'

import DirectionalIcon from '@/components/DirectionalIcon'
import { trataErro } from '@/utils/erro'
import { useEquipeContext } from '@/contexts/EquipeContext'
import { getPerfilUsuarioEnumDesc, PerfilUsuarioEnum } from '@/utils/enums/PerfilUsuarioEnum'

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

const DadosUsuario = ({ activeStep, handleNext, handlePrev, steps }: Props) => {
  //Context
  const { usuarioEquipe, setUsuarioEquipeContext, isCpf } = useEquipeContext()

  // States
  const [errorState, setErrorState] = useState<ErrorType | null>(null)
  const [sending, setSending] = useState<boolean>(false)

  type FormData = v.InferInput<typeof schema>

  const mostRestrictPf =
    usuarioEquipe?.tipoPessoa === 'F' &&
    (usuarioEquipe?.perfil === PerfilUsuarioEnum.PARCEIRO || usuarioEquipe?.perfil === PerfilUsuarioEnum.AGENTE)

  /*
  const mostRestrictPj =
    usuarioEquipe?.tipoPessoa === 'J' &&
    (usuarioEquipe?.perfil === PerfilUsuarioEnum.PARCEIRO || usuarioEquipe?.perfil === PerfilUsuarioEnum.AGENTE)
  */

  const schema = v.object({
    nome: v.string('É preciso digitar um nome'),
    email: pipe(v.string('É preciso digitar um email'), v.email('Email inválido')),
    telefone: v.string('É preciso informar um telefone'),
    dataNascimento: mostRestrictPf
      ? pipe(
          v.date('É preciso infromar uma data válida'),
          v.minValue(moment().subtract(110, 'years').toDate(), 'Não pode ser tão velho'),
          v.maxValue(moment().subtract(18, 'years').toDate(), 'Preciser ser maior de 18 anos')
        )
      : v.optional(v.date()),
    nomeSocio:
      usuarioEquipe?.tipoPessoa === 'J' ? v.string('É preciso informar o nome do sócio') : v.optional(v.string())
  })

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({
    resolver: valibotResolver(schema),
    defaultValues: {
      nome: usuarioEquipe?.nome,
      email: usuarioEquipe?.email,
      telefone: usuarioEquipe?.telefone,
      dataNascimento: usuarioEquipe?.dataNascimento ? moment(usuarioEquipe?.dataNascimento).toDate() : undefined,
      nomeSocio: usuarioEquipe?.nomeSocio ? usuarioEquipe?.nomeSocio : undefined
    }
  })

  const onSubmit: SubmitHandler<FormData> = async (data: FormData) => {
    console.log('usuarioEquipe', usuarioEquipe)

    if (usuarioEquipe && data.nome && usuarioEquipe.email) {
      setSending(true)
      UsuarioService.salvar(usuarioEquipe)
        .then(respUsuario => {
          setUsuarioEquipeContext(respUsuario)
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
            <CardHeader
              title={
                isCpf
                  ? `Dados Pessoais do ${getPerfilUsuarioEnumDesc(usuarioEquipe?.perfil)}`
                  : `Dados Principais  do ${getPerfilUsuarioEnumDesc(usuarioEquipe?.perfil)}`
              }
            />
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
                        label={isCpf ? 'Nome' : 'Nome Fantasia'}
                        placeholder={isCpf ? 'nome' : 'Nome Fantasia'}
                        value={usuarioEquipe?.nome || ''}
                        onChange={e => {
                          field.onChange(e.target.value)
                          setUsuarioEquipeContext({ ...usuarioEquipe, nome: e.target.value })
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
                {!isCpf && (
                  <Grid item xs={12} sm={6}>
                    <CustomTextField
                      fullWidth
                      label='Razão Social'
                      value={usuarioEquipe?.razaoSocial || ''}
                      onChange={e => setUsuarioEquipeContext({ ...usuarioEquipe, razaoSocial: e.target.value })}
                    />
                  </Grid>
                )}
                {!isCpf && (
                  <Grid item xs={12} sm={6}>
                    <CustomTextField
                      fullWidth
                      label='Inscrição Estadual'
                      placeholder='Inscrição Estadual'
                      value={usuarioEquipe?.inscricaoEstadual || ''}
                      onChange={e => setUsuarioEquipeContext({ ...usuarioEquipe, inscricaoEstadual: e.target.value })}
                    />
                  </Grid>
                )}
                <Grid item xs={12} sm={6}>
                  <CustomTextField
                    disabled
                    fullWidth
                    label={isCpf ? 'CPF' : 'CNPJ'}
                    value={cpfCnpjMask(usuarioEquipe?.cpfCnpj)}
                  />
                </Grid>
                {!isCpf && (
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name='nomeSocio'
                      control={control}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <CustomTextField
                          {...field}
                          fullWidth
                          label='Nome do Sócio'
                          placeholder='Nome do sócio administrativo'
                          value={usuarioEquipe?.nomeSocio || ''}
                          onChange={e => {
                            field.onChange(e.target.value)
                            setUsuarioEquipeContext({ ...usuarioEquipe, nomeSocio: e.target.value })
                            errorState !== null && setErrorState(null)
                          }}
                          {...((errors.nomeSocio || errorState !== null) && {
                            error: true,
                            helperText: errors?.nomeSocio?.message || errorState?.message
                          })}
                        />
                      )}
                    />
                  </Grid>
                )}
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
                        value={usuarioEquipe?.email || ''}
                        onChange={e => {
                          field.onChange(e.target.value)
                          setUsuarioEquipeContext({ ...usuarioEquipe, email: e.target.value })
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
                {isCpf && (
                  <Grid item xs={12} sm={6}>
                    <CustomTextField
                      fullWidth
                      label='RG/CNH'
                      placeholder='RG/CNH'
                      value={usuarioEquipe?.identidade || ''}
                      onChange={e => setUsuarioEquipeContext({ ...usuarioEquipe, identidade: e.target.value })}
                    />
                  </Grid>
                )}
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
                        label='Telefone'
                        placeholder='(00) 00000-0000'
                        value={telefoleMask(usuarioEquipe?.telefone)}
                        onChange={e => {
                          if (e.target.value.length <= 15) {
                            field.onChange(e.target.value)
                            setUsuarioEquipeContext({ ...usuarioEquipe, telefone: e.target.value })
                            errorState !== null && setErrorState(null)
                          }
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
                        label={isCpf ? 'Data de Nascimento' : 'Data Abertura'}
                        value={
                          usuarioEquipe?.dataNascimento
                            ? moment(usuarioEquipe?.dataNascimento).format('YYYY-MM-DD')
                            : ''
                        }
                        onChange={e => {
                          field.onChange(moment(e.target.value).toDate())
                          setUsuarioEquipeContext({ ...usuarioEquipe, dataNascimento: e.target.value })
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
            variant='contained'
            color='primary'
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
            {activeStep === steps.length - 1 ? `Enviar ${getPerfilUsuarioEnumDesc(usuarioEquipe?.perfil)}` : 'Próximo'}
          </Button>
        </div>
      </Grid>
    </Grid>
  )
}

export default DadosUsuario
