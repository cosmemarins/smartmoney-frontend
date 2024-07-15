// React Imports
import { useEffect, useState, type ChangeEvent } from 'react'

import { useRouter } from 'next/navigation'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import Divider from '@mui/material/Divider'

import moment, { locale } from 'moment'
import 'moment/locale/pt-br'

// Component Imports
import { Backdrop, Button, CardActions, CircularProgress, MenuItem } from '@mui/material'
import { toast } from 'react-toastify'

import CustomTextField from '@core/components/mui/TextField'
import type { UsuarioType } from '@/types/UsuarioType'
import type { cepType } from '@/utils/cep'
import { estadosOptions } from '@/utils/estados'
import { cpfCnpjMask, telefoleMask } from '@/utils/string'
import type { erroType } from '@/types/utilTypes'
import { salvarUsuario } from '@/services/UsuarioService'

import { useUsuarioContext } from '@/contexts/UsuarioContext'

locale('pt-br')

//const initialData: IdentificacaoType = { cep: '' }

// const status = ['Status', 'Active', 'Inactive', 'Suspended']

const Identificacao = () => {
  // States
  const [erro, setErro] = useState<erroType>()
  const [reload, setReload] = useState(false)
  const [usuarioEdit, setUsuarioEdit] = useState<UsuarioType>()

  const { usuario, setUsuarioContext } = useUsuarioContext()

  const { replace } = useRouter()

  const handleReset = () => {
    setUsuarioEdit(usuario)
  }

  const getCep = (value: string): cepType | undefined => {
    try {
      const cep = value.replace(/\D/g, '')

      if (cep.length < 8) {
        return {}
      } else {
        fetch(`https://viacep.com.br/ws/${cep}/json/`, { mode: 'cors' })
          .then(res => res.json())
          .then(data => {
            if (data.hasOwnProperty('erro')) {
              throw 'CEP não existe'
            } else {
              setUsuarioEdit({
                ...usuarioEdit,
                cep: data?.cep,
                endereco: data?.logradouro,
                bairro: data?.bairro,
                cidade: data?.localidade,
                estado: data?.uf
              })
            }
          })
          .catch(err => console.log(err))
      }
    } catch (err) {
      // Throw error
      throw err
    }
  }

  useEffect(() => {
    setUsuarioEdit(usuario)
  }, [usuario])

  const onChangeNome = (value: string) => {
    setUsuarioEdit({ ...usuarioEdit, nome: value })
    setUsuarioContext({ ...usuario, nome: value })

    // updateusuarioHeader(value)
  }

  const handleCepChange = (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setUsuarioEdit({ ...usuarioEdit, cep: e.target.value })
    getCep(e.target.value)
  }

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setReload(true)
    setErro(undefined)

    if (usuarioEdit) {
      salvarUsuario(usuarioEdit)
        .then(respUsuario => {
          //console.log(respUsuario)
          setUsuarioContext(respUsuario)
          toast.success('Usuário salvo com sucesso!')

          //if (usuarioEdit.token === '') window.location.href = `/usuario/${respUsuario.token}`
          if (usuarioEdit.token === '') replace(`/usuario/${respUsuario.token}`)
        })
        .catch(err => {
          console.log('ERRO RESP', err)
          const erro = err?.response.data

          const msgErro =
            err?.response.status === 401
              ? 'Não autorizado, é preciso logar novamente'
              : Array.isArray(erro.message)
                ? erro.message.join(', ')
                : erro.message

          setErro({ msg: msgErro })
          toast.error(`Erro, ${msgErro}`)
        })
        .finally(() => {
          setReload(false)
        })
    }
  }

  return (
    <Card className='relative'>
      <form onSubmit={e => handleFormSubmit(e)}>
        <CardHeader title='Dados Pessoais' />
        <CardContent className='flex flex-col gap-4'>
          {erro && (
            <Alert icon={false} severity='error' onClose={() => {}}>
              <AlertTitle>Erro</AlertTitle>
              {erro?.msg}
            </Alert>
          )}
          <Grid container spacing={5}>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label='Nome'
                value={usuarioEdit?.nome || ''}
                onChange={e => onChangeNome(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                type='email'
                fullWidth
                label='Email'
                value={usuarioEdit?.email || ''}
                onChange={e => setUsuarioEdit({ ...usuarioEdit, email: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label='Identidade'
                value={usuarioEdit?.identidade || ''}
                onChange={e => setUsuarioEdit({ ...usuarioEdit, identidade: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label='CPF/CNPJ'
                value={cpfCnpjMask(usuarioEdit?.cpfCnpj)}
                onChange={e => setUsuarioEdit({ ...usuarioEdit, cpfCnpj: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                type='tel'
                fullWidth
                label='celular'
                placeholder='(00) 00000-0000'
                value={telefoleMask(usuarioEdit?.telefone)}
                onChange={e => setUsuarioEdit({ ...usuarioEdit, telefone: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                type='date'
                fullWidth
                label='Data de Nascimento'
                value={usuarioEdit?.dataNascimento ? moment(usuarioEdit?.dataNascimento).format('YYYY-MM-DD') : ''}
                onChange={e => setUsuarioEdit({ ...usuarioEdit, dataNascimento: e.target.value })}
              />
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        <CardHeader title='Endereço' />
        <CardContent className='flex flex-col gap-4'>
          <Grid container spacing={5}>
            <Grid item xs={12}>
              <CustomTextField
                fullWidth
                label='CEP'
                value={usuarioEdit?.cep || ''}
                onChange={e => handleCepChange(e)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label='Número'
                value={usuarioEdit?.numero || ''}
                onChange={e => setUsuarioEdit({ ...usuarioEdit, numero: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label='Complemento'
                value={usuarioEdit?.complemento || ''}
                onChange={e => setUsuarioEdit({ ...usuarioEdit, complemento: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label='Logradouro'
                value={usuarioEdit?.endereco || ''}
                onChange={e => setUsuarioEdit({ ...usuarioEdit, endereco: e.target.value })}
                disabled
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label='Bairro'
                value={usuarioEdit?.bairro || ''}
                onChange={e => setUsuarioEdit({ ...usuarioEdit, bairro: e.target.value })}
                disabled
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label='Cidade'
                value={usuarioEdit?.cidade || ''}
                onChange={e => setUsuarioEdit({ ...usuarioEdit, cidade: e.target.value })}
                disabled
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                select
                fullWidth
                label='Estado'
                value={usuarioEdit?.estado ? usuarioEdit?.estado : ''}
                onChange={e => setUsuarioEdit({ ...usuarioEdit, estado: e.target.value as string })}
                disabled
              >
                {estadosOptions.map((estado, index) => (
                  <MenuItem key={index} value={estado.value} selected={usuarioEdit?.estado === estado.value}>
                    {estado.label}
                  </MenuItem>
                ))}
              </CustomTextField>
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        <CardActions>
          <Button type='submit' variant='contained' className='mie-2'>
            {reload ? (
              <>
                <i className='tabler-refresh text-xl' /> aguarde...
              </>
            ) : (
              'Salvar'
            )}
          </Button>
          <Button
            type='reset'
            variant='tonal'
            color='secondary'
            onClick={() => {
              handleReset()
            }}
          >
            Reset
          </Button>
        </CardActions>
      </form>
      <Backdrop open={reload} className='absolute text-white z-[cal(var(--mui-zIndex-mobileStepper)-1)]'>
        <CircularProgress color='inherit' />
      </Backdrop>
    </Card>
  )
}

export default Identificacao
