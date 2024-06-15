'use client'

// React Imports
import { useState } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Chip,
  Divider,
  FormControlLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Typography
} from '@mui/material'
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

const ContratoCliente = ({ activeStep, handleNext, handlePrev, steps }: Props) => {
  //contexto
  const { cliente } = useClienteContext()

  // States
  const [erro, setErro] = useState<erroType>()
  const [msgAlert, setMsgAlert] = useState<string>()
  const [trocaContrato, setTrocaContrato] = useState(false)
  const [dialogConfirma, setDialogConfirma] = useState<DialogConfirmaType>({ open: false })
  const [ehCcb, setEhCcb] = useState('NAO')

  const { setLoadingContext } = useClienteContext()
  const { setContratoContext } = useContratoContext()

  const [contratoEdit, setContratoEdit] = useState<ContratoType>({
    ...contratoInit,
    data: new Date(),
    cliente: { id: cliente?.id, token: cliente?.token }
  })

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
    setLoadingContext(true)
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
          setLoadingContext(false)
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
    setLoadingContext(true)
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
          setLoadingContext(false)
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
    setLoadingContext(true)
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
          setLoadingContext(false)
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
    setLoadingContext(true)
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
          setLoadingContext(false)
        })
    }
  }

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoadingContext(true)
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
        setErro({ msg: trataErro(err) })
      })
      .finally(() => {
        setLoadingContext(false)
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
                      value={contratoEdit?.data ? moment(contratoEdit?.data).format('YYYY-MM-DD HH:mm') : ''}
                      onChange={e => setContratoEdit({ ...contratoEdit, data: new Date(e.target.value) })}
                      disabled={!!contratoEdit.status && contratoEdit.status != StatusContratoEnum.NOVO}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <label>É CCB?</label>
                    <RadioGroup row name='radio-buttons-group' value={ehCcb} onChange={e => setEhCcb(e.target.value)}>
                      <FormControlLabel value='NAO' control={<Radio />} label='Não' />
                      <FormControlLabel value='SIM' control={<Radio />} label='Sim' />
                    </RadioGroup>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <CustomTextField
                      fullWidth
                      label='Valor'
                      value={
                        contratoEdit?.valor
                          ? contratoEdit?.valor.toLocaleString('pt-BR', {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2
                            })
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
                      label='Taxa Cliente'
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
                  <Grid item xs={12} sm={6}>
                    <CustomTextField
                      fullWidth
                      label='Taxa Credenciado'
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
                  <Grid item xs={12} sm={6}>
                    <CustomTextField
                      fullWidth
                      label='Taxa Gestor'
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
                  <Grid item xs={12} sm={6}>
                    <CustomTextField
                      fullWidth
                      label='Taxa Agente'
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
                  <Grid item xs={12} sm={6}>
                    <CustomTextField
                      fullWidth
                      label='Taxa Outros'
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
                onClick={handleNext}
                endIcon={
                  activeStep === steps.length - 1 ? (
                    <i className='tabler-check' />
                  ) : (
                    <DirectionalIcon ltrIconClass='tabler-arrow-right' rtlIconClass='tabler-arrow-left' />
                  )
                }
              >
                {activeStep === steps.length - 1 ? 'Enviar Contrato' : 'Próximo'}
              </Button>
            </div>
          </Grid>
        </Grid>
      </form>
      <DialogConfirma dialogConfirmaOptions={dialogConfirma} />
    </>
  )
}

export default ContratoCliente
