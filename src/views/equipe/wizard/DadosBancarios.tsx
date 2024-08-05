// React Imports
import type { SyntheticEvent } from 'react'
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
import { useEquipeContext } from '@/contexts/EquipeContext'
import DirectionalIcon from '@/components/DirectionalIcon'
import { trataErro } from '@/utils/erro'

import { bancoList, getTipoChavePix } from '@/utils/banco'
import UsuarioService from '@/services/UsuarioService'
import { getPerfilUsuarioEnumDesc } from '@/utils/enums/PerfilUsuarioEnum'
import CustomAutocomplete from '@/@core/components/mui/Autocomplete'
import type { ItemListType } from '@/types/utilTypes'

type Props = {
  activeStep: number
  handleNext: () => void
  handlePrev: () => void
  steps: { title: string; subtitle: string }[]
}

const DadosBancarios = ({ activeStep, handleNext, handlePrev, steps }: Props) => {
  //contexto
  const { usuarioEquipe, setUsuarioEquipeContext } = useEquipeContext()

  // States
  const [sending, setSending] = useState<boolean>(false)
  const [bancoSelect, setBancoSelect] = useState<ItemListType | null>(null)

  const onChageCavePix = (chave: string) => {
    const tipoChave = getTipoChavePix(chave)

    setUsuarioEquipeContext({ ...usuarioEquipe, chavePix: chave, tipoPix: tipoChave })
  }

  const onChangeBanco = (event: SyntheticEvent, itemSel: ItemListType | null) => {
    setBancoSelect(itemSel)
    setUsuarioEquipeContext({ ...usuarioEquipe, banco: { codigo: itemSel?.key, nome: itemSel?.value } })
  }

  const onSubmit = (e: React.FormEvent<HTMLFormElement> | undefined) => {
    e?.preventDefault()

    if (usuarioEquipe) {
      setSending(true)
      UsuarioService.salvar(usuarioEquipe)
        .then(respUsuario => {
          setUsuarioEquipeContext(respUsuario)
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
    if (usuarioEquipe && usuarioEquipe.banco && usuarioEquipe.banco.codigo != '') {
      setBancoSelect({
        key: usuarioEquipe.banco.codigo,
        value: usuarioEquipe.banco.nome
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <form onSubmit={e => onSubmit(e)}>
            <CardHeader title={`Dados Bancários do ${getPerfilUsuarioEnumDesc(usuarioEquipe?.perfil)}`} />
            <CardContent className='flex flex-col gap-4'>
              <Grid container spacing={5}>
                <Grid item xs={12} sm={6}>
                  <CustomAutocomplete
                    fullWidth
                    options={bancoList}
                    onChange={onChangeBanco}
                    id='bancoSel'
                    isOptionEqualToValue={(option, value) => option.key === value.key}
                    value={bancoSelect}
                    getOptionLabel={option => `${option.key} - ${option.value}`}
                    renderInput={params => <CustomTextField {...params} label='Banco' />}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <CustomTextField
                    fullWidth
                    label='Agência'
                    value={usuarioEquipe?.agencia || ''}
                    onChange={e => setUsuarioEquipeContext({ ...usuarioEquipe, agencia: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <CustomTextField
                    select
                    fullWidth
                    label='Tipo Conta'
                    value={usuarioEquipe?.tipoConta || ''}
                    onChange={e => setUsuarioEquipeContext({ ...usuarioEquipe, tipoConta: e.target.value })}
                    placeholder='Selecione um tipo de conta'
                  >
                    {tiposContaBancaria.map((tipoConta, index) => (
                      <MenuItem key={index} value={tipoConta} selected={usuarioEquipe?.tipoConta === tipoConta}>
                        {tipoConta}
                      </MenuItem>
                    ))}
                  </CustomTextField>
                </Grid>
                {usuarioEquipe?.tipoConta === 'Poupança' && (
                  <Grid item xs={12} sm={6}>
                    <CustomTextField
                      fullWidth
                      label='Tipo poupança'
                      value={usuarioEquipe?.tipoPoupanca || ''}
                      onChange={e => setUsuarioEquipeContext({ ...usuarioEquipe, tipoPoupanca: e.target.value })}
                    />
                  </Grid>
                )}
                <Grid item xs={12} sm={6}>
                  <CustomTextField
                    fullWidth
                    label='Número da conta (com dv)'
                    value={usuarioEquipe?.conta || ''}
                    onChange={e => setUsuarioEquipeContext({ ...usuarioEquipe, conta: e.target.value })}
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
                    value={usuarioEquipe?.chavePix || ''}
                    onChange={e => onChageCavePix(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <CustomTextField
                    select
                    fullWidth
                    label='Tipo pix'
                    value={usuarioEquipe?.tipoPix || ''}
                    onChange={e => setUsuarioEquipeContext({ ...usuarioEquipe, tipoPix: e.target.value })}
                  >
                    <MenuItem>Selecione um tipo de pix</MenuItem>
                    {tiposPix.map((tipoPix, index) => (
                      <MenuItem key={index} value={tipoPix} selected={usuarioEquipe?.tipoPix === tipoPix}>
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

export default DadosBancarios
