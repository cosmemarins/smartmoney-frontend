// React Imports
import { useEffect, useState } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import {
  Button,
  CardActions,
  CircularProgress,
  FormControlLabel,
  Radio,
  RadioGroup,
  Slider,
  Typography
} from '@mui/material'
import { toast } from 'react-toastify'

import { useEquipeContext } from '@/contexts/EquipeContext'
import { trataErro } from '@/utils/erro'
import DirectionalIcon from '@/components/DirectionalIcon'
import { taxaContratoMarks } from '@/types/ContratoType'
import type { ConfiguracoesUsuarioType } from '@/types/ConfiguracoesUsuarioType'
import UsuarioService from '@/services/UsuarioService'
import { getPerfilUsuarioEnumDesc, PerfilUsuarioEnum } from '@/utils/enums/PerfilUsuarioEnum'
import { TaxasEnum } from '@/utils/enums/TaxasEnum'

type Props = {
  activeStep: number
  handleNext: () => void
  handlePrev: () => void
  steps: { title: string; subtitle: string }[]
}

const ConfiguracoesUsuario = ({ activeStep, handleNext, handlePrev, steps }: Props) => {
  //contexto
  const { usuarioEquipe, setUsuarioEquipeContext } = useEquipeContext()

  console.log('usuarioEquipe', usuarioEquipe)

  const taxaInit =
    usuarioEquipe?.perfil === PerfilUsuarioEnum.AGENTE ? TaxasEnum.MAXIMO_AGENTE : TaxasEnum.MAXIMO_CONSULTOR

  // States
  const [configuracoesUsuario, setConfiguracoesUsuario] = useState<ConfiguracoesUsuarioType>({
    id: usuarioEquipe?.id,
    token: usuarioEquipe?.token,
    taxaDistribuicao: usuarioEquipe?.taxaDistribuicao || 0,
    podeCriarEquipe: false
  })

  const [sending, setSending] = useState<boolean>(false)
  const [maxTaxa, setMaxTaxa] = useState<number>(Number(taxaInit))

  const handleSubmit = () => {
    if (usuarioEquipe && usuarioEquipe.token && configuracoesUsuario) {
      if (configuracoesUsuario.taxaDistribuicao && configuracoesUsuario.taxaDistribuicao > 0) {
        setSending(true)
        UsuarioService.salvarConfiguracoes(configuracoesUsuario)
          .then(respUsuario => {
            setUsuarioEquipeContext(respUsuario)
            toast.success('Dados salvo com sucesso!')
            handleNext()
          })
          .catch(err => {
            const msgErro = trataErro(err)

            toast.error(msgErro)
          })
          .finally(() => {
            setSending(false)
          })
      } else {
        toast.error(`A taxa de distribuição do ${usuarioEquipe.perfil} precisa ser maior que zero`)
      }
    }
  }

  function handleSlideChange(event: any, sliderValue: number | number[]) {
    //console.log(event.target.value)
    //console.log(sliderValue)

    if (typeof sliderValue === 'number') {
      if (sliderValue < TaxasEnum.MAXIMO_CONSULTOR - 1) {
        setConfiguracoesUsuario({
          ...configuracoesUsuario,
          taxaDistribuicao: sliderValue,
          podeCriarEquipe: false
        })
      } else {
        setConfiguracoesUsuario({
          ...configuracoesUsuario,
          taxaDistribuicao: sliderValue
        })
      }
    }
  }

  useEffect(() => {
    //console.log(usuarioEquipe)

    if (usuarioEquipe && usuarioEquipe.token) {
      setConfiguracoesUsuario({
        ...configuracoesUsuario,
        id: usuarioEquipe.id,
        token: usuarioEquipe.token,
        podeCriarEquipe:
          usuarioEquipe.taxaDistribuicao && usuarioEquipe.taxaDistribuicao < TaxasEnum.MAXIMO_CONSULTOR - 1
            ? false
            : usuarioEquipe.podeCriarEquipe
      })

      //definindo a taxa máxima padrao default para o novo usuario
      console.log('usuarioEquipe.gestor?.taxaDistribuicao', usuarioEquipe.gestor?.taxaDistribuicao)

      if (usuarioEquipe.gestor?.taxaDistribuicao) {
        setMaxTaxa(
          usuarioEquipe.gestor?.taxaDistribuicao < taxaInit ? usuarioEquipe.gestor?.taxaDistribuicao : taxaInit
        )
      } else {
        //vai pegar a taxa de distribuicao
        UsuarioService.getProfile()
          .then(respUsuario => {
            console.log('respUsuario', respUsuario)
            let taxaGestor = taxaInit

            console.log('taxaInit', taxaInit)

            if (respUsuario) {
              //se o usuaro tem uma taxa de distribuição entao eu pego ela
              if (respUsuario.taxaDistribuicao && respUsuario.taxaDistribuicao > 0) {
                taxaGestor = respUsuario.taxaDistribuicao > taxaInit ? taxaInit : respUsuario.taxaDistribuicao
              } else {
                //se a taxa de distribuição do usuario é zero, então ele é um colaborador e eu preciso pegar a taxa do gestor dele
                if (respUsuario.gestor) {
                  if (respUsuario.gestor.taxaDistribuicao && respUsuario.gestor.taxaDistribuicao > 0) {
                    taxaGestor =
                      respUsuario.gestor.taxaDistribuicao > taxaInit ? taxaInit : respUsuario.gestor.taxaDistribuicao
                  }
                }
              }
            }

            console.log('taxaGestor', taxaGestor)
            setMaxTaxa(taxaGestor)
          })
          .catch(err => {
            const msgErro = trataErro(err)

            toast.error(msgErro)
          })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (usuarioEquipe && usuarioEquipe.token) {
      setConfiguracoesUsuario({
        ...configuracoesUsuario,
        taxaDistribuicao: usuarioEquipe.taxaDistribuicao
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maxTaxa])

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card className='relative'>
          <form onSubmit={e => e.preventDefault()}>
            <CardHeader title={`Configurações do ${getPerfilUsuarioEnumDesc(usuarioEquipe?.perfil)}`} />
            <CardContent className='flex flex-col gap-4'>
              <Grid container spacing={5}>
                <Grid item xs={12} sm={12}>
                  <Typography className='font-medium'>
                    Taxa de distribuição: <b>{configuracoesUsuario?.taxaDistribuicao}%</b>
                  </Typography>
                  <Slider
                    key={`slider-${configuracoesUsuario?.taxaDistribuicao}`} /* fixed issue */
                    marks={taxaContratoMarks}
                    min={0}
                    max={maxTaxa}
                    step={0.1}
                    defaultValue={configuracoesUsuario?.taxaDistribuicao || 0}
                    valueLabelDisplay='auto'
                    aria-labelledby='continuous-slider'
                    onChangeCommitted={(e, value) => handleSlideChange(e, value)}
                  />
                </Grid>
                {usuarioEquipe?.perfil === PerfilUsuarioEnum.PARCEIRO && (
                  <Grid item xs={12} sm={6}>
                    <label>Este usuário pode criar equipe?</label>
                    <RadioGroup
                      row
                      name='radio-buttons-group'
                      value={configuracoesUsuario.podeCriarEquipe ? 1 : 0}
                      onChange={e =>
                        setConfiguracoesUsuario({
                          ...configuracoesUsuario,
                          podeCriarEquipe: e.target.value == '1' ? true : false
                        })
                      }
                    >
                      <FormControlLabel
                        value='0'
                        control={<Radio />}
                        label='Não'
                        disabled={
                          (configuracoesUsuario.taxaDistribuicao &&
                            configuracoesUsuario.taxaDistribuicao < TaxasEnum.MAXIMO_CONSULTOR - 1) ||
                          false
                        }
                      />
                      <FormControlLabel
                        value='1'
                        control={<Radio />}
                        label='Sim'
                        disabled={
                          (configuracoesUsuario.taxaDistribuicao &&
                            configuracoesUsuario.taxaDistribuicao < TaxasEnum.MAXIMO_CONSULTOR - 1) ||
                          false
                        }
                      />
                    </RadioGroup>
                  </Grid>
                )}
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
            onClick={handleSubmit}
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
            {activeStep === steps.length - 1 ? 'Salvar usuário' : 'Próximo'}
          </Button>
        </div>
      </Grid>
    </Grid>
  )
}

export default ConfiguracoesUsuario
