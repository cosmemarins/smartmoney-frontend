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

import ParceiroService from '@/services/ParceiroService'

import { useParceiroContext } from '@/contexts/ParceiroContext'
import { trataErro } from '@/utils/erro'
import type { ConfiguracoesParceiroType } from '@/types/ConfiguracoesParceiroType'
import DirectionalIcon from '@/components/DirectionalIcon'
import { taxaContratoMarks } from '@/types/ContratoType'

type Props = {
  activeStep: number
  handleNext: () => void
  handlePrev: () => void
  steps: { title: string; subtitle: string }[]
}

const ConfiguracoesParceiro = ({ activeStep, handleNext, handlePrev, steps }: Props) => {
  // States
  const [configuracoesParceiro, setConfiguracoesParceiro] = useState<ConfiguracoesParceiroType>({
    podeCriarEquipe: false
  })

  const [sending, setSending] = useState<boolean>(false)

  const { parceiro, setParceiroContext } = useParceiroContext()

  const handleSubmit = () => {
    if (parceiro && parceiro.token && configuracoesParceiro) {
      setSending(true)
      ParceiroService.salvarConfiguracoes(parceiro.token, configuracoesParceiro)
        .then(respParceiro => {
          setParceiroContext(respParceiro)
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
    }
  }

  function handleSlideChange(event: any, sliderValue: number | number[]) {
    //console.log(event.target.value)
    //console.log(sliderValue)

    if (typeof sliderValue === 'number') {
      if (sliderValue < 5) {
        setConfiguracoesParceiro({
          ...configuracoesParceiro,
          taxaDistribuicao: sliderValue,
          podeCriarEquipe: false
        })
      } else {
        setConfiguracoesParceiro({
          ...configuracoesParceiro,
          taxaDistribuicao: sliderValue
        })
      }
    }

    /*
    if (typeof sliderValue === "number") {
      const newEndDate = getCloseDate({
        date: addDays(startDate, sliderValue),
      });
      setEndDate(newPayoutDate); // set the state
    }
      */
  }

  useEffect(() => {
    if (parceiro && parceiro.token) {
      setConfiguracoesParceiro({
        id: parceiro.id,
        token: parceiro.token,
        taxaDistribuicao: parceiro.taxaDistribuicao,
        podeCriarEquipe: parceiro.taxaDistribuicao && parceiro.taxaDistribuicao < 5 ? false : parceiro.podeCriarEquipe
      })
    }
  }, [parceiro])

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card className='relative'>
          <form onSubmit={e => e.preventDefault()}>
            <CardHeader title='Configurações do parceiro' />
            <CardContent className='flex flex-col gap-4'>
              <Grid container spacing={5}>
                <Grid item xs={12} sm={12}>
                  <Typography className='font-medium'>
                    Taxa de distribuição: <b>{configuracoesParceiro?.taxaDistribuicao}%</b>
                  </Typography>
                  <Slider
                    key={`slider-${configuracoesParceiro?.taxaDistribuicao}`} /* fixed issue */
                    marks={taxaContratoMarks}
                    min={0}
                    max={5}
                    step={0.1}
                    defaultValue={configuracoesParceiro?.taxaDistribuicao || 1}
                    valueLabelDisplay='auto'
                    aria-labelledby='continuous-slider'
                    onChangeCommitted={(e, value) => handleSlideChange(e, value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <label>Este parceiro pode criar equipe?</label>
                  <RadioGroup
                    row
                    name='radio-buttons-group'
                    value={configuracoesParceiro.podeCriarEquipe ? 1 : 0}
                    onChange={e =>
                      setConfiguracoesParceiro({
                        ...configuracoesParceiro,
                        podeCriarEquipe: e.target.value == '1' ? true : false
                      })
                    }
                  >
                    <FormControlLabel
                      value='0'
                      control={<Radio />}
                      label='Não'
                      disabled={
                        (configuracoesParceiro.taxaDistribuicao && configuracoesParceiro.taxaDistribuicao < 5) || false
                      }
                    />
                    <FormControlLabel
                      value='1'
                      control={<Radio />}
                      label='Sim'
                      disabled={
                        (configuracoesParceiro.taxaDistribuicao && configuracoesParceiro.taxaDistribuicao < 5) || false
                      }
                    />
                  </RadioGroup>
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
            {activeStep === steps.length - 1 ? 'Salvar Parceiro' : 'Próximo'}
          </Button>
        </div>
      </Grid>
    </Grid>
  )
}

export default ConfiguracoesParceiro
