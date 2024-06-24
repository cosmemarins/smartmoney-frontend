// React Imports
import { useState, type ChangeEvent } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import { Button, CardActions, CircularProgress, MenuItem } from '@mui/material'

import { Controller, useForm } from 'react-hook-form'
import * as v from 'valibot'
import { valibotResolver } from '@hookform/resolvers/valibot'
import type { SubmitHandler } from 'react-hook-form'

import { toast } from 'react-toastify'

import { estadosOptions } from '@/utils/estados'
import type { cepType } from '@/utils/cep'
import CustomTextField from '@core/components/mui/TextField'
import { salvarUsuario } from '@/services/UsuarioService'

import { useUsuarioContext } from '@/contexts/UsuarioContext'
import DirectionalIcon from '@/components/DirectionalIcon'
import { trataErro } from '@/utils/erro'

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
  cep: v.string('É preciso digitar um CEP válido')
})

const EnderecoUsuario = ({ activeStep, handleNext, handlePrev, steps }: Props) => {
  // States
  const [errorState, setErrorState] = useState<ErrorType | null>(null)
  const [sending, setSending] = useState<boolean>(false)

  //hooks
  const { usuario, setUsuarioContext } = useUsuarioContext()

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({
    resolver: valibotResolver(schema),
    defaultValues: {
      cep: usuario?.cep
    }
  })

  const onSubmit: SubmitHandler<FormData> = async (data: FormData) => {
    if (usuario && data.cep) {
      setSending(true)
      salvarUsuario(usuario)
        .then(respUsuario => {
          setUsuarioContext(respUsuario)
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
              setUsuarioContext({
                ...usuario,
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

  const handleCepChange = (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setUsuarioContext({ ...usuario, cep: e.target.value })
    getCep(e.target.value)
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card className='relative'>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardHeader title='Endereço' />
            <CardContent className='flex flex-col gap-4'>
              <Grid container spacing={5}>
                <Grid item xs={12}>
                  <Controller
                    name='cep'
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <CustomTextField
                        {...field}
                        autoFocus
                        fullWidth
                        label='CEP'
                        placeholder='CEP'
                        value={usuario?.cep || ''}
                        onChange={e => {
                          field.onChange(e.target.value)
                          handleCepChange(e)
                          errorState !== null && setErrorState(null)
                        }}
                        {...((errors.cep || errorState !== null) && {
                          error: true,
                          helperText: errors?.cep?.message || errorState?.message
                        })}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <CustomTextField
                    fullWidth
                    label='Número'
                    value={usuario?.numero || ''}
                    onChange={e => setUsuarioContext({ ...usuario, numero: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <CustomTextField
                    fullWidth
                    label='Complemento'
                    value={usuario?.complemento || ''}
                    onChange={e => setUsuarioContext({ ...usuario, complemento: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <CustomTextField
                    fullWidth
                    label='Logradouro'
                    value={usuario?.endereco || ''}
                    onChange={e => setUsuarioContext({ ...usuario, endereco: e.target.value })}
                    disabled
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <CustomTextField
                    fullWidth
                    label='Bairro'
                    value={usuario?.bairro || ''}
                    onChange={e => setUsuarioContext({ ...usuario, bairro: e.target.value })}
                    disabled
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <CustomTextField
                    fullWidth
                    label='Cidade'
                    value={usuario?.cidade || ''}
                    onChange={e => setUsuarioContext({ ...usuario, cidade: e.target.value })}
                    disabled
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <CustomTextField
                    select
                    fullWidth
                    label='Estado'
                    value={usuario?.estado ? usuario?.estado : ''}
                    onChange={e => setUsuarioContext({ ...usuario, estado: e.target.value as string })}
                    disabled
                  >
                    {estadosOptions.map((estado, index) => (
                      <MenuItem key={index} value={estado.value} selected={usuario?.estado === estado.value}>
                        {estado.label}
                      </MenuItem>
                    ))}
                  </CustomTextField>
                </Grid>
              </Grid>
            </CardContent>
            <Divider />
            <CardActions></CardActions>
          </form>
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
            {activeStep === steps.length - 1 ? 'Salvar Parceiro' : 'Próximo'}
          </Button>
        </div>
      </Grid>
    </Grid>
  )
}

export default EnderecoUsuario
