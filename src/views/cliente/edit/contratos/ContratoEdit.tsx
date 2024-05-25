'use client'

// React Imports
import { useState } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import { Backdrop, Button, Chip, CircularProgress, Divider, MenuItem } from '@mui/material'
import moment, { locale } from 'moment'
import 'moment/locale/pt-br'

import { toast } from 'react-toastify'

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

locale('pt-br')

interface props {
  contratoData?: ContratoType
  handleClose?: any
}

const ContratoEdit = ({ contratoData, handleClose }: props) => {
  //contexto
  const { cliente } = useClienteContext()

  // States
  const [erro, setErro] = useState<erroType>()
  const [msgAlert, setMsgAlert] = useState<string>()
  const [reload, setReload] = useState(false)
  const [trocaContrato, setTrocaContrato] = useState(false)
  const [dialogConfirma, setDialogConfirma] = useState<DialogConfirmaType>({ open: false })

  const [contratoEdit, setContratoEdit] = useState<ContratoType>(
    contratoData
      ? contratoData
      : { ...contratoInit, data: new Date(), cliente: { id: cliente?.id, token: cliente?.token } }
  )

  const onChangeValor = (value: string) => {
    const valorStr = value.replace(/[^\d]+/g, '')
    const valor = parseFloat(valorStr) / 100

    setContratoEdit({ ...contratoEdit, valor })
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
    setReload(true)
    setErro(undefined)

    if (contratoEdit.token) {
      ContratoService.enviarContrato(contratoEdit?.token)
        .then(respContrato => {
          //console.log('respContrato', respContrato)
          toast.success('Contrato enviado!')
          setContratoEdit(respContrato)
          handleClose(true)
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
    setReload(true)
    setErro(undefined)

    if (contratoEdit.token) {
      ContratoService.excluirContrato(contratoEdit?.token)
        .then(() => {
          //console.log('respContrato', respContrato)
          toast.success(`Contrato ${contratoEdit?.token} excluído!`)
          setContratoEdit({})
          handleClose(true)
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
    setReload(true)
    setErro(undefined)

    if (contratoEdit.token) {
      ContratoService.cancelarContrato(contratoEdit?.token)
        .then(respContrato => {
          //console.log('respContrato', respContrato)
          toast.success(`Contrato ${contratoEdit?.token} cancelado!`)
          setContratoEdit(respContrato)
          handleClose(true)
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
    setReload(true)
    setErro(undefined)

    if (contratoEdit.token) {
      ContratoService.ativarContrato(contratoEdit?.token)
        .then(respContrato => {
          //console.log('respContrato', respContrato)
          toast.success(`Contrato ${contratoEdit?.token} ativado!`)
          setContratoEdit(respContrato)
          handleClose(true)
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
  }

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setReload(true)
    setErro(undefined)

    //setContratoEdit({ ...contratoEdit, cliente: { id: cliente.id, token: cliente.token } })
    console.log('contratoEdit', contratoEdit)

    ContratoService.salvarContrato(contratoEdit, trocaContrato)
      .then(() => {
        //console.log(respCliente)
        toast.success('Contrato salvo com sucesso!')
        setContratoEdit(contratoInit)
        handleClose(true)
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
    <>
      <form onSubmit={e => handleFormSubmit(e)}>
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
            {contratoEdit?.dataEnvio && (
              <Chip
                variant='tonal'
                label={`Data do Envio: ${contratoEdit?.dataEnvio ? moment(contratoEdit?.dataEnvio).format('YYYY-MM-DD HH:mm') : ''}`}
                color='primary'
                icon={<i className='tabler-calendar-repeat' />}
                sx={{}}
              />
            )}
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
            <CustomTextField
              fullWidth
              label='Valor'
              value={
                contratoEdit?.valor
                  ? contratoEdit?.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                  : 0
              }
              onChange={e => onChangeValor(e.target.value)}
              disabled={!!contratoEdit.status && contratoEdit.status != StatusContratoEnum.NOVO}
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
          <Grid item xs={12} sm={6}>
            <CustomTextField
              fullWidth
              label='Taxa'
              type='number'
              value={contratoEdit?.taxa}
              onChange={e =>
                setContratoEdit({
                  ...contratoEdit,
                  taxa: parseFloat(e.target.value) <= 0 ? 0 : parseFloat(e.target.value)
                })
              }
              disabled={!!contratoEdit.status && contratoEdit.status != StatusContratoEnum.NOVO}
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
          <Backdrop open={reload} className='absolute text-white z-[cal(var(--mui-zIndex-mobileStepper)-1)]'>
            <CircularProgress color='inherit' />
          </Backdrop>
        </Grid>
      </form>
      <DialogConfirma dialogConfirmaOptions={dialogConfirma} />
    </>
  )
}

export default ContratoEdit
