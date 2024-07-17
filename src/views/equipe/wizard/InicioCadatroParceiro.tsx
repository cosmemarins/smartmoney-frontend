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
import { pipe } from 'valibot'
import { valibotResolver } from '@hookform/resolvers/valibot'
import type { SubmitHandler } from 'react-hook-form'

import { toast } from 'react-toastify'

import CustomTextField from '@core/components/mui/TextField'
import { cpfCnpjMask } from '@/utils/string'

import { useParceiroContext } from '@/contexts/ParceiroContext'
import { trataErro } from '@/utils/erro'
import isCNPJ from '@/utils/cnpj'

import ParceiroService from '@/services/ParceiroService'
import { StatusParceiroEnum } from '@/utils/enums/StatusParceiroEnum'

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
  cnpj: pipe(
    v.string('É preciso digitar um CNPJ'),
    v.check(input => isCNPJ(input), 'Cnpj inválido, é preciso digitar um CNPJ válido.')
  )
})

const InicioCadatroParceiro = ({ handleNext }: Props) => {
  // States
  const [errorState, setErrorState] = useState<ErrorType | null>(null)
  const [sending, setSending] = useState<boolean>(false)

  const { parceiro, setParceiroContext } = useParceiroContext()

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({
    resolver: valibotResolver(schema),
    defaultValues: {
      cnpj: parceiro?.cnpj
    }
  })

  const onSubmit: SubmitHandler<FormData> = async (data: FormData) => {
    if (data.cnpj) {
      if (isCNPJ(data.cnpj)) {
        setSending(true)

        ParceiroService.getByCnpj(data.cnpj)
          .then(respParceiro => {
            if (respParceiro) {
              setParceiroContext(respParceiro)
            } else {
              setParceiroContext({ cnpj: data.cnpj, status: StatusParceiroEnum.NOVO })
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
        toast.error('CNPJ inválido!')
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
                Para cadastrar um parceiro comece informando o CNPJ do parceiro:
              </Typography>
              <Grid container spacing={6}>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name='cnpj'
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <CustomTextField
                        {...field}
                        fullWidth
                        label='CNPJ'
                        disabled={sending}
                        value={cpfCnpjMask(parceiro?.cnpj)}
                        onChange={e => {
                          field.onChange(e.target.value)
                          setParceiroContext({ ...parceiro, cnpj: e.target.value })
                          errorState !== null && setErrorState(null)
                        }}
                        {...((errors.cnpj || errorState !== null) && {
                          error: true,
                          helperText: errors?.cnpj?.message || errorState?.message
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

export default InicioCadatroParceiro
