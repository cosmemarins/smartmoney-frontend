'use client'

// React Imports
import { useEffect, useState } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid'
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CircularProgress,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  MenuItem,
  Radio,
  RadioGroup,
  Slider,
  Typography
} from '@mui/material'
import moment, { locale } from 'moment'
import 'moment/locale/pt-br'

import { toast } from 'react-toastify'

import { Controller, useForm } from 'react-hook-form'
import * as v from 'valibot'
import { pipe } from 'valibot'
import { valibotResolver } from '@hookform/resolvers/valibot'
import type { SubmitHandler } from 'react-hook-form'

import CustomTextField from '@core/components/mui/TextField'
import { prazoList, taxaContratoMarks } from '@/types/ContratoType'
import ContratoService from '@/services/ContratoService'

import { StatusContratoEnum } from '@/utils/enums/StatusContratoEnum'
import { useClienteContext } from '@/contexts/ClienteContext'
import { useContratoContext } from '@/contexts/ContratoContext'
import { trataErro } from '@/utils/erro'

import DirectionalIcon from '@/components/DirectionalIcon'

locale('pt-br')

type Props = {
  activeStep: number
  handleNext: () => void
  handlePrev: () => void
  steps: { title: string; subtitle: string }[]
}

type ErrorType = {
  message: string[]
}

