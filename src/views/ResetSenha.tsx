'use client'

// React Imports
import { useEffect, useState } from 'react'

// Next Imports
import Link from 'next/link'

// Next Imports
import { useRouter } from 'next/navigation'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'

// Component Imports
import { Alert, AlertTitle, CircularProgress, Grid, IconButton, InputAdornment } from '@mui/material'

import { toast } from 'react-toastify'

import Logo from '@/components/layout/shared/Logo-h'
import CustomTextField from '@core/components/mui/TextField'

// Config Imports
import { trataErro } from '@/utils/erro'
import type { SystemMode } from '@/@core/types'
import DirectionalIcon from '@/components/DirectionalIcon'
import UsuarioService from '@/services/UsuarioService'
import type UsuarioSenhaDTO from '@/types/UsuarioSenha.dto'
import type { UsuarioType } from '@/types/UsuarioType'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ResetSenha = ({ mode, tokenSenha }: { mode: SystemMode; tokenSenha: string }) => {
  // Hooks
  const router = useRouter()

  // States
  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const [isConfirmPasswordShown, setIsConfirmPasswordShown] = useState(false)
  const [novaSenha, setNovaSenha] = useState('')
  const [usuario, setUsuario] = useState<UsuarioType>()
  const [confirmacaoSenha, setConfirmacaoSenha] = useState('')
  const [sending, setSending] = useState(false)

  function handleSalvarSenha() {
    // Password requirements
    const requirements = [
      // Must be at least 8 characters
      novaSenha.length >= 6,

      // Must contain at least 1 uppercase letter
      ///[A-Z]/.test(novaSenha),

      // Must contain at least 1 lowercase letter
      ///[a-z]/.test(novaSenha),

      // Must contain at least 1 letter
      /[a-zA-Z]/.test(novaSenha),

      // Must contain at least 1 number
      /\d/.test(novaSenha)
    ]

    // If all requirements are met, password is valid
    const isValid = requirements.every(Boolean)

    if (!isValid) {
      toast.error(`Senha inválida, a senha precisa conter letras e números e ter ao menos 6 caracteres`)

      return
    }

    if (novaSenha != confirmacaoSenha) {
      toast.error(`Senha inválida, a confirmação de senha não é igual a senha`)

      return
    }

    if (usuario?.token) {
      setSending(true)

      const usuarioSenha = {
        token: tokenSenha,
        novaSenha,
        confirmacaoSenha
      } as UsuarioSenhaDTO

      UsuarioService.salvarSenha(usuario.token, usuarioSenha)
        .then(() => {
          toast.success('Senha salva com sucesso!')

          router.push('/login')
        })
        .catch(err => {
          toast.error(trataErro(err))
        })
        .finally(() => {
          setSending(false)
        })
    }
  }

  useEffect(() => {
    setSending(true)
    UsuarioService.getByTokenSenha(tokenSenha)
      .then(respUsuario => {
        setUsuario(respUsuario)
      })
      .catch(err => {
        const msgErro = trataErro(err)

        toast.error(msgErro)
      })
      .finally(() => {
        setSending(false)
      })
  }, [tokenSenha])

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
              <Typography variant='h5'>Resetar sua senha 🔒</Typography>
              <Typography>Informe sua nova senha</Typography>
            </div>
            <Alert icon={false} severity='warning' onClose={() => {}}>
              <AlertTitle>Requisitos para a senha</AlertTitle>
              Mínimo de 6 caracteres, ao menos uma letra e ao menos um número
            </Alert>
            <form noValidate autoComplete='off' className='flex flex-col gap-6'>
              <Grid item sm={12} className='mt-5'>
                <CustomTextField
                  fullWidth
                  label='Senha'
                  type={isPasswordShown ? 'text' : 'password'}
                  onChange={e => setNovaSenha(e.target.value)}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position='end'>
                        <IconButton
                          edge='end'
                          onClick={() => setIsPasswordShown(!isPasswordShown)}
                          onMouseDown={e => e.preventDefault()}
                        >
                          <i className={isPasswordShown ? 'tabler-eye-off' : 'tabler-eye'} />
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
              <Grid item sm={12}>
                <CustomTextField
                  fullWidth
                  label='Confirmação da senha'
                  type={isConfirmPasswordShown ? 'text' : 'password'}
                  onChange={e => setConfirmacaoSenha(e.target.value)}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position='end'>
                        <IconButton
                          edge='end'
                          onClick={() => setIsConfirmPasswordShown(!isConfirmPasswordShown)}
                          onMouseDown={e => e.preventDefault()}
                        >
                          <i className={isConfirmPasswordShown ? 'tabler-eye-off' : 'tabler-eye'} />
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>

              <Button fullWidth variant='contained' onClick={handleSalvarSenha} disabled={sending}>
                {sending ? (
                  <>
                    aguarde... <CircularProgress size={20} color='inherit' sx={{ marginLeft: '10px' }} />
                  </>
                ) : (
                  'Salvar senha'
                )}
              </Button>
            </form>

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

export default ResetSenha
