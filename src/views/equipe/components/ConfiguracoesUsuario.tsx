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
import CustomTextField from '@/@core/components/mui/TextField'

type Props = {
  activeStep: number
  handleNext: () => void
  handlePrev: () => void
  steps: { title: string; subtitle: string }[]
}

const ConfiguracoesUsuario = ({ activeStep, handleNext, handlePrev, steps }: Props) => {
  //contexto
  const { usuarioEquipe, setUsuarioEquipeContext } = useEquipeContext()

  //console.log('usuarioEquipe', usuarioEquipe)

  const taxaInit =
    usuarioEquipe?.perfil === PerfilUsuarioEnum.AGENTE ? TaxasEnum.MAXIMO_AGENTE : TaxasEnum.MAXIMO_CONSULTOR

  // States
  const [configuracoesUsuario, setConfiguracoesUsuario] = useState<ConfiguracoesUsuarioType>({
    id: usuarioEquipe?.id,
    token: usuarioEquipe?.token,
    taxaDistribuicao: usuarioEquipe?.taxaDistribuicao || 0,
    faixasDistribuicao: usuarioEquipe?.faixasDistribuicao || '2|10000',
    podeCriarEquipe: usuarioEquipe?.podeCriarEquipe ? true : false
  })

  const [sending, setSending] = useState<boolean>(false)
  const [maxTaxa, setMaxTaxa] = useState<number>(Number(taxaInit))
  const [faixas, setFaixas] = useState(['faixa'])

  const [faixaTaxa, setFaixaTaxa] = useState([0])
  const [faixaValor, setFaixaValor] = useState([0])

  const handleAddFaixa = () => {
    const current = [...faixas]
    const currentFaixaTaxa = [...faixaTaxa]
    const currentFaixaValor = [...faixaValor]

    current.push('faixa')
    currentFaixaTaxa.push(0)
    currentFaixaValor.push(0)

    setFaixas(current)
    setFaixaTaxa(currentFaixaTaxa)
    setFaixaValor(currentFaixaValor)
  }

  const handleRemoveFaixa = () => {
    if (faixas.length === 1) return

    const current = [...faixas]
    const currentFaixaTaxa = [...faixaTaxa]
    const currentFaixaValor = [...faixaValor]

    current.pop()
    currentFaixaTaxa.pop()
    currentFaixaValor.pop()

    setFaixas(current)
    setFaixaTaxa(currentFaixaTaxa)
    setFaixaValor(currentFaixaValor)
  }

  const onChangeValor = (index: number, value: string) => {
    const valorStr = value.replace(/[^\d]+/g, '')
    const valor = parseFloat(valorStr) / 100
    const currentFaixaValor = [...faixaValor]

    currentFaixaValor[index] = valor || 0
    setFaixaValor(currentFaixaValor)
  }

  const onChangeTaxa = (index: number, value: string) => {
    const valorStr = value.replace(/[^\d]+/g, '')
    const valor = parseFloat(valorStr) / 100
    const currentFaixaTaxa = [...faixaTaxa]

    currentFaixaTaxa[index] = valor || 0
    setFaixaTaxa(currentFaixaTaxa)
  }

  const handleSubmit = () => {
    if (usuarioEquipe && usuarioEquipe.token && configuracoesUsuario) {
      if (configuracoesUsuario.taxaDistribuicao && configuracoesUsuario.taxaDistribuicao > 0) {
        //confere as taxas
        let taxaAnterior = 0
        let maiorTaxa = 0
        let erroTaxa = undefined

        //TODO: é preciso fazer este teste lá no inicio da inclusão de um agente
        if (!faixaTaxa) toast.error('É preciso configurar uma faixa de taxas para este parceiro')

        faixaTaxa.forEach(taxa => {
          if (taxa === 0) erroTaxa = 'Taxa não pode ser zero'
          if (taxa < taxaAnterior) erroTaxa = 'taxa não pode ser menor que a taxa anerior'
          if (taxa > maiorTaxa) maiorTaxa = taxa
          taxaAnterior = taxa
        })

        if (maiorTaxa > configuracoesUsuario?.taxaDistribuicao) {
          erroTaxa = 'A taixa não pode ser maior que a taxa de distribuição'
        }

        if (erroTaxa) {
          toast.error(erroTaxa)

          return
        }

        //confere os valores
        let index = 0
        let valorAnterior = 0
        let erroValor = undefined

        faixaValor.forEach(valor => {
          if (valor === 0 && index > 0) erroValor = 'Valor não pode ser zero'
          if (valor < valorAnterior) erroValor = 'Valor não pode ser menor que o valor anerior'
          valorAnterior = valor
          index++
        })

        if (erroValor) {
          toast.error(erroValor)

          return
        }

        const faixasDistribuicao = `${faixaTaxa.join(';')}|${faixaValor.join(';')}`

        setSending(true)
        UsuarioService.salvarConfiguracoes({
          ...configuracoesUsuario,
          faixasDistribuicao
        })
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
          taxaDistribuicao: sliderValue

          //retirado controle de criacao de equipe
          //podeCriarEquipe: false
        })
      } else {
        setConfiguracoesUsuario({
          ...configuracoesUsuario,
          taxaDistribuicao: sliderValue
        })
      }
    }
  }

  function distFaixas(strFaixas: string | undefined) {
    const faixasStrArray = strFaixas ? strFaixas.split('|') : ['0', '0']

    const taxas = faixasStrArray[0].split(';').map(e => Number(e))
    const valores = faixasStrArray[1].split(';').map(e => Number(e))

    setFaixaTaxa(taxas)
    setFaixaValor(valores)
    setFaixas(faixasStrArray[0].split(';'))
  }

  useEffect(() => {
    //console.log('usuarioEquipe', usuarioEquipe)

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

      //se ver setada então pega faixas de distribuicao do proprio usuario
      if (usuarioEquipe.faixasDistribuicao) distFaixas(usuarioEquipe.faixasDistribuicao)

      //define a taxa de distribuicao
      if (usuarioEquipe.gestor?.taxaDistribuicao) {
        setMaxTaxa(
          usuarioEquipe.gestor?.taxaDistribuicao < taxaInit ? usuarioEquipe.gestor?.taxaDistribuicao : taxaInit
        )
      } else {
        //vai pegar a taxa e a faixa de distribuicao
        UsuarioService.getProfile()
          .then(respUsuario => {
            console.log('respUsuario', respUsuario)
            let taxaGestor = taxaInit

            console.log('taxaInit', taxaInit)

            if (respUsuario) {
              //se a faixa de distribuicao não tiver sido setada ainda então eu pego do banco ou do gestor
              if (!usuarioEquipe.faixasDistribuicao) {
                console.log('usuarioEquipe.faixasDistribuicao')
                distFaixas(
                  respUsuario.faixasDistribuicao
                    ? respUsuario.faixasDistribuicao
                    : respUsuario.gestor?.faixasDistribuicao
                )
              }

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

  useEffect(() => {
    if (usuarioEquipe && usuarioEquipe.token) {
      const faixasDistribuicao = `${faixaTaxa.join(';')}|${faixaValor.join(';')}`

      setConfiguracoesUsuario({
        ...configuracoesUsuario,
        faixasDistribuicao
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [faixaTaxa, faixaValor])

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

                        //retirado controle de criacao de equipe
                        //disabled={
                        //  (configuracoesUsuario.taxaDistribuicao &&
                        //    configuracoesUsuario.taxaDistribuicao < TaxasEnum.MAXIMO_CONSULTOR - 1) ||
                        //  false
                        //}
                      />
                      <FormControlLabel
                        value='1'
                        control={<Radio />}
                        label='Sim'

                        //retirado controle de criacao de equipe
                        //disabled={
                        //  (configuracoesUsuario.taxaDistribuicao &&
                        //    configuracoesUsuario.taxaDistribuicao < TaxasEnum.MAXIMO_CONSULTOR - 1) ||
                        //  false
                        //}
                      />
                    </RadioGroup>
                  </Grid>
                )}
                {usuarioEquipe?.perfil === PerfilUsuarioEnum.PARCEIRO && (
                  <>
                    <Grid item xs={12} sm={12}>
                      <Typography className='font-medium'>Faixa de distribuição:</Typography>
                    </Grid>
                    {faixas.map((currentItem, index) => {
                      return (
                        <Grid key={index} item xs={12} sm={12}>
                          <Grid container spacing={4}>
                            <Grid item xs={6} sm={6}>
                              <CustomTextField
                                name='taxa'
                                fullWidth
                                label='Taxa'
                                placeholder='Taxa'
                                value={
                                  faixaTaxa[index]
                                    ? faixaTaxa[index].toLocaleString('pt-BR', {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2
                                      })
                                    : 0
                                }
                                onChange={e => onChangeTaxa(index, e.target.value)}
                              />
                            </Grid>
                            <Grid item xs={6} sm={6}>
                              <CustomTextField
                                name='valor'
                                fullWidth
                                label='Valor Mínimo'
                                placeholder='valor'
                                disabled={index === 0}
                                value={
                                  faixaValor[index]
                                    ? faixaValor[index].toLocaleString('pt-BR', {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2
                                      })
                                    : 0
                                }
                                onChange={e => onChangeValor(index, e.target.value)}
                              />
                            </Grid>
                          </Grid>
                        </Grid>
                      )
                    })}
                    <Grid item xs={12} sm={12}>
                      <Grid container>
                        <Button
                          variant='contained'
                          color='primary'
                          onClick={handleRemoveFaixa}
                          startIcon={<i className='tabler-minus' />}
                        >
                          Excluir Última Faixa
                        </Button>
                        <Button
                          variant='contained'
                          color='primary'
                          onClick={handleAddFaixa}
                          className='ml-1'
                          startIcon={<i className='tabler-plus' />}
                        >
                          Incluir Faixa
                        </Button>
                      </Grid>
                    </Grid>
                  </>
                )}
              </Grid>
            </CardContent>
            <Divider />
            <CardActions>
              {steps.length === 0 && (
                <Button variant='contained' onClick={handleSubmit}>
                  Salvar
                </Button>
              )}
            </CardActions>
          </form>
        </Card>
      </Grid>
      {steps.length > 0 && (
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
      )}
    </Grid>
  )
}

export default ConfiguracoesUsuario
