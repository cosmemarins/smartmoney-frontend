// React Imports
import { useEffect, useState } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import Divider from '@mui/material/Divider'

// Component Imports
import { Backdrop, Button, CardActions, CircularProgress, MenuItem } from '@mui/material'

import { toast } from 'react-toastify'

import CustomTextField from '@core/components/mui/TextField'
import { tiposContaBancaria, tiposPix } from '@/types/DadosBancariosType'
import type { DadosBancariosType } from '@/types/DadosBancariosType'
import type { BancoType } from '@/types/BancoType'
import BancoService from '@/services/BancoService'
import type { erroType } from '@/types/utilTypes'
import { salvarDadosBancarios } from '@/services/ClienteService'

import { useClienteContext } from '@/contexts/ClienteContext'

const DadosBancarios = () => {
  //contexto
  const { cliente, setClienteContext } = useClienteContext()

  const dadosBancariosInit = {
    token: cliente?.token,
    banco: cliente?.banco,
    agencia: cliente?.agencia,
    conta: cliente?.conta,
    tipoConta: cliente?.tipoConta,
    tipoPoupanca: cliente?.tipoPoupanca,
    tipoPix: cliente?.tipoPix,
    chavePix: cliente?.chavePix
  } as DadosBancariosType

  // States
  const [erro, setErro] = useState<erroType>()
  const [reload, setReload] = useState(false)
  const [bancosList, setBancosList] = useState<BancoType[]>([])

  const [dadosBancariosEdit, setDadosBancariosEdit] = useState<DadosBancariosType>(dadosBancariosInit)

  const handleReset = () => {
    setDadosBancariosEdit(dadosBancariosInit)
  }

  const onChageCavePix = (chave: string) => {
    const tipoChave = BancoService.getTipoChavePix(chave)

    setDadosBancariosEdit({ ...dadosBancariosEdit, chavePix: chave, tipoPix: tipoChave })
  }

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setReload(true)
    setErro(undefined)

    salvarDadosBancarios(dadosBancariosEdit)
      .then(respCliente => {
        //console.log(respCliente)
        setClienteContext({
          ...cliente,
          banco: respCliente.banco,
          agencia: respCliente.agencia,
          conta: respCliente.conta,
          tipoConta: respCliente.tipoConta,
          tipoPoupanca: respCliente.tipoPoupanca,
          tipoPix: respCliente.tipoPix,
          chavePix: respCliente.chavePix
        })
        toast.success('Dados salvo com sucesso!')
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

  useEffect(() => {
    BancoService.getList()
      .then(respBancoList => {
        setBancosList(respBancoList)
      })
      .catch(err => {
        console.log('ERRO RESP', err)
      })
  }, [])

  return (
    <Card>
      <form onSubmit={e => handleFormSubmit(e)}>
        <CardHeader title='Dados Bancários' />
        <CardContent className='flex flex-col gap-4'>
          {erro && (
            <Alert icon={false} severity='error' onClose={() => {}}>
              <AlertTitle>Erro</AlertTitle>
              {erro?.msg}
            </Alert>
          )}
          <Grid container spacing={5}>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                select
                fullWidth
                label='Banco'
                value={bancosList.length > 0 ? dadosBancariosEdit?.banco?.codigo || '' : ''}
                onChange={e => setDadosBancariosEdit({ ...dadosBancariosEdit, banco: { codigo: e.target.value } })}
                placeholder='Selecione um banco'
              >
                {bancosList.map((banco, index) => (
                  <MenuItem key={index} value={banco.codigo} selected={dadosBancariosEdit?.banco === banco.codigo}>
                    {banco.codigo} - {banco.apelido}
                  </MenuItem>
                ))}
              </CustomTextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label='Agência'
                value={dadosBancariosEdit?.agencia || ''}
                onChange={e => setDadosBancariosEdit({ ...dadosBancariosEdit, agencia: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                select
                fullWidth
                label='Tipo Conta'
                value={dadosBancariosEdit?.tipoConta || ''}
                onChange={e => setDadosBancariosEdit({ ...dadosBancariosEdit, tipoConta: e.target.value })}
                placeholder='Selecione um tipo de conta'
              >
                {tiposContaBancaria.map((tipoConta, index) => (
                  <MenuItem key={index} value={tipoConta} selected={dadosBancariosEdit.tipoConta === tipoConta}>
                    {tipoConta}
                  </MenuItem>
                ))}
              </CustomTextField>
            </Grid>
            {dadosBancariosEdit?.tipoConta === 'Poupança' && (
              <Grid item xs={12} sm={6}>
                <CustomTextField
                  fullWidth
                  label='Tipo poupança'
                  value={dadosBancariosEdit?.tipoPoupanca || ''}
                  onChange={e => setDadosBancariosEdit({ ...dadosBancariosEdit, tipoPoupanca: e.target.value })}
                />
              </Grid>
            )}
            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label='Número da conta (com dv)'
                value={dadosBancariosEdit?.conta || ''}
                onChange={e => setDadosBancariosEdit({ ...dadosBancariosEdit, conta: e.target.value })}
              />
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        <CardHeader title='PIX' />
        <CardContent className='flex flex-col gap-4'>
          <Grid container spacing={5}>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label='Chave pix'
                value={dadosBancariosEdit?.chavePix || ''}
                onChange={e => onChageCavePix(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                select
                fullWidth
                label='Tipo pix'
                value={dadosBancariosEdit?.tipoPix || ''}
                onChange={e => setDadosBancariosEdit({ ...dadosBancariosEdit, tipoPix: e.target.value })}
              >
                <MenuItem>Selecione um tipo de pix</MenuItem>
                {tiposPix.map((tipoPix, index) => (
                  <MenuItem key={index} value={tipoPix} selected={dadosBancariosEdit.tipoPix === tipoPix}>
                    {tipoPix === 'Random' ? 'Chave aleatória' : tipoPix}
                  </MenuItem>
                ))}
              </CustomTextField>
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        <CardActions>
          <Button type='submit' variant='contained' className='mie-2'>
            Salvar
          </Button>
          <Button
            type='reset'
            variant='tonal'
            color='secondary'
            onClick={() => {
              handleReset()
            }}
          >
            Reset
          </Button>
        </CardActions>
      </form>
      <Backdrop open={reload} className='absolute text-white z-[cal(var(--mui-zIndex-mobileStepper)-1)]'>
        <CircularProgress color='inherit' />
      </Backdrop>
    </Card>
  )
}

export default DadosBancarios
