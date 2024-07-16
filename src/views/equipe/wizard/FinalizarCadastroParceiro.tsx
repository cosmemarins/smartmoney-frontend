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

import { CircularProgress, FormControlLabel, Radio, RadioGroup } from '@mui/material'

import CustomTextField from '@core/components/mui/TextField'
import { salvarSenha } from '@/services/UsuarioService'
import ParcveiroService from '@/services/ParceiroService'
import { useParceiroContext } from '@/contexts/ParceiroContext'
import type UsuarioSenhaDTO from '@/types/UsuarioSenha.dto'
import DirectionalIcon from '@/components/DirectionalIcon'
import { trataErro } from '@/utils/erro'
import { geraSenha } from '@/utils/string'

type Props = {
  activeStep: number
  handleNext: () => void
  handlePrev: () => void
  steps: { title: string; subtitle: string }[]
}

const FinalizarCadastroParceiro = ({ activeStep, handlePrev, steps }: Props) => {
  // States
  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const [isConfirmPasswordShown, setIsConfirmPasswordShown] = useState(false)
  const [sending, setSending] = useState<boolean>(false)

  const [novaSenha, setNovaSenha] = useState('')
  const [confirmacaoSenha, setConfirmacaoSenha] = useState('')
  const [senhaAutomatica, setSenhaAutomatica] = useState(true)

  //const [erroSenha, setErroSenha] = useState(false)

  //contexto
  const { parceiro } = useParceiroContext()

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

    if (!isValid && !senhaAutomatica) {
      toast.error(`Senha inválida, a senha precisa conter letras e números e ter ao menos 6 caracteres`)

      return
    }

    if (novaSenha != confirmacaoSenha && !senhaAutomatica) {
      toast.error(`Senha inválida, a confirmação de senha não é igual a senha`)

      return
    }

    const tokenParceiro = parceiro?.token
    const tokenSocio = parceiro?.socioResponsavel?.token

    if (tokenParceiro && tokenSocio) {
      setSending(true)

      const senhaRandom = geraSenha()

      const usuarioSenha = {
        token: tokenSocio,
        novaSenha: senhaAutomatica ? senhaRandom : novaSenha,
        confirmacaoSenha: senhaAutomatica ? senhaRandom : confirmacaoSenha,
        senhaAutomatica
      } as UsuarioSenhaDTO

      salvarSenha(tokenSocio, usuarioSenha)
        .then(() => {
          toast.success('Dados salvo com sucesso!')
          ParcveiroService.finalizarNovo(tokenParceiro, usuarioSenha)
            .then(() => {
              toast.success('Cadastro finalizado e email enviado!')
              window.location.reload()
            })
            .catch(err => {
              toast.error(trataErro(err))
            })
        })
        .catch(err => {
          toast.error(trataErro(err))
        })
        .finally(() => {
          setSending(false)
        })
    }
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Criar senha de acesso ao sistema' />
          <CardContent className='flex flex-col gap-4'>
            <Alert icon={false} severity='warning' onClose={() => {}}>
              <AlertTitle>Requisitos para a senha</AlertTitle>
              Mínimo de 6 caracteres, ao menos uma letra e ao menos um número
            </Alert>
            <form>
              <Grid container spacing={4}>
                <Grid item xs={12} sm={12}>
                  <RadioGroup
                    row
                    name='radio-buttons-group'
                    value={senhaAutomatica ? '1' : '0'}
                    onChange={e => setSenhaAutomatica(e.target.value === '0' ? false : true)}
                  >
                    <FormControlLabel
                      value='1'
                      control={<Radio />}
                      label='Quero que o sistema gere uma senha automática'
                    />
                    <FormControlLabel value='0' control={<Radio />} label='Não, prefiro digitar uma senha agora' />
                  </RadioGroup>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <CustomTextField
                    fullWidth
                    label='Senha'
                    type={isPasswordShown ? 'text' : 'password'}
                    onChange={e => setNovaSenha(e.target.value)}
                    disabled={senhaAutomatica}
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
                    disabled={senhaAutomatica}
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
              </Grid>
            </form>
          </CardContent>
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
            onClick={handleSalvarSenha}
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
            {activeStep === steps.length - 1 ? 'Finalizar cadastro do parceiro' : 'Próximo'}
          </Button>
        </div>
      </Grid>
    </Grid>
  )
}

export default FinalizarCadastroParceiro
