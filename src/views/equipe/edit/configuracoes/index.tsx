// React Imports
import { useEffect, useState } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import {
  Button,
  CardActions,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Radio,
  RadioGroup,
  Slider,
  Typography
} from '@mui/material'
import { toast } from 'react-toastify'

import { Controller, useForm } from 'react-hook-form'
import * as v from 'valibot'
import { pipe } from 'valibot'
import { valibotResolver } from '@hookform/resolvers/valibot'
import type { SubmitHandler } from 'react-hook-form'

import { salvarConfiguracoesUsuario } from '@/services/UsuarioService'

import { useUsuarioContext } from '@/contexts/UsuarioContext'
import { trataErro } from '@/utils/erro'
import type { ConfiguracoesUsuarioType } from '@/types/ConfiguracoesUsuarioType'
import { taxaContratoMarks } from '@/types/ContratoType'

type FormData = v.InferInput<typeof schema>

const schema = v.object({
  taxaDistribuicao: pipe(
    v.number('Informe a taxa de distribuição'),
    v.minValue(0.01, 'Informe a taxa de distribuição.')
  )
})

const ConfiguracoesUsuario = () => {
  // States
  const [configuracoesUsuario, setConfiguracoesUsuario] = useState<ConfiguracoesUsuarioType>()
  const [sending, setSending] = useState<boolean>(false)

  const { usuario, setUsuarioContext } = useUsuarioContext()

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({
    resolver: valibotResolver(schema),
    defaultValues: {
      taxaDistribuicao: usuario?.parceiro?.taxaDistribuicao
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
            parceiro: {
              ...usuario.parceiro,
              taxaDistribuicao: respConfig.taxaDistribuicao
            },
            podeCriarEquipe: respConfig.podeCriarEquipe
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
        taxaDistribuicao: usuario.parceiro?.taxaDistribuicao,
        podeCriarEquipe: usuario.podeCriarEquipe
      })
    }
  }, [usuario])

  return (
    <Card className='relative'>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardHeader title='Configurações' />
        <CardContent className='flex flex-col gap-4'>
          <Grid container spacing={5}>
            <Grid item xs={12} sm={12}>
              <FormControl error={Boolean(errors.taxaDistribuicao)} fullWidth>
                <Typography className='font-medium'>
                  Taxa de distribuição: <b>{configuracoesUsuario?.taxaDistribuicao}%</b>
                </Typography>
                <Controller
                  name='taxaDistribuicao'
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Slider
                      {...field}
                      key={`slider-${configuracoesUsuario?.taxaDistribuicao}`} /* fixed issue */
                      marks={taxaContratoMarks}
                      min={0}
                      max={5}
                      step={0.1}
                      defaultValue={configuracoesUsuario?.taxaDistribuicao || 1}
                      valueLabelDisplay='auto'
                      aria-labelledby='continuous-slider'
                      onChangeCommitted={(e, sliderValue) => {
                        if (typeof sliderValue === 'number') {
                          field.onChange(sliderValue)
                          setConfiguracoesUsuario({
                            ...configuracoesUsuario,
                            taxaDistribuicao: sliderValue
                          })
                        }
                      }}
                    />
                  )}
                />
                {errors.taxaDistribuicao && <FormHelperText error>{errors.taxaDistribuicao?.message}</FormHelperText>}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <label>Este parceiro pode criar equipe?</label>
              <RadioGroup
                row
                name='radio-buttons-group'
                value={configuracoesUsuario?.podeCriarEquipe ? 1 : 0}
                onChange={e =>
                  setConfiguracoesUsuario({
                    ...configuracoesUsuario,
                    podeCriarEquipe: e.target.value == '1' ? true : false
                  })
                }
              >
                <FormControlLabel value='0' control={<Radio />} label='Não' />
                <FormControlLabel value='1' control={<Radio />} label='Sim' />
              </RadioGroup>
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
