'use client'

// React Imports
import { useState } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import { Backdrop, Button, CircularProgress, Divider, MenuItem } from '@mui/material'
import moment, { locale } from 'moment'
import 'moment/locale/pt-br'
import InputMask from 'react-input-mask'

import { toast } from 'react-toastify'

import CustomTextField from '@core/components/mui/TextField'
import type { ContratoType } from '@/types/ContratoType'
import { contratoInit, prazoList } from '@/types/ContratoType'
import type { erroType } from '@/types/utilTypes'
import ContratoService from '@/services/ContratoService'

import { useClienteContext } from '@/contexts/ClienteContext'

locale('pt-br')

interface props {
  contratoData?: ContratoType
  contratoPai?: ContratoType
  handleClose?: any
}

const ContratoEdit = ({ contratoData, contratoPai, handleClose }: props) => {
  //contexto
  const { cliente } = useClienteContext()

  // States
  const [erro, setErro] = useState<erroType>()
  const [reload, setReload] = useState(false)

  const [contratoEdit, setContratoEdit] = useState<ContratoType>(
    contratoData
      ? contratoData
      : { ...contratoInit, data: new Date(), cliente: { id: cliente.id, token: cliente.token } }
  )

  const onChangeValor = (value: string) => {
    const valorStr = value.replace(/[^\d]+/g, '')
    const valor = parseFloat(valorStr) / 100

    setContratoEdit({ ...contratoEdit, valor })
  }

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setReload(true)
    setErro(undefined)

    //setContratoEdit({ ...contratoEdit, cliente: { id: cliente.id, token: cliente.token } })
    console.log('contratoEdit', contratoEdit)

    ContratoService.salvarContrato(contratoEdit)
      .then(() => {
        //console.log(respCliente)
        toast.success('Contrato salvo com sucesso!')
        setContratoEdit(contratoInit)
        handleClose()
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
    <form onSubmit={e => handleFormSubmit(e)}>
      {erro && (
        <Alert icon={false} severity='error' onClose={() => {}}>
          <AlertTitle>Erro</AlertTitle>
          {erro?.msg}
        </Alert>
      )}
      <Grid container spacing={4}>
        <Grid item xs={12} sm={6}>
          <CustomTextField
            type='datetime-local'
            fullWidth
            label='Data'
            value={contratoEdit?.data ? moment(contratoEdit?.data).format('YYYY-MM-DD HH:mm') : ''}
            onChange={e => setContratoEdit({ ...contratoEdit, data: new Date(e.target.value) })}
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
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <CustomTextField
            select
            fullWidth
            label='prazo'
            value={contratoEdit?.prazo}
            onChange={e => setContratoEdit({ ...contratoEdit, prazo: parseInt(e.target.value) })}
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
          />
        </Grid>
        <Grid item xs={12} sm={12}>
          <CustomTextField
            fullWidth
            label='Observação'
            value={contratoEdit?.observacao}
            onChange={e => setContratoEdit({ ...contratoEdit, observacao: e.target.value })}
          />
        </Grid>
        <Divider />
        <Grid item xs={12} sm={12}>
          <Button type='submit' variant='contained' className='mie-2'>
            Salvar
          </Button>
          <Button
            type='reset'
            variant='tonal'
            color='secondary'
            onClick={() => {
              handleClose()
            }}
          >
            Cancelar
          </Button>
        </Grid>
        <Backdrop open={reload} className='absolute text-white z-[cal(var(--mui-zIndex-mobileStepper)-1)]'>
          <CircularProgress color='inherit' />
        </Backdrop>
      </Grid>
    </form>
  )
}

export default ContratoEdit