const ContratoCliente = ({ activeStep, handleNext, handlePrev, steps }: Props) => {
  //contexto
  const { cliente } = useClienteContext()
  const { contrato, setContratoContext } = useContratoContext()

  // States
  const [errorState, setErrorState] = useState<ErrorType | null>(null)
  const [sending, setSending] = useState<boolean>(false)
  const [maxTaxa, setMaxTaxa] = useState<number>(3)

  const schema = v.object({
    valor: pipe(v.number('Informe um valor maior que 0'), v.minValue(1, 'É preciso inforar um valor.')),
    taxaCliente: pipe(
      v.number('A taxa precisa ser maior que 0'),
      v.minValue(0.01, 'A taxa precisa ser maior que 0.'),
      v.maxValue(maxTaxa || 3, `O valor da taxa não pode ser maior que ${maxTaxa}`)
    )
  })

  type FormData = v.InferInput<typeof schema>

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({
    resolver: valibotResolver(schema),
    defaultValues: {
      valor: contrato?.valor,
      taxaCliente: contrato?.taxaCliente
    }
  })

  const onChangeValor = (value: string) => {
    const valorStr = value.replace(/[^\d]+/g, '')
    const valor = parseFloat(valorStr) / 100

    return valor
  }

  const onSubmit: SubmitHandler<FormData> = async (data: FormData) => {
    console.log('contrato', contrato)
    console.log('data', data)

    if (contrato && contrato.cliente && contrato.cliente.token && data.valor && data.taxaCliente) {
      setSending(true)
      ContratoService.salvarContrato(contrato, false)
        .then(respContrato => {
          console.log('respContrato', respContrato)
          setContratoContext(respContrato)
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

  useEffect(() => {
    if (contrato && (!contrato?.cliente || !contrato?.cliente.token)) {
      //é um contrato novo, tem que setar o cliente
      setContratoContext({
        ...contrato,
        cliente: { id: cliente?.id, token: cliente?.token }
      })
      setMaxTaxa(
        cliente?.gestor?.parceiro?.taxaDistribuicao && cliente?.gestor?.parceiro?.taxaDistribuicao <= 3
          ? cliente?.gestor?.parceiro?.taxaDistribuicao
          : 3
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card className='relative'>
              <CardHeader title='Dados do Contrato' />
              <CardContent className='flex flex-col gap-4'>
                <Grid container spacing={4}>
                  <Grid item xs={12} sm={6}>
                    <CustomTextField
                      type='datetime-local'
                      fullWidth
                      label='Data'
                      value={contrato?.data ? moment(contrato?.data).format('YYYY-MM-DD HH:mm') : ''}
                      onChange={e => setContratoContext({ ...contrato, data: new Date(e.target.value) })}
                      disabled={!!contrato?.status && contrato?.status != StatusContratoEnum.NOVO}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <label>É debênture?</label>
                    <RadioGroup
                      row
                      name='radio-buttons-group'
                      value={contrato?.taxaCcb || 0}
                      onChange={e =>
                        setContratoContext({
                          ...contrato,
                          taxaCcb: parseFloat(e.target.value) <= 0 ? 0 : parseFloat(e.target.value)
                        })
                      }
                    >
                      <FormControlLabel value='0' control={<Radio />} label='Não' />
                      <FormControlLabel value='2' control={<Radio />} label='Sim' />
                    </RadioGroup>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name='valor'
                      control={control}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <CustomTextField
                          {...field}
                          autoFocus
                          fullWidth
                          label='Valor'
                          placeholder='valor'
                          value={
                            contrato?.valor
                              ? contrato?.valor.toLocaleString('pt-BR', {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2
                                })
                              : 0
                          }
                          disabled={!!contrato?.status && contrato?.status != StatusContratoEnum.NOVO}
                          onChange={e => {
                            field.onChange(onChangeValor(e.target.value))
                            setContratoContext({ ...contrato, valor: onChangeValor(e.target.value) })
                            errorState !== null && setErrorState(null)
                          }}
                          {...((errors.valor || errorState !== null) && {
                            error: true,
                            helperText: errors?.valor?.message || errorState?.message
                          })}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <CustomTextField
                      select
                      fullWidth
                      label='prazo'
                      value={contrato?.prazo}
                      onChange={e => setContratoContext({ ...contrato, prazo: parseInt(e.target.value) })}
                      disabled={!!contrato?.status && contrato?.status != StatusContratoEnum.NOVO}
                    >
                      {prazoList.map((prazo, index) => (
                        <MenuItem key={index} value={prazo} selected={contrato?.prazo === prazo}>
                          {prazo} meses
                        </MenuItem>
                      ))}
                    </CustomTextField>
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <FormControl error={Boolean(errors.taxaCliente)} fullWidth>
                      <Typography className='font-medium'>
                        Taxa do cliente: <b>{contrato?.taxaCliente}%</b>
                      </Typography>
                      <Controller
                        name='taxaCliente'
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => (
                          <Slider
                            {...field}
                            key={`slider-taxaCliente`} /* fixed issue */
                            marks={taxaContratoMarks}
                            min={0}
                            max={maxTaxa || 3}
                            step={0.05}
                            defaultValue={contrato?.taxaCliente || 3}
                            valueLabelDisplay='auto'
                            aria-labelledby='continuous-slider'
                            disabled={!!contrato?.status && contrato?.status != StatusContratoEnum.NOVO}
                            onChangeCommitted={(e, sliderValue) => {
                              if (typeof sliderValue === 'number') {
                                field.onChange(sliderValue)
                                setContratoContext({
                                  ...contrato,
                                  taxaCliente: sliderValue
                                })
                              }
                            }}
                          />
                        )}
                      />
                      {errors.taxaCliente && <FormHelperText error>{errors.taxaCliente?.message}</FormHelperText>}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <CustomTextField
                      fullWidth
                      label='Observação'
                      value={contrato?.observacao}
                      onChange={e => setContratoContext({ ...contrato, observacao: e.target.value })}
                      disabled={!!contrato?.status && contrato?.status != StatusContratoEnum.NOVO}
                    />
                  </Grid>
                </Grid>
              </CardContent>
              <Divider />
              <CardActions></CardActions>
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
                {activeStep === steps.length - 1 ? 'Enviar Contrato' : 'Próximo'}
              </Button>
            </div>
          </Grid>
        </Grid>
      </form>
    </>
  )
}

export default ContratoCliente
