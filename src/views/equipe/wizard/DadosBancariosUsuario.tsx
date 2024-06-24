// React Imports
import { useState } from 'react'

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
import { useUsuarioContext } from '@/contexts/UsuarioContext'
import DirectionalIcon from '@/components/DirectionalIcon'
import { salvarUsuario } from '@/services/UsuarioService'
import { trataErro } from '@/utils/erro'

import { bancoList, getTipoChavePix } from '@/utils/banco'

type Props = {
  activeStep: number
  handleNext: () => void
  handlePrev: () => void
  steps: { title: string; subtitle: string }[]
}

const DadosBancariosUsuario = ({ activeStep, handleNext, handlePrev, steps }: Props) => {
  //contexto
  const { usuario, setUsuarioContext } = useUsuarioContext()

  // States
  const [sending, setSending] = useState<boolean>(false)

  const onChageCavePix = (chave: string) => {
    const tipoChave = getTipoChavePix(chave)

    setUsuarioContext({ ...usuario, chavePix: chave, tipoPix: tipoChave })
  }

  const onSubmit = (e: React.FormEvent<HTMLFormElement> | undefined) => {
    e?.preventDefault()

    if (usuario) {
      setSending(true)
      salvarUsuario(usuario)
        .then(respUsuario => {
          setUsuarioContext(respUsuario)
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
                    value={bancoList.length > 0 ? usuario?.banco?.codigo || '' : ''}
                    onChange={e => setUsuarioContext({ ...usuario, banco: { codigo: e.target.value } })}
                    placeholder='Selecione um banco'
                  >
                    {bancoList.map((banco, index) => (
                      <MenuItem key={index} value={banco.codigo} selected={usuario?.banco === banco.codigo}>
                        {banco.codigo} - {banco.nome}
                      </MenuItem>
                    ))}
                  </CustomTextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <CustomTextField
                    fullWidth
                    label='Agência'
                    value={usuario?.agencia || ''}
                    onChange={e => setUsuarioContext({ ...usuario, agencia: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <CustomTextField
                    select
                    fullWidth
                    label='Tipo Conta'
                    value={usuario?.tipoConta || ''}
                    onChange={e => setUsuarioContext({ ...usuario, tipoConta: e.target.value })}
                    placeholder='Selecione um tipo de conta'
                  >
                    {tiposContaBancaria.map((tipoConta, index) => (
                      <MenuItem key={index} value={tipoConta} selected={usuario?.tipoConta === tipoConta}>
                        {tipoConta}
                      </MenuItem>
                    ))}
                  </CustomTextField>
                </Grid>
                {usuario?.tipoConta === 'Poupança' && (
                  <Grid item xs={12} sm={6}>
                    <CustomTextField
                      fullWidth
                      label='Tipo poupança'
                      value={usuario?.tipoPoupanca || ''}
                      onChange={e => setUsuarioContext({ ...usuario, tipoPoupanca: e.target.value })}
                    />
                  </Grid>
                )}
                <Grid item xs={12} sm={6}>
                  <CustomTextField
                    fullWidth
                    label='Número da conta (com dv)'
                    value={usuario?.conta || ''}
                    onChange={e => setUsuarioContext({ ...usuario, conta: e.target.value })}
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
                    value={usuario?.chavePix || ''}
                    onChange={e => onChageCavePix(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <CustomTextField
                    select
                    fullWidth
                    label='Tipo pix'
                    value={usuario?.tipoPix || ''}
                    onChange={e => setUsuarioContext({ ...usuario, tipoPix: e.target.value })}
                  >
                    <MenuItem>Selecione um tipo de pix</MenuItem>
                    {tiposPix.map((tipoPix, index) => (
                      <MenuItem key={index} value={tipoPix} selected={usuario?.tipoPix === tipoPix}>
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
            {activeStep === steps.length - 1 ? 'Salvar Parceiro' : 'Próximo'}
          </Button>
        </div>
      </Grid>
    </Grid>
  )
}

export default DadosBancariosUsuario
