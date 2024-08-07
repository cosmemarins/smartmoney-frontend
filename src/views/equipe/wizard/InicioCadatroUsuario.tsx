// React Imports
import { useState } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'

// Component Imports
import { Button, CardActions, CircularProgress, MenuItem, Typography } from '@mui/material'

import { Controller, useForm } from 'react-hook-form'
import * as v from 'valibot'
import { pipe } from 'valibot'
import { valibotResolver } from '@hookform/resolvers/valibot'
import type { SubmitHandler } from 'react-hook-form'

import { toast } from 'react-toastify'

import CustomTextField from '@core/components/mui/TextField'
import { cpfCnpjMask } from '@/utils/string'

import { useEquipeContext } from '@/contexts/EquipeContext'
import { trataErro } from '@/utils/erro'
import isCNPJ from '@/utils/cnpj'

import UsuarioService from '@/services/UsuarioService'
import isCPF from '@/utils/cpf'
import { StatusUsuarioEnum } from '@/utils/enums/StatusUsuarioEnum'
import { getPerfilUsuarioEnumDesc, PerfilUsuarioEnum } from '@/utils/enums/PerfilUsuarioEnum'

type Props = {
  activeStep: number
  handleNext: () => void
  handlePrev: () => void
  steps: { title: string; subtitle: string }[]
}

type ErrorType = {
  message: string[]
}

