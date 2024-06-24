'use client'

// React Imports
import { useEffect, useState } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import {
  Backdrop,
  Button,
  Chip,
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
import { valibotResolver } from '@hookform/resolvers/valibot'
import type { SubmitHandler } from 'react-hook-form'

import CustomTextField from '@core/components/mui/TextField'
import type { ContratoType } from '@/types/ContratoType'
import { contratoInit, prazoList, taxaContratoMarks } from '@/types/ContratoType'
import type { DialogConfirmaType, erroType } from '@/types/utilTypes'
import ContratoService from '@/services/ContratoService'

import { useClienteContext } from '@/contexts/ClienteContext'
import {
  StatusContratoEnum,
  getStatusContratoEnumColor,
  getStatusContratoEnumDesc
} from '@/utils/enums/StatusContratoEnum'
import DialogConfirma from '@/components/DialogConfirma'
import { useContratoContext } from '@/contexts/ContratoContext'
import { trataErro } from '@/utils/erro'
import { valorBr } from '@/utils/string'
import type { ClienteType } from '@/types/ClienteType'
import { getCliente } from '@/services/ClienteService'

locale('pt-br')

interface props {
  contrato?: ContratoType
  handleClose?: any
}

type ErrorType = {
  message: string[]
}

const ContratoEdit = ({ contrato, handleClose }: props) => {
  //contexto
  const { cliente } = useClienteContext()
  const { setContratoContext } = useContratoContext()

  // States
  const [erro, setErro] = useState<erroType>()
  const [errorState, setErrorState] = useState<ErrorType | null>(null)
  const [msgAlert, setMsgAlert] = useState<string>()
  const [trocaContrato, setTrocaContrato] = useState(false)
  const [dialogConfirma, setDialogConfirma] = useState<DialogConfirmaType>({ open: false })
  const [sending, setSending] = useState<boolean>(false)
  const [clienteContrato, setClienteContrato] = useState<ClienteType>()

  type FormData = v.InferInput<typeof schema>

  const schema = v.object({
    valor: v.pipe(v.number('Digite um valor'), v.minValue(1, 'É preciso inforar um valor.')),
    taxaCliente: v.pipe(
      v.number('A taxa precisa ser maior que 0'),
      v.minValue(0.01, 'A taxa precisa ser maior que 0.'),
      v.maxValue(
        clienteContrato?.gestor?.taxaDistribuicao || 1,
        `O valor da taxa não pode ser maior que ${clienteContrato?.gestor?.taxaDistribuicao}`
      )
    )
  })

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

  const [contratoEdit, setContratoEdit] = useState<ContratoType>(
    contrato ? contrato : { ...contratoInit, data: new Date(), cliente: { id: cliente?.id, token: cliente?.token } }
  )

  const onChangeValor = (value: string) => {
    const valorStr = value.replace(/[^\d]+/g, '')
    const valor = parseFloat(valorStr) / 100

    return valor
  }

  const handleOpenDlgConfirmaEnviar = () => {
    setDialogConfirma({
      open: true,
      titulo: 'Enviar Contrato',
      texto: 'Confirma enviar o contrato para o banco?',
      botaoConfirma: 'Confirmar Envio',
      handleConfirma: handleEnviarContrato
    })
  }

  const handleEnviarContrato = () => {
    setSending(true)
    setErro(undefined)

    if (contratoEdit.token) {
      ContratoService.enviarContrato(contratoEdit?.token)
        .then(respContrato => {
          //console.log('respContrato', respContrato)
          toast.success('Contrato enviado!')

          try {
            setContratoContext(respContrato)
          } catch (error) {}

          handleClose(true)
        })
        .catch(err => {
          const msg = trataErro(err)

          setErro({ msg })
        })
        .finally(() => {
          setSending(false)
        })
    }
  }

  const handleOpenDlgConfirmaExcluir = () => {
    setDialogConfirma({
      open: true,
      titulo: 'Excluir Contrato',
      texto: `Tem certeza que deseja excluir o contrato ${contratoEdit.token}?`,
      botaoConfirma: 'Confirmar Exclusão',
      handleConfirma: handleExcluirContrato
    })
  }

  const handleExcluirContrato = () => {
    setSending(true)
    setErro(undefined)

    if (contratoEdit.token) {
      ContratoService.excluirContrato(contratoEdit?.token)
        .then(() => {
          //console.log('respContrato', respContrato)
          toast.success(`Contrato ${contratoEdit?.token} excluído!`)
          setContratoEdit({})

          try {
            setContratoContext(undefined)
          } catch (error) {}

          handleClose(true)
        })
        .catch(err => {
          setErro({ msg: trataErro(err) })
        })
        .finally(() => {
          setSending(false)
        })
    }
  }

  const handleOpenDlgConfirmaCancelar = () => {
    setDialogConfirma({
      open: true,
      titulo: 'Cancelar Contrato',
      texto: `Tem certeza que deseja cancelar o contrato ${contratoEdit.token}?`,
      botaoConfirma: 'Confirmar Cancelamento',
      handleConfirma: handleCancelarContrato
    })
  }

  const handleCancelarContrato = () => {
    setSending(true)
    setErro(undefined)

    if (contratoEdit.token) {
      ContratoService.cancelarContrato(contratoEdit?.token)
        .then(respContrato => {
          //console.log('respContrato', respContrato)
          toast.success(`Contrato ${contratoEdit?.token} cancelado!`)
          setContratoEdit(respContrato)

          try {
            setContratoContext(respContrato)
          } catch (error) {}

          handleClose(true)
        })
        .catch(err => {
          setErro({ msg: trataErro(err) })
        })
        .finally(() => {
          setSending(false)
        })
    }
  }

  const handleOpenDlgConfirmaTrocar = () => {
    setDialogConfirma({
      open: true,
      titulo: 'Trocar Contrato',
      texto: `Tem certeza que deseja trocar este contrato?`,
      botaoConfirma: 'Confirmar',
      handleConfirma: handleTrocarContrato
    })
  }

  const handleTrocarContrato = () => {
    setMsgAlert('Para finalizar a substituição do contrato basta informar os novos valores e clicar em salvar')
    setTrocaContrato(true)

    if (contratoEdit.token) {
      setContratoEdit({
        ...contratoEdit,
        data: new Date(),
        contratoPai: contratoEdit,
        token: undefined,
        status: undefined
      })
    }
  }

  const handleOpenDlgConfirmaAtivar = () => {
    setDialogConfirma({
      open: true,
      titulo: 'Ativar Contrato',
      texto: `Tem certeza que deseja ativar este contrato?`,
      botaoConfirma: 'Confirmar',
      handleConfirma: handleAtivarContrato
    })
  }

  const handleAtivarContrato = () => {
    //console.log('ativar contrato', contratoEdit)
    setSending(true)
    setErro(undefined)

    if (contratoEdit.token) {
      ContratoService.ativarContrato(contratoEdit?.token)
        .then(respContrato => {
          console.log('respContrato', respContrato)
          toast.success(`Contrato ${contratoEdit?.token} ativado!`)
          setContratoEdit(respContrato)

          try {
            setContratoContext(respContrato)
          } catch (error) {}

          handleClose(true)
        })
        .catch(err => {
          console.log('ERRO contratoAtivar', err)
          setErro({ msg: trataErro(err) })
        })
        .finally(() => {
          setSending(false)
        })
    }
  }

  const onSubmit: SubmitHandler<FormData> = async (data: FormData) => {
    setErro(undefined)

    if (!contratoEdit.taxaCliente || contratoEdit.taxaCliente < 0.1) {
      toast.error(`É preciso informar um valor para a taxa do cliente`)

      return
    }

    const taxaMaxima = clienteContrato?.gestor?.taxaDistribuicao || 0

    if (contratoEdit.taxaCliente > taxaMaxima) {
      toast.error(`O valor da taxa do cliente não pode ser maior que ${taxaMaxima}%`)

      return
    }

    if (contrato && contrato.cliente && contrato.cliente.token && data.valor && data.taxaCliente) {
      setSending(true)
      ContratoService.salvarContrato(contratoEdit, trocaContrato)
        .then(() => {
          //console.log(respCliente)
          toast.success('Contrato salvo com sucesso!')
          setContratoEdit(contratoInit)
          handleClose(true)
        })
        .catch(err => {
          setErro({ msg: trataErro(err) })
        })
        .finally(() => {
          setSending(false)
        })
    }
  }

  useEffect(() => {
    if (!cliente && contratoEdit && contratoEdit.cliente && contratoEdit.cliente.token) {
      getCliente(contratoEdit.cliente.token)
        .then(respCliente => {
          if (respCliente) setClienteContrato(respCliente)
        })
        .catch(err => {
          const msgErro = trataErro(err)

          toast.error(msgErro)
        })
        .finally(() => {
          setSending(false)
        })
    }

    console.log('clienteContrato', clienteContrato)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        {erro && (
          <Alert
            icon={false}
            severity='error'
            onClose={() => {}}
            sx={{
              mb: 2.5
            }}
          >
            <AlertTitle>Erro</AlertTitle>
            {erro?.msg}
          </Alert>
        )}
        {msgAlert && (
          <Alert
            icon={false}
            severity='info'
            onClose={() => {}}
            sx={{
              mb: 2.5
            }}
          >
            {msgAlert}
          </Alert>
        )}
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6}>
            <Chip
              variant='tonal'
              label={
                contratoEdit?.dataEnvio
                  ? `Data do Envio: ${contratoEdit?.dataEnvio ? moment(contratoEdit?.dataEnvio).format('DD-MM-YYYY HH:mm') : ''}`
                  : 'Não enviado'
              }
              color='primary'
              icon={<i className='tabler-calendar-repeat' />}
              sx={{}}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Chip
              variant='tonal'
              label={`Status: ${contratoEdit.status ? getStatusContratoEnumDesc(contratoEdit.status) : ''}`}
              color={contratoEdit.status ? getStatusContratoEnumColor(contratoEdit.status) : 'default'}
              sx={{
                float: 'right'
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomTextField
              type='datetime-local'
              fullWidth
              label='Data'
              value={contratoEdit?.data ? moment(contratoEdit?.data).format('YYYY-MM-DD HH:mm') : ''}
              onChange={e => setContratoEdit({ ...contratoEdit, data: new Date(e.target.value) })}
              disabled={!!contratoEdit.status && contratoEdit.status != StatusContratoEnum.NOVO}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <label>É debênture?</label>
            <RadioGroup
              row
              name='radio-buttons-group'
              value={contratoEdit?.taxaCcb || 0}
              onChange={e =>
                setContratoEdit({
                  ...contratoEdit,
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
                  value={contratoEdit?.valor ? valorBr.format(contratoEdit?.valor || 0) : 0}
                  disabled={!!contratoEdit?.status && contratoEdit?.status != StatusContratoEnum.NOVO}
                  onChange={e => {
                    field.onChange(onChangeValor(e.target.value))
                    setContratoEdit({ ...contratoEdit, valor: onChangeValor(e.target.value) })
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
              value={contratoEdit?.prazo}
              onChange={e => setContratoEdit({ ...contratoEdit, prazo: parseInt(e.target.value) })}
              disabled={!!contratoEdit.status && contratoEdit.status != StatusContratoEnum.NOVO}
            >
              {prazoList.map((prazo, index) => (
                <MenuItem key={index} value={prazo} selected={contratoEdit?.prazo === prazo}>
                  {prazo} meses
                </MenuItem>
              ))}
            </CustomTextField>
          </Grid>
          <Grid item xs={12} sm={12}>
            <FormControl error={Boolean(errors.taxaCliente)} fullWidth>
              <Typography className='font-medium'>
                Taxa do cliente: <b>{contratoEdit?.taxaCliente}%</b>
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
                    max={clienteContrato?.gestor?.taxaDistribuicao}
                    step={0.05}
                    defaultValue={contratoEdit?.taxaCliente || 1}
                    valueLabelDisplay='auto'
                    aria-labelledby='continuous-slider'
                    disabled={!!contratoEdit?.status && contratoEdit?.status != StatusContratoEnum.NOVO}
                    onChangeCommitted={(e, sliderValue) => {
                      if (typeof sliderValue === 'number') {
                        field.onChange(sliderValue)
                        setContratoEdit({
                          ...contratoEdit,
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
              value={contratoEdit?.observacao}
              onChange={e => setContratoEdit({ ...contratoEdit, observacao: e.target.value })}
              disabled={!!contratoEdit.status && contratoEdit.status != StatusContratoEnum.NOVO}
            />
          </Grid>
          <Divider />
          <Grid item xs={12} sm={12}>
            {(contratoEdit.status === StatusContratoEnum.NOVO ||
              contratoEdit.status === StatusContratoEnum.AGUARDANDO ||
              contratoEdit.status === StatusContratoEnum.ATIVO) && (
              <Button type='button' variant='contained' className='mie-2' onClick={() => handleOpenDlgConfirmaEnviar()}>
                {`${contratoEdit.status === StatusContratoEnum.NOVO ? 'Enviar ' : 'Re-enviar '} Contrato`}
              </Button>
            )}
            {contratoEdit.status === StatusContratoEnum.ATIVO && (
              <Button type='button' variant='contained' className='mie-2' onClick={() => handleOpenDlgConfirmaTrocar()}>
                Trocar Contrato
              </Button>
            )}
            {(contratoEdit.status === StatusContratoEnum.AGUARDANDO ||
              contratoEdit.status === StatusContratoEnum.NOVO) && (
              <Button type='button' variant='contained' className='mie-2' onClick={() => handleOpenDlgConfirmaAtivar()}>
                Ativar Contrato
              </Button>
            )}
            {(contratoEdit.status === StatusContratoEnum.AGUARDANDO ||
              contratoEdit.status === StatusContratoEnum.ATIVO) && (
              <Button
                type='button'
                variant='contained'
                className='mie-2'
                onClick={() => handleOpenDlgConfirmaCancelar()}
              >
                Cancelar Contrato
              </Button>
            )}
            {(contratoEdit.status === StatusContratoEnum.NOVO ||
              contratoEdit.status === StatusContratoEnum.CANCELADO) && (
              <Button
                type='button'
                variant='contained'
                className='mie-2'
                onClick={() => handleOpenDlgConfirmaExcluir()}
              >
                Excluir Contrato
              </Button>
            )}
            <Button
              type='reset'
              variant='tonal'
              color='secondary'
              onClick={() => {
                handleClose(false)
              }}
              sx={{
                float: 'right'
              }}
            >
              Fechar
            </Button>
            {(!contratoEdit.status || contratoEdit.status === StatusContratoEnum.NOVO) && (
              <Button
                type='submit'
                variant='contained'
                className='mie-2'
                sx={{
                  mr: 2.5,
                  float: 'right'
                }}
              >
                Salvar
              </Button>
            )}
          </Grid>
        </Grid>
        <Backdrop open={sending} className='absolute text-white z-[cal(var(--mui-zIndex-mobileStepper)-1)]'>
          <CircularProgress color='inherit' />
        </Backdrop>
      </form>
      <DialogConfirma dialogConfirmaOptions={dialogConfirma} />
    </>
  )
}

export default ContratoEdit
