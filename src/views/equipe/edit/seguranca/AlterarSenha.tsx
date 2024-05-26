'use client'

// React Imports
import { useState } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import Button from '@mui/material/Button'

// Component Imports
import { toast } from 'react-toastify'

import axios from 'axios'

import CustomTextField from '@core/components/mui/TextField'
import { salvarSenha } from '@/services/UsuarioService'
import { useUsuarioContext } from '@/contexts/UsuarioContext'
import type UsuarioSenhaDTO from '@/types/UsuarioSenha.dto'
import type { ValidationError } from '@/services/api'

const AlterarSenha = () => {
  // States
  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const [isConfirmPasswordShown, setIsConfirmPasswordShown] = useState(false)

  const [novaSenha, setNovaSenha] = useState('')
  const [confirmacaoSenha, setConfirmacaoSenha] = useState('')

  //const [erroSenha, setErroSenha] = useState(false)

  //contexto
  const { usuario } = useUsuarioContext()

  function handleSalvarSenha() {
    // Password requirements
    const requirements = [
      // Must be at least 8 characters
      novaSenha.length >= 6,

      // Must contain at least 1 uppercase letter
      /[A-Z]/.test(novaSenha),

      // Must contain at least 1 lowercase letter
      /[a-z]/.test(novaSenha),

      // Must contain at least 1 number
      /\d/.test(novaSenha)
    ]

    // If all requirements are met, password is valid
    const isValid = requirements.every(Boolean)

    if (!isValid) {
      toast.error(`Senha inválida, veja a regra de formação da senha`)

      return
    }

    if (novaSenha != confirmacaoSenha) {
      toast.error(`Senha inválida, a confirmação de senha não é igual a senha`)

      return
    }

    if (usuario?.token) {
      const usuarioSenha = {
        token: usuario?.token,
        novaSenha,
        confirmacaoSenha
      } as UsuarioSenhaDTO

      salvarSenha(usuario?.token, usuarioSenha)
        .then(() => {
          //console.log(respUsuario)
          setNovaSenha('')
          setConfirmacaoSenha('')
          setIsPasswordShown(false)
          setIsConfirmPasswordShown(false)
          toast.success('Dados salvo com sucesso!')
        })
        .catch(err => {
          if (axios.isAxiosError<ValidationError, Record<string, unknown>>(err)) {
            console.log(err.status)
            console.error(err.response)
            toast.error(`Erro, ${err.status}`)
          } else {
            console.error(err)
            toast.error(`Erro`, err)
          }
        })
        .finally(() => {})
    }
  }

  return (
    <Card>
      <CardHeader title='Change Password' />
      <CardContent className='flex flex-col gap-4'>
        <Alert icon={false} severity='warning' onClose={() => {}}>
          <AlertTitle>Requisitos para a senha</AlertTitle>
          Mínimo de 6 caracteres, ao menos uma letra maiúscula e ao menos um número
        </Alert>
        <form>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={6}>
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
            <Grid item xs={12} sm={6}>
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

            <Grid item xs={12} className='flex gap-4' onClick={() => handleSalvarSenha()}>
              <Button variant='contained'>Alterar senha</Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  )
}

export default AlterarSenha
