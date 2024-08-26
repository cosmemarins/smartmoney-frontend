'use client'

// React Imports
import { useState } from 'react'

// Next Imports
import Link from 'next/link'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'

// Third-party Imports
import { Controller, useForm } from 'react-hook-form'

import type { SubmitHandler } from 'react-hook-form'
import { valibotResolver } from '@hookform/resolvers/valibot'
import * as v from 'valibot'
import { pipe } from 'valibot'

// Component Imports
import { CircularProgress, Grid } from '@mui/material'

import { toast } from 'react-toastify'

import Logo from '@/components/layout/shared/Logo-h'
import CustomTextField from '@core/components/mui/TextField'

// Config Imports
import { trataErro } from '@/utils/erro'
import type { SystemMode } from '@/@core/types'
import DirectionalIcon from '@/components/DirectionalIcon'
import UsuarioService from '@/services/UsuarioService'

type ErrorType = {
  message: string[]
}

type FormData = v.InferInput<typeof schema>

const schema = v.object({
  email: pipe(v.string('É preciso digitar um email'), v.email('Email inválido'))
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const EsqueciSenha = ({ mode }: { mode: SystemMode }) => {
  // States
  const [errorState, setErrorState] = useState<ErrorType | null>(null)
  const [sending, setSending] = useState(false)
  const [linkEnviado, setLinkEnviado] = useState<boolean>(false)
  const [email, setEmail] = useState<string>('')

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({
    resolver: valibotResolver(schema),
    defaultValues: {
      email: ''
    }
  })

  const onSubmit: SubmitHandler<FormData> = async (data: FormData) => {
    if (!data.email) return

    setSending(true)
    UsuarioService.esqueciSenha(data.email)
      .then(respUsuario => {
        if (respUsuario) {
          setLinkEnviado(true)
        } else {
          toast.error('Nenhum usuário com este email')
          setErrorState({ message: ['Nenhum usuário com este email'] })
        }
      })
      .catch(err => {
        const msgErro = trataErro(err)

        // é preciso definir o objeto error que tenha a propriedade message
        setErrorState({ message: [msgErro] })
        toast.error(msgErro)
      })
      .finally(() => {
        setSending(false)
      })
  }

  return (
    <Grid
      container
      spacing={0}
      direction='column'
      alignItems='center'
      justifyContent='center'
      sx={{ minHeight: '100vh' }}
    >
      <Grid item xs={3}>
        {' '}
        <Card className='flex flex-col sm:is-[450px]'>
          <CardContent className='sm:!p-12'>
            <div className='flex justify-center mbe-6'>
              <Logo />
            </div>
            <div className='flex flex-col gap-1 mbe-6'>
              {linkEnviado ? (
                <>
                  <Typography variant='h5'>Verifique seu email ✉️</Typography>
                  <Typography>
                    Um link de ativação de conta foi enviando para o email: <strong>{email}</strong> clique no link para
                    recuperara sua senha.
                  </Typography>
                </>
              ) : (
                <Typography>Informe seu email para recuperar sua senha:</Typography>
              )}
            </div>
            {!linkEnviado && (
              <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-6'>
                <Controller
                  name='email'
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <CustomTextField
                      {...field}
                      autoFocus
                      fullWidth
                      type='email'
                      label='Email'
                      placeholder='Informe seu email'
                      onChange={e => {
                        setEmail(e.target.value)
                        field.onChange(e.target.value)
                        errorState !== null && setErrorState(null)
                      }}
                      {...((errors.email || errorState !== null) && {
                        error: true,
                        helperText: errors?.email?.message || errorState?.message
                      })}
                    />
                  )}
                />

                <Button fullWidth variant='contained' type='submit' disabled={sending}>
                  {sending ? (
                    <>
                      aguarde... <CircularProgress size={20} color='inherit' sx={{ marginLeft: '10px' }} />
                    </>
                  ) : (
                    'Enviar link para resetar senha'
                  )}
                </Button>
              </form>
            )}
            <Typography className='flex justify-center items-center mt-5' color='primary'>
              <Link href='/login' className='flex items-center gap-1.5'>
                <DirectionalIcon
                  ltrIconClass='tabler-chevron-left'
                  rtlIconClass='tabler-chevron-right'
                  className='text-xl'
                />
                <span>Voltar para o Login</span>
              </Link>
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default EsqueciSenha
