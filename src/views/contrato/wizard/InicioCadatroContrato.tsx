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
import { getClienteByCpfCnpj } from '@/services/ClienteService'
import ContratoService from '@/services/ContratoService'

import { useClienteContext } from '@/contexts/ClienteContext'
import { useContratoContext } from '@/contexts/ContratoContext'
import { trataErro } from '@/utils/erro'
import isCPF from '@/utils/cpf'
import isCNPJ from '@/utils/cnpj'
import { StatusClienteEnum } from '@/utils/enums/StatusClienteEnum'
import { contratoInit } from '@/types/ContratoType'

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

const InicioCadatroContrato = ({ handleNext }: Props) => {
  // States
  const [errorState, setErrorState] = useState<ErrorType | null>(null)
  const [sending, setSending] = useState<boolean>(false)

  const { cliente, setClienteContext } = useClienteContext()
  const { setContratoContext } = useContratoContext()

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({
    resolver: valibotResolver(schema),
    defaultValues: {
      cpfCnpj: cliente?.cpfCnpj
    }
  })

  const onSubmit: SubmitHandler<FormData> = async (data: FormData) => {
    if (data.cpfCnpj) {
      if (isCPF(data.cpfCnpj) || isCNPJ(data.cpfCnpj)) {
        setSending(true)

        getClienteByCpfCnpj(data.cpfCnpj)
          .then(respCliente => {
            if (respCliente) {
              setClienteContext(respCliente)
              setContratoContext({
                ...contratoInit,
                data: new Date(),
                cliente: { id: respCliente?.id, token: respCliente?.token }
              })

              if (respCliente && respCliente.token) {
                ContratoService.getUltimoContratoNovo(respCliente.token)
                  .then(respContrato => {
                    console.log('respContrato', respContrato)
                    if (respContrato) setContratoContext(respContrato)
                  })
                  .catch(err => {
                    const msgErro = trataErro(err)

                    toast.error(msgErro)
                  })
                  .finally(() => {
                    handleNext()
                    setSending(false)
                  })
              }
            } else {
              setClienteContext({ cpfCnpj: data.cpfCnpj, status: StatusClienteEnum.NOVO })
              setContratoContext({
                ...contratoInit,
                data: new Date()
              })
              handleNext()
            }
          })
          .catch(err => {
            const msgErro = trataErro(err)

            toast.error(msgErro)
          })
          .finally(() => {})
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
            <CardHeader title='Inicio do Cadastro de Contrato' />
            <CardContent className='flex flex-col gap-4'>
              <Typography color='text.primary' className='font-medium'>
                Antes de cadastrar um contrato precisamos dos dados do cliente, comece informando o CPF ou CNPJ do
                cliente:
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
                        value={cpfCnpjMask(cliente?.cpfCnpj)}
                        onChange={e => {
                          field.onChange(e.target.value)
                          setClienteContext({ ...cliente, cpfCnpj: e.target.value })
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

export default InicioCadatroContrato
