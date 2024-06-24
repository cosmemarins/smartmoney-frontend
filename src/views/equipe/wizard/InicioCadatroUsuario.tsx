// React Imports
import { useState } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'

// Component Imports
import { Button, CardActions, CircularProgress, Typography } from '@mui/material'

import { Controller, useForm } from 'react-hook-form'
import * as v from 'valibot'
import { valibotResolver } from '@hookform/resolvers/valibot'
import type { SubmitHandler } from 'react-hook-form'

import { toast } from 'react-toastify'

import CustomTextField from '@core/components/mui/TextField'
import { cpfCnpjMask } from '@/utils/string'

import { useUsuarioContext } from '@/contexts/UsuarioContext'
import { trataErro } from '@/utils/erro'
import isCPF from '@/utils/cpf'
import isCNPJ from '@/utils/cnpj'

import { getUsuarioByCpfCnpj } from '@/services/UsuarioService'
import { StatusUsuarioEnum } from '@/utils/enums/StatusUsuarioEnum'

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
  cpfCnpj: v.pipe(
    v.string('É preciso digitar um CPF ou um CNPJ'),
    v.check(input => isCPF(input) || isCNPJ(input), 'Cpf/Cnpj inválido, é preciso digitar um CPF ou CNPJ válido.')
  )
})

const InicioCadatroUsuario = ({ handleNext }: Props) => {
  // States
  const [errorState, setErrorState] = useState<ErrorType | null>(null)
  const [sending, setSending] = useState<boolean>(false)

  const { usuario, setUsuarioContext } = useUsuarioContext()

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({
    resolver: valibotResolver(schema),
    defaultValues: {
      cpfCnpj: usuario?.cpfCnpj
    }
  })

  const onSubmit: SubmitHandler<FormData> = async (data: FormData) => {
    if (data.cpfCnpj) {
      if (isCPF(data.cpfCnpj) || isCNPJ(data.cpfCnpj)) {
        setSending(true)

        getUsuarioByCpfCnpj(data.cpfCnpj)
          .then(respUsuario => {
            if (respUsuario) {
              setUsuarioContext(respUsuario)
            } else {
              setUsuarioContext({ cpfCnpj: data.cpfCnpj, status: StatusUsuarioEnum.NOVO })
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
        toast.error('CPF/CNPJ inválido!')
      }
    }
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card className='relative'>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardHeader title='Inicio do Cadastro de Parceiro' />
            <CardContent className='flex flex-col gap-4'>
              <Typography color='text.primary' className='font-medium'>
                Para cadastrar um parceiro comece informando o CPF ou CNPJ do parceiro:
              </Typography>
              <Grid container spacing={6}>
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
                        disabled={sending}
                        value={cpfCnpjMask(usuario?.cpfCnpj)}
                        onChange={e => {
                          field.onChange(e.target.value)
                          setUsuarioContext({ ...usuario, cpfCnpj: e.target.value })
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
      </Grid>
    </Grid>
  )
}

export default InicioCadatroUsuario
