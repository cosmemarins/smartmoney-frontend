'use client'

// React Imports
import { useEffect, useState } from 'react'

// Type Imports
import { useSession } from 'next-auth/react'

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
  Slider,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  FormHelperText
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
import { TaxasEnum } from '@/utils/enums/TaxasEnum'
import { valorBr, valorEmReal } from '@/utils/string'
import UsuarioService from '@/services/UsuarioService'

import { isMaster, isParceiroMaster } from '@/utils/utils'

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
  const { data: session } = useSession()
  const { cliente } = useClienteContext()
  const { contrato, setContratoContext } = useContratoContext()

  // States
  const [errorState, setErrorState] = useState<ErrorType | null>(null)
  const [sending, setSending] = useState<boolean>(false)

  const [maxTaxa, setMaxTaxa] = useState<number>(3)
  const [faixaTaxa, setFaixaTaxa] = useState([0])
  const [faixaValor, setFaixaValor] = useState([0])

  const schema = v.object({
    valor: pipe(
      v.number('É preciso inforar um valor.'),
      v.minValue((Number(faixaValor[0]) - 1) | 1, `Informe um valor maior que ${Number(faixaValor[0])}`)
    ),
    taxaCliente: pipe(
      v.number(`A taxa precisa ser informada e tem que ser um número.`),
      v.minValue(
        // eslint-disable-next-line lines-around-comment
        //só valida se o valor não for tabelado
        isMaster(session?.user) || isParceiroMaster(session?.user) ? -1 : 0,
        `A taxa precisa ser maior que 0.`
      ),
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

  const calculaTaxa = (valor: number) => {
    let taxaCliente: number = 0

    for (let i = faixaValor.length - 1; i >= 0; i--) {
      if (valor >= faixaValor[i]) {
        taxaCliente = Number(faixaTaxa[i])
        break
      }
    }

    return taxaCliente
  }

  /* nao usa mais essa porque o parceiro já definiu a faixa de percentual */
  const calculaTaxaMaxima = (valor: number) => {
    let taxaMax: number = TaxasEnum.MAXIMO_CLIENTE

    console.log('calculaTaxaMaxima.taxaMax', taxaMax)

    if (valor < 100000) {
      taxaMax = 2
    } else if (valor < 250000) {
      taxaMax = 2.25
    } else if (valor < 500000) {
      taxaMax = 2.5
    } else if (valor < 1000000) {
      taxaMax = 2.75
    } else {
      taxaMax = 3
    }

    setMaxTaxa(taxaMax)

    return taxaMax
  }

  const onChangeValor = (value: string) => {
    const valorStr = value.replace(/[^\d]+/g, '')
    const valor = parseFloat(valorStr) / 100

    //calculaTaxaMaxima(valor)
    let taxaCliente = 0

    if (faixaTaxa.length > 0) {
      taxaCliente = calculaTaxa(valor)
    } else {
      taxaCliente = calculaTaxaMaxima(valor)
    }

    console.log('taxa cliente ao mudar o valor', taxaCliente)

    //console.log(schema)
    setContratoContext({
      ...contrato,
      valor,
      taxaCliente
    })

    return valor
  }

  const onSubmit: SubmitHandler<FormData> = async (data: FormData) => {
    //console.log('cliente Contexto: ', cliente)

    //if (contrato && contrato.cliente && contrato.cliente.token && data.valor && data.taxaCliente) {
    if (contrato && contrato.cliente && contrato.cliente.token && data.valor) {
      setSending(true)

      //console.log('contrato: ', contrato)

      //console.log('contrato', contrato)
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

  const distFaixas = (strFaixas: string | undefined) => {
    const faixasStrArray = strFaixas ? strFaixas.split('|') : ['0', '0']

    const taxas = faixasStrArray[0].split(';').map(e => Number(e))

    //console.log('taxas', taxas)
    setFaixaTaxa(taxas)

    const valores = faixasStrArray[1].split(';').map(e => Number(e))

    //console.log('valores', valores)
    setFaixaValor(valores)
  }

  useEffect(() => {
    //console.log('contrato', contrato)
    //console.log('cliente', cliente)

    if (cliente?.gestor?.faixasDistribuicao) {
      distFaixas(cliente?.gestor?.faixasDistribuicao)
    } else {
      if (session?.user) {
        //recuperando as faixas de distribuicao se ainda não veio
        UsuarioService.get(session.user.token).then(respUsuario => {
          //console.log(respUsuario)
          const faixasDistribuicao = respUsuario.faixasDistribuicao || respUsuario.gestor?.faixasDistribuicao

          distFaixas(faixasDistribuicao)
        })
      } else {
        toast.error('Parece que você não está logado!')
      }
    }

    if (contrato && (!contrato?.cliente || !contrato?.cliente?.token)) {
      //console.log('atualiza cliente contrato p nao veio')

      //é um contrato novo, tem que setar o cliente
      setContratoContext({
        ...contrato,
        cliente: { id: cliente?.id, token: cliente?.token }
      })
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    //console.log('useEffect contrato', contrato)

    if (contrato && contrato.cliente && contrato?.valor && contrato?.valor <= 0) {
      //console.log('contrato antes de calcular a taxa', contrato)
      if (!(faixaTaxa.length > 0)) calculaTaxaMaxima(contrato?.valor || 0)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contrato])

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card className='relative'>
              <CardHeader title={`Dados do Contrato: ${contrato?.token ? contrato?.token : 'NOVO'}`} />
              <CardContent className='flex flex-col gap-4'>
                <Grid container spacing={4}>
                  <Grid item xs={12} sm={6}>
                    <CustomTextField
                      type='date'
                      fullWidth
                      label='Data'
                      value={contrato?.data ? moment(contrato?.data).format('YYYY-MM-DD') : ''}
                      onChange={e => setContratoContext({ ...contrato, data: moment(e.target.value).toDate() })}
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
                      {(isMaster(session?.user) || isParceiroMaster(session?.user)) && (
                        <Controller
                          name='taxaCliente'
                          control={control}
                          rules={{ required: true }}
                          render={({ field }) => (
                            <Slider
                              {...field}
                              key={`slider-taxaCliente`}
                              marks={taxaContratoMarks}
                              min={0}
                              max={maxTaxa || 3}
                              step={0.01}
                              defaultValue={contrato?.taxaCliente || TaxasEnum.MAXIMO_CLIENTE}
                              value={contrato?.taxaCliente}
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
                      )}
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
              <CardActions>
                <Grid container spacing={0} direction='column' alignItems='center' justifyContent='center'>
                  <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 300 }} aria-label='rentabilidade'>
                      <TableHead>
                        <TableRow>
                          <TableCell align='center'>Rentabilidade</TableCell>
                          <TableCell align='center'>Valor Mínimo</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {faixaTaxa.map((taxa, index) => (
                          <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                            <TableCell align='center' component='th' scope='row'>
                              {valorBr.format(taxa)}%
                            </TableCell>
                            <TableCell align='center'>{valorEmReal.format(faixaValor[index])}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </CardActions>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <div className='flex items-center justify-between'>
              <Button
                variant='contained'
                color='primary'
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
