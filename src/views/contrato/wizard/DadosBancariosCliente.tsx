// React Imports
import { useEffect, useState } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import { Button, CardActions, CircularProgress, MenuItem } from '@mui/material'

import { toast } from 'react-toastify'

import CustomTextField from '@core/components/mui/TextField'

import { tiposContaBancaria, tiposPix } from '@/types/DadosBancariosType'
import type { BancoType } from '@/types/BancoType'
import BancoService from '@/services/BancoService'
import { useClienteContext } from '@/contexts/ClienteContext'
import DirectionalIcon from '@/components/DirectionalIcon'
import { salvarCliente } from '@/services/ClienteService'
import { trataErro } from '@/utils/erro'

type Props = {
  activeStep: number
  handleNext: () => void
  handlePrev: () => void
  steps: { title: string; subtitle: string }[]
}

const DadosBancariosCliente = ({ activeStep, handleNext, handlePrev, steps }: Props) => {
  //contexto
  const { cliente, setClienteContext } = useClienteContext()

  // States
  const [bancosList, setBancosList] = useState<BancoType[]>([])
  const [sending, setSending] = useState<boolean>(false)

  const onChageCavePix = (chave: string) => {
    const tipoChave = BancoService.getTipoChavePix(chave)

    setClienteContext({ ...cliente, chavePix: chave, tipoPix: tipoChave })
  }

  const onSubmit = (e: React.FormEvent<HTMLFormElement> | undefined) => {
    e?.preventDefault()

    if (cliente) {
      setSending(true)
      salvarCliente(cliente)
        .then(respCliente => {
          setClienteContext(respCliente)
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
    BancoService.getList()
      .then(respBancoList => {
        setBancosList(respBancoList)
      })
      .catch(err => {
        console.log('ERRO RESP', err)
      })
  }, [])

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <form onSubmit={e => onSubmit(e)}>
            <CardHeader title='Dados Bancários' />
            <CardContent className='flex flex-col gap-4'>
              <Grid container spacing={5}>
                <Grid item xs={12} sm={6}>
                  <CustomTextField
                    select
                    fullWidth
                    label='Banco'
                    value={bancosList.length > 0 ? cliente?.banco?.codigo || '' : ''}
                    onChange={e => setClienteContext({ ...cliente, banco: { codigo: e.target.value } })}
                    placeholder='Selecione um banco'
                  >
                    {bancosList.map((banco, index) => (
                      <MenuItem key={index} value={banco.codigo} selected={cliente?.banco === banco.codigo}>
                        {banco.codigo} - {banco.apelido}
                      </MenuItem>
                    ))}
                  </CustomTextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <CustomTextField
                    fullWidth
                    label='Agência'
                    value={cliente?.agencia || ''}
                    onChange={e => setClienteContext({ ...cliente, agencia: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <CustomTextField
                    select
                    fullWidth
                    label='Tipo Conta'
                    value={cliente?.tipoConta || ''}
                    onChange={e => setClienteContext({ ...cliente, tipoConta: e.target.value })}
                    placeholder='Selecione um tipo de conta'
                  >
                    {tiposContaBancaria.map((tipoConta, index) => (
                      <MenuItem key={index} value={tipoConta} selected={cliente?.tipoConta === tipoConta}>
                        {tipoConta}
                      </MenuItem>
                    ))}
                  </CustomTextField>
                </Grid>
                {cliente?.tipoConta === 'Poupança' && (
                  <Grid item xs={12} sm={6}>
                    <CustomTextField
                      fullWidth
                      label='Tipo poupança'
                      value={cliente?.tipoPoupanca || ''}
                      onChange={e => setClienteContext({ ...cliente, tipoPoupanca: e.target.value })}
                    />
                  </Grid>
                )}
                <Grid item xs={12} sm={6}>
                  <CustomTextField
                    fullWidth
                    label='Número da conta (com dv)'
                    value={cliente?.conta || ''}
                    onChange={e => setClienteContext({ ...cliente, conta: e.target.value })}
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
                    value={cliente?.chavePix || ''}
                    onChange={e => onChageCavePix(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <CustomTextField
                    select
                    fullWidth
                    label='Tipo pix'
                    value={cliente?.tipoPix || ''}
                    onChange={e => setClienteContext({ ...cliente, tipoPix: e.target.value })}
                  >
                    <MenuItem>Selecione um tipo de pix</MenuItem>
                    {tiposPix.map((tipoPix, index) => (
                      <MenuItem key={index} value={tipoPix} selected={cliente?.tipoPix === tipoPix}>
                        {tipoPix === 'Random' ? 'Chave aleatória' : tipoPix}
                      </MenuItem>
                    ))}
                  </CustomTextField>
                </Grid>
              </Grid>
            </CardContent>
            <Divider />
            <CardActions></CardActions>
          </form>
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
            onClick={() => onSubmit(undefined)}
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
  )
}

export default DadosBancariosCliente
