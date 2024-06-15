'use client'

import { useEffect, useState } from 'react'

// MUI Imports
import { styled } from '@mui/material/styles'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Stepper from '@mui/material/Stepper'
import MuiStep from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import Typography from '@mui/material/Typography'
import type { StepProps } from '@mui/material/Step'

// Third-party Imports
import classnames from 'classnames'

import axios from 'axios'

import CustomAvatar from '@core/components/mui/Avatar'

import DadosCliente from './DadosCliente'
import EnderecoCliente from './EnderecoCliente'
import DadosBancariosCliente from './DadosBancariosCliente'
import Documentacao from './documentacao'
import ContratoCliente from './ContratoCliente'
import { getCliente } from '@/services/ClienteService'
import { useClienteContext } from '@/contexts/ClienteContext'
import type { ValidationError } from '@/services/api'

// Styled Component Imports
import StepperWrapper from '@core/styles/stepper'
import InicioCadatroContrato from './InicioCadatroContrato'

interface Props {
  token: string | undefined
}

// Vars
const steps = [
  {
    icon: 'tabler-arrow-big-down-lines',
    title: 'Início',
    subtitle: 'Indentifique o cliente ou cadastre um novo'
  },
  {
    icon: 'tabler-user',
    title: 'Passo 1 - Dados Pessoais do Cliente',
    subtitle: 'Informe os dados do cliente para este novo contrato'
  },
  {
    icon: 'tabler-id',
    title: 'Passo 2 - Endereço do Cliente',
    subtitle: 'Informe o endereço do cliente'
  },
  {
    icon: 'tabler-credit-card',
    title: 'Passo 3 - Dados bancários do Cliente',
    subtitle: 'Informe os dados bancários do cliente'
  },
  {
    icon: 'tabler-id',
    title: 'Passo 4 - Documentação do Cliente',
    subtitle: 'Envie a documentação para habilitar o cliente'
  },
  {
    icon: 'tabler-checkbox',
    title: 'Passo 5 - Dados do contrato',
    subtitle: 'Informe os dados para o novo contrato'
  }
]

const Step = styled(MuiStep)<StepProps>({
  '&.Mui-completed .step-title , &.Mui-completed .step-subtitle': {
    color: 'var(--mui-palette-text-disabled)'
  }
})

const getStepContent = (step: number, handleNext: () => void, handlePrev: () => void) => {
  const Tag =
    step === 0
      ? InicioCadatroContrato
      : step === 1
        ? DadosCliente
        : step === 2
          ? EnderecoCliente
          : step === 3
            ? DadosBancariosCliente
            : step === 4
              ? Documentacao
              : ContratoCliente

  return <Tag activeStep={step} handleNext={handleNext} handlePrev={handlePrev} steps={steps} />
}

const ContratoPage = ({ token }: Props) => {
  // States
  const [activeStep, setActiveStep] = useState(0)
  const { setClienteContext, setLoadingContext } = useClienteContext()

  const handleNext = () => {
    console.log('proximo: ', activeStep)

    if (activeStep !== steps.length - 1) {
      setActiveStep(activeStep + 1)
    } else {
      alert('Submitted..!!')
    }
  }

  const handlePrev = () => {
    if (activeStep !== 0) {
      setActiveStep(activeStep - 1)
    }
  }

  useEffect(() => {
    if (token) {
      setLoadingContext(true)

      getCliente(token)
        .then(respCliente => {
          setClienteContext(respCliente)
          console.log('respCliente', respCliente)
        })
        .catch(err => {
          if (axios.isAxiosError<ValidationError, Record<string, unknown>>(err)) {
            console.log(err.status)
            console.error(err.response)
          } else {
            console.error(err)
          }
        })
        .finally(() => {
          setLoadingContext(false)
        })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Card className='flex flex-col md:flex-row'>
      <CardContent className='max-md:border-be md:border-ie md:min-is-[300px]'>
        <StepperWrapper>
          <Stepper
            activeStep={activeStep}
            orientation='vertical'
            connector={<></>}
            className='flex flex-col gap-4 min-is-[220px]'
          >
            {steps.map((label, index) => {
              return (
                <Step key={index} onClick={() => setActiveStep(index)}>
                  <StepLabel icon={<></>} className='p-1 cursor-pointer'>
                    <div className='step-label'>
                      <CustomAvatar
                        variant='rounded'
                        skin={activeStep === index ? 'filled' : 'light'}
                        {...(activeStep >= index && { color: 'primary' })}
                        {...(activeStep === index && { className: 'shadow-primarySm' })}
                        size={38}
                      >
                        <i className={classnames(label.icon as string, '!text-[22px]')} />
                      </CustomAvatar>
                      <div className='flex flex-col'>
                        <Typography color='text.primary' className='step-title'>
                          {label.title}
                        </Typography>
                        <Typography className='step-subtitle'>{label.subtitle}</Typography>
                      </div>
                    </div>
                  </StepLabel>
                </Step>
              )
            })}
          </Stepper>
        </StepperWrapper>
      </CardContent>

      <CardContent className='flex-1 pbs-6'>{getStepContent(activeStep, handleNext, handlePrev)}</CardContent>
    </Card>
  )
}

export default ContratoPage
