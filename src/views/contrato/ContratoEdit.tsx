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
  FormControlLabel,
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
import { contratoInit, prazoList } from '@/types/ContratoType'
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

type FormData = v.InferInput<typeof schema>

const schema = v.object({
  valor: v.pipe(v.number('Digite um valor'), v.minValue(1, 'É preciso inforar um valor.')),
  taxaCliente: v.pipe(v.number('Informe a taxa'), v.minValue(0.01, 'Informe a taxa.'))
})

const marks = [
  {
    value: 0,
    label: '0'
  },
  {
    value: 0.5,
    label: '0,5%'
  },
  {
    value: 1,
    label: '1%'
  },
  {
    value: 1.5,
    label: '1,5%'
  },
  {
    value: 2,
    label: '2%'
  },
  {
    value: 2.5,
    label: '1,5%'
  },
  {
    value: 3,
    label: '3%'
  },
  {
    value: 3.5,
    label: '3,5%'
  },
  {
    value: 4,
    label: '4%'
  },
  {
    value: 4.5,
    label: '4,5%'
  },
  {
    value: 5,
    label: '5%'
  }
]

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
          setContratoContext(respContrato)
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
          setContratoContext(undefined)
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
          setContratoContext(respContrato)
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
          setContratoContext(respContrato)
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

    //setContratoEdit({ ...contratoEdit, cliente: { id: cliente.id, token: cliente.token } })
    console.log('contratoEdit', contratoEdit)

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
          console.log('respCliente', respCliente)
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
                  ? `Data do Envio: ${contratoEdit?.dataEnvio ? moment(contratoEdit?.dataEnvio).format('YYYY-MM-DD HH:mm') : ''}`
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
          <Grid item xs={12} sm={4}>
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
          <Grid item xs={12} sm={4}>
            <Controller
              name='taxaCliente'
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  fullWidth
                  label='Taxa Cliente'
                  type='number'
                  value={contratoEdit?.taxaCliente}
                  disabled={!!contratoEdit?.status && contratoEdit?.status != StatusContratoEnum.NOVO}
                  onChange={e => {
                    field.onChange(parseFloat(e.target.value))
                    setContratoEdit({
                      ...contratoEdit,
                      taxaCliente: parseFloat(e.target.value) <= 0 ? 0 : parseFloat(e.target.value)
                    })
                    errorState !== null && setErrorState(null)
                  }}
                  {...((errors.taxaCliente || errorState !== null) && {
                    error: true,
                    helperText: errors?.taxaCliente?.message || errorState?.message
                  })}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
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
            <Typography className='font-medium'>Taxa cliente</Typography>
            <Slider
              marks={marks}
              min={0}
              max={clienteContrato?.gestor?.taxaDistribuicao || cliente?.gestor?.taxaDistribuicao}
              step={0.1}
              defaultValue={contratoEdit?.taxaCliente || 1}
              valueLabelDisplay='on'
              aria-labelledby='continuous-slider'
            />
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
