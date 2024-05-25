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
import type { ClienteType } from '@/types/ClienteType'
import type { cepType } from '@/utils/cep'
import { estadosOptions } from '@/utils/estados'
import { cpfCnpjMask, telefoleMask } from '@/utils/string'
import type { erroType } from '@/types/utilTypes'
import { salvarCliente } from '@/services/ClienteService'

import { useClienteContext } from '@/contexts/ClienteContext'

locale('pt-br')

//const initialData: IdentificacaoType = { cep: '' }

// const status = ['Status', 'Active', 'Inactive', 'Suspended']

const Identificacao = () => {
  // States
  const [erro, setErro] = useState<erroType>()
  const [reload, setReload] = useState(false)
  const [clienteEdit, setClienteEdit] = useState<ClienteType>({})

  const { cliente, setClienteContext } = useClienteContext()

  const { replace } = useRouter()

  const handleReset = () => {
    if (cliente) setClienteEdit(cliente)
  }

  const getCep = (value: string): cepType | undefined => {
    try {
      const cep = value.replace(/\D/g, '')

      if (cep.length < 8) {
        return {}
      } else {
        fetch(`http://viacep.com.br/ws/${cep}/json/`, { mode: 'cors' })
          .then(res => res.json())
          .then(data => {
            if (data.hasOwnProperty('erro')) {
              throw 'CEP não existe'
            } else {
              setClienteEdit({
                ...clienteEdit,
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
    if (cliente) setClienteEdit(cliente)
  }, [cliente])

  const onChangeNome = (value: string) => {
    setClienteEdit({ ...clienteEdit, nome: value })
    setClienteContext({ ...cliente, nome: value })

    // updateClienteHeader(value)
  }

  const handleCepChange = (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setClienteEdit({ ...clienteEdit, cep: e.target.value })
    getCep(e.target.value)
  }

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setReload(true)
    setErro(undefined)

    salvarCliente(clienteEdit)
      .then(respCliente => {
        //console.log(respCliente)
        setClienteContext(respCliente)
        toast.success('Usuário salvo com sucesso!')

        //if (clienteEdit.token === '') window.location.href = `/cliente/${respCliente.token}`
        if (clienteEdit.token === '') replace(`/cliente/${respCliente.token}`)
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
                value={clienteEdit?.nome || ''}
                onChange={e => onChangeNome(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                type='email'
                fullWidth
                label='Email'
                value={clienteEdit?.email || ''}
                onChange={e => setClienteEdit({ ...clienteEdit, email: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label='Identidade'
                value={clienteEdit?.identidade || ''}
                onChange={e => setClienteEdit({ ...clienteEdit, identidade: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label='CPF/CNPJ'
                value={cpfCnpjMask(clienteEdit?.cpfCnpj)}
                onChange={e => setClienteEdit({ ...clienteEdit, cpfCnpj: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                type='tel'
                fullWidth
                label='celular'
                placeholder='(00) 00000-0000'
                value={telefoleMask(clienteEdit?.telefone)}
                onChange={e => setClienteEdit({ ...clienteEdit, telefone: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                type='date'
                fullWidth
                label='Data de Nascimento'
                value={clienteEdit?.dataNascimento ? moment(clienteEdit?.dataNascimento).format('YYYY-MM-DD') : ''}
                onChange={e => setClienteEdit({ ...clienteEdit, dataNascimento: e.target.value })}
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
                value={clienteEdit?.cep || ''}
                onChange={e => handleCepChange(e)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label='Número'
                value={clienteEdit?.numero || ''}
                onChange={e => setClienteEdit({ ...clienteEdit, numero: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label='Complemento'
                value={clienteEdit?.complemento || ''}
                onChange={e => setClienteEdit({ ...clienteEdit, complemento: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label='Logradouro'
                value={clienteEdit?.endereco || ''}
                onChange={e => setClienteEdit({ ...clienteEdit, endereco: e.target.value })}
                disabled
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label='Bairro'
                value={clienteEdit?.bairro || ''}
                onChange={e => setClienteEdit({ ...clienteEdit, bairro: e.target.value })}
                disabled
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label='Cidade'
                value={clienteEdit?.cidade || ''}
                onChange={e => setClienteEdit({ ...clienteEdit, cidade: e.target.value })}
                disabled
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                select
                fullWidth
                label='Estado'
                value={clienteEdit?.estado ? clienteEdit?.estado : ''}
                onChange={e => setClienteEdit({ ...clienteEdit, estado: e.target.value as string })}
                disabled
              >
                {estadosOptions.map((estado, index) => (
                  <MenuItem key={index} value={estado.value} selected={clienteEdit?.estado === estado.value}>
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