const InicioCadatroUsuario = ({ handleNext }: Props) => {
  // Context
  const { usuarioEquipe, setUsuarioEquipeContext } = useEquipeContext()

  // States
  const [errorState, setErrorState] = useState<ErrorType | null>(null)
  const [sending, setSending] = useState<boolean>(false)

  /*
  const apenasCpf =
    usuarioEquipe?.perfil === PerfilUsuarioEnum.ADMINISTRATIVO ||
    usuarioEquipe?.perfil === PerfilUsuarioEnum.FINANCEIRO ||
    usuarioEquipe?.perfil === PerfilUsuarioEnum.JURIDICO ||
    usuarioEquipe?.perfil === PerfilUsuarioEnum.OUTROS
  */
  const apenasCpf = false

  type FormData = v.InferInput<typeof schema>

  const schema = v.object({
    cpfCnpj: pipe(
      v.string(`É preciso digitar um ${apenasCpf ? 'CPF' : 'CPF/CNPJ'}`),
      apenasCpf
        ? v.check(input => isCPF(input), 'CPF inválido, é preciso digitar um CPF válido.')
        : v.check(input => isCPF(input) || isCNPJ(input), 'CPF/CNPJ inválido, é preciso digitar um CPF/CNPJ válido.')
    )
  })

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({
    resolver: valibotResolver(schema),
    defaultValues: {
      cpfCnpj: usuarioEquipe?.cpfCnpj
    }
  })

  const onSubmit: SubmitHandler<FormData> = async (data: FormData) => {
    if (data.cpfCnpj) {
      if (isCNPJ(data.cpfCnpj) || isCPF(data.cpfCnpj)) {
        setSending(true)
        UsuarioService.getByCpfCnpj(data.cpfCnpj)
          .then(respUsuario => {
            if (respUsuario) {
              setUsuarioEquipeContext(respUsuario)
            } else {
              setUsuarioEquipeContext({
                tipoPessoa: isCNPJ(data.cpfCnpj) ? 'J' : 'F',
                cpfCnpj: data.cpfCnpj,
                perfil: usuarioEquipe?.perfil,
                status: StatusUsuarioEnum.NOVO
              })
            }

            handleNext()
          })
          .catch(err => {
            const msgErro = trataErro(err)

            toast.error(msgErro)
          })
          .finally(() => {
            setSending(false)
          })
      } else {
        toast.error(`${apenasCpf ? 'CPF' : 'CPF/CNPJ'} inválido!`)
      }
    }
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        {(usuarioEquipe?.perfil && (
          <Card className='relative'>
            <form onSubmit={handleSubmit(onSubmit)}>
              <CardHeader title={`Inicio do Cadastro de ${getPerfilUsuarioEnumDesc(usuarioEquipe?.perfil)}`} />
              <CardContent className='flex flex-col gap-4'>
                <Typography color='text.primary' className='font-medium'>
                  Para cadastrar um {getPerfilUsuarioEnumDesc(usuarioEquipe?.perfil).toLowerCase()} comece informando
                  {usuarioEquipe?.perfil != PerfilUsuarioEnum.AGENTE &&
                  usuarioEquipe?.perfil != PerfilUsuarioEnum.PARCEIRO
                    ? 'um perfil e'
                    : ''}{' '}
                  o {apenasCpf ? 'CPF' : 'CPF/CNPJ'}:
                </Typography>
                <Grid container spacing={6}>
                  {usuarioEquipe?.perfil != PerfilUsuarioEnum.AGENTE &&
                    usuarioEquipe?.perfil != PerfilUsuarioEnum.PARCEIRO && (
                      <>
                        <Grid item xs={12} sm={6}>
                          <CustomTextField
                            select
                            fullWidth
                            label='Perfil'
                            value={usuarioEquipe?.perfil ? usuarioEquipe?.perfil : 'OUTROS'}
                            onChange={e => setUsuarioEquipeContext({ ...usuarioEquipe, perfil: e.target.value })}
                          >
                            <MenuItem
                              value={PerfilUsuarioEnum.ADMINISTRATIVO}
                              selected={usuarioEquipe?.perfil === PerfilUsuarioEnum.ADMINISTRATIVO}
                            >
                              {getPerfilUsuarioEnumDesc(PerfilUsuarioEnum.ADMINISTRATIVO)}
                            </MenuItem>
                            <MenuItem
                              value={PerfilUsuarioEnum.FINANCEIRO}
                              selected={usuarioEquipe?.perfil === PerfilUsuarioEnum.FINANCEIRO}
                            >
                              {getPerfilUsuarioEnumDesc(PerfilUsuarioEnum.FINANCEIRO)}
                            </MenuItem>
                            <MenuItem
                              value={PerfilUsuarioEnum.JURIDICO}
                              selected={usuarioEquipe?.perfil === PerfilUsuarioEnum.JURIDICO}
                            >
                              {getPerfilUsuarioEnumDesc(PerfilUsuarioEnum.JURIDICO)}
                            </MenuItem>
                            <MenuItem
                              value={PerfilUsuarioEnum.OUTROS}
                              selected={usuarioEquipe?.perfil === PerfilUsuarioEnum.OUTROS}
                            >
                              {getPerfilUsuarioEnumDesc(PerfilUsuarioEnum.OUTROS)}
                            </MenuItem>
                          </CustomTextField>
                        </Grid>
                        <Grid item xs={12} sm={6}></Grid>
                      </>
                    )}
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name='cpfCnpj'
                      control={control}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <CustomTextField
                          {...field}
                          fullWidth
                          label={apenasCpf ? 'CPF' : 'CPF/CNPJ'}
                          disabled={sending}
                          value={cpfCnpjMask(usuarioEquipe?.cpfCnpj)}
                          onChange={e => {
                            field.onChange(e.target.value)
                            setUsuarioEquipeContext({ ...usuarioEquipe, cpfCnpj: e.target.value })
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
                  <Grid item xs={6} sm={6} sx={{ alignContent: 'flex-end' }}>
                    <Button
                      variant='contained'
                      color='primary'
                      type='submit'
                      className='gap-2'
                      endIcon={
                        !sending ? <i className='tabler-arrow-right' /> : <CircularProgress size={20} color='inherit' />
                      }
                    >
                      Próximo
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
              <CardActions></CardActions>
            </form>
          </Card>
        )) || (
          <>
            Aguarde... <CircularProgress size={20} color='inherit' />
          </>
        )}
      </Grid>
    </Grid>
  )
}

export default InicioCadatroUsuario
