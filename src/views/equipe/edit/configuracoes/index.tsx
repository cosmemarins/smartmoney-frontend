// React Imports
import { useEffect, useState } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import { Button, CardActions, CircularProgress } from '@mui/material'
import { toast } from 'react-toastify'

import { Controller, useForm } from 'react-hook-form'
import * as v from 'valibot'
import { valibotResolver } from '@hookform/resolvers/valibot'
import type { SubmitHandler } from 'react-hook-form'

import CustomTextField from '@core/components/mui/TextField'

import { salvarConfiguracoesUsuario } from '@/services/UsuarioService'

import { useUsuarioContext } from '@/contexts/UsuarioContext'
import { trataErro } from '@/utils/erro'
import type { ConfiguracoesUsuarioType } from '@/types/ConfiguracoesUsuarioType'

type ErrorType = {
  message: string[]
}

type FormData = v.InferInput<typeof schema>

const schema = v.object({
  taxaDistribuicao: v.pipe(
    v.number('Informe a taxa de distribuição'),
    v.minValue(0.01, 'Informe a taxa de distribuição.')
  )
})

const ConfiguracoesUsuario = () => {
  // States
  const [configuracoesUsuario, setConfiguracoesUsuario] = useState<ConfiguracoesUsuarioType>()
  const [sending, setSending] = useState<boolean>(false)
  const [errorState, setErrorState] = useState<ErrorType | null>(null)

  const { usuario, setUsuarioContext } = useUsuarioContext()

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({
    resolver: valibotResolver(schema),
    defaultValues: {
      taxaDistribuicao: usuario?.taxaDistribuicao
    }
  })

  const onSubmit: SubmitHandler<FormData> = async (data: FormData) => {
    console.log('data', data)

    if (usuario && usuario.token && configuracoesUsuario) {
      setSending(true)
      salvarConfiguracoesUsuario(configuracoesUsuario)
        .then(respConfig => {
          setUsuarioContext({
            ...usuario,
            taxaDistribuicao: respConfig.taxaDistribuicao
          })
          toast.success('Dados salvo com sucesso!')
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

  useEffect(() => {
    if (usuario && usuario.token) {
      setConfiguracoesUsuario({
        id: usuario.id,
        token: usuario.token,
        taxaDistribuicao: usuario.taxaDistribuicao
      })
    }
  }, [usuario])

  return (
    <Card className='relative'>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardHeader title='Taxas' />
        <CardContent className='flex flex-col gap-4'>
          <Grid container spacing={5}>
            <Grid item xs={12} sm={3}>
              <Controller
                name='taxaDistribuicao'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='Taxa de distribuição'
                    type='number'
                    value={configuracoesUsuario?.taxaDistribuicao || 0}
                    onChange={e => {
                      field.onChange(parseFloat(e.target.value))
                      setConfiguracoesUsuario({
                        ...configuracoesUsuario,
                        taxaDistribuicao: parseFloat(e.target.value) <= 0 ? 0 : parseFloat(e.target.value)
                      })
                      errorState !== null && setErrorState(null)
                    }}
                    {...((errors.taxaDistribuicao || errorState !== null) && {
                      error: true,
                      helperText: errors?.taxaDistribuicao?.message || errorState?.message
                    })}
                  />
                )}
              />
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        <CardActions>
          <Button type='submit' variant='contained' className='mie-2'>
            {sending ? (
              <>
                aguarde... <CircularProgress size={20} color='inherit' sx={{ marginLeft: '10px' }} />
              </>
            ) : (
              'Salvar'
            )}
          </Button>
        </CardActions>
      </form>
    </Card>
  )
}

export default ConfiguracoesUsuario
