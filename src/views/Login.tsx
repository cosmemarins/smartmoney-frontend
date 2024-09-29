'use client'

// React Imports
import { useState } from 'react'

// Next Imports
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Checkbox from '@mui/material/Checkbox'
import Button from '@mui/material/Button'
import FormControlLabel from '@mui/material/FormControlLabel'

// Third-party Imports
import { signIn } from 'next-auth/react'
import { Controller, useForm } from 'react-hook-form'

import type { SubmitHandler } from 'react-hook-form'
import { valibotResolver } from '@hookform/resolvers/valibot'
import * as v from 'valibot'
import { pipe } from 'valibot'

// Component Imports
import { CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Grid } from '@mui/material'

import Logo from '@/components/layout/shared/Logo-h'
import CustomTextField from '@core/components/mui/TextField'

// Config Imports
import themeConfig from '@configs/themeConfig'
import { trataErro } from '@/utils/erro'
import type { SystemMode } from '@/@core/types'
import AvisoLegal from '@/components/AvisoLegal'

type ErrorType = {
  message: string[]
}

type FormData = v.InferInput<typeof schema>

const schema = v.object({
  email: pipe(v.string('É preciso digitar um email'), v.email('Email inválido')),
  password: pipe(v.string('É preciso digitar uma senha'), v.minLength(5, 'A senha deve conter no mínimo 5 caracteres'))
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Login = ({ mode }: { mode: SystemMode }) => {
  // States
  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const [errorState, setErrorState] = useState<ErrorType | null>(null)
  const [sending, setSending] = useState(false)
  const [openDlgAviso, setOpenDlgAviso] = useState<boolean>(false)

  // Hooks
  const router = useRouter()
  const searchParams = useSearchParams()

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({
    resolver: valibotResolver(schema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const handleClickShowPassword = () => setIsPasswordShown(show => !show)

  const onSubmit: SubmitHandler<FormData> = async (data: FormData) => {
    setSending(true)

    try {
      const res = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
        rememberMe: true
      })

      //console.log('LOGIN res', res)

      if (res && res.ok && res.error === null) {
        // Vars
        const redirectURL = searchParams.get('redirectTo') ?? '/'

        //router.push(getLocalizedUrl(redirectURL, locale as Locale))
        console.log('redirectURL ', redirectURL)
        router.push(redirectURL)
      } else {
        if (res?.error) {
          const msgErro = trataErro(res?.error)

          // é preciso definir o objeto error que tenha a propriedade message
          setErrorState({ message: [msgErro] })
        }
      }
    } catch (e) {
      //mesmo com erro no sigin não tá passando por aqui
      console.log('deu ruim', e)
      setErrorState({ message: ['Erro desconhecido no login'] })
    } finally {
      setSending(false)
    }
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
              <Typography variant='h5'>{`Bem vindo a ${themeConfig.templateName}!`}</Typography>
              <Typography>Informe seu login e senha para entrar no sistema</Typography>
            </div>
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
              <Controller
                name='password'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='Senha'
                    placeholder='············'
                    id='login-password'
                    type={isPasswordShown ? 'text' : 'password'}
                    onChange={e => {
                      field.onChange(e.target.value)
                      errorState !== null && setErrorState(null)
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position='end'>
                          <IconButton
                            edge='end'
                            onClick={handleClickShowPassword}
                            onMouseDown={e => e.preventDefault()}
                          >
                            <i className={isPasswordShown ? 'tabler-eye' : 'tabler-eye-off'} />
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                    {...(errors.password && { error: true, helperText: errors.password.message })}
                  />
                )}
              />

              <div className='flex justify-between items-center gap-x-3 gap-y-1 flex-wrap'>
                <FormControlLabel control={<Checkbox />} label='Lembrar senha' />
                <Typography className='text-end' color='primary' component={Link} href={'/esqueci-senha'}>
                  Esqueceu sua senha?
                </Typography>
              </div>
              <Button fullWidth variant='contained' type='submit' disabled={sending}>
                {sending ? (
                  <>
                    aguarde... <CircularProgress size={20} color='inherit' sx={{ marginLeft: '10px' }} />
                  </>
                ) : (
                  'Entrar'
                )}
              </Button>
              <div className='flex justify-center items-center flex-wrap gap-2'>
                <Button
                  variant='text'
                  onClick={() => {
                    setOpenDlgAviso(true)
                  }}
                >
                  Leia agora nossos termos e condições de uso
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
        <Dialog maxWidth='md' open={openDlgAviso} aria-labelledby='form-dialog-title' disableEscapeKeyDown>
          <DialogTitle id='form-dialog-title'>Avisos Legais - LGPD - PLDFT</DialogTitle>
          <DialogContent>
            <AvisoLegal />
          </DialogContent>
          <DialogActions className='dialog-actions-dense'>
            <Button
              variant='contained'
              color='primary'
              onClick={() => {
                setOpenDlgAviso(false)
              }}
            >
              Fechar
            </Button>
          </DialogActions>
        </Dialog>
      </Grid>
    </Grid>
  )
}

export default Login
