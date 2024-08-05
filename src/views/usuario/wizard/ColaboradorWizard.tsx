'use client'

import { useState } from 'react'

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

import CustomAvatar from '@core/components/mui/Avatar'

import DadosUsuario from './DadosUsuario'
import EnderecoUsuario from './EnderecoUsuario'

// Styled Component Imports
import StepperWrapper from '@core/styles/stepper'
import InicioCadatroUsuario from './InicioCadatroUsuario'

import { useEquipeContext } from '@/contexts/EquipeContext'
import FinalizarCadastroUsuario from './FinalizarCadastroUsuario'

// Vars
const steps = [
  {
    icon: 'tabler-arrow-big-down-lines',
    title: 'Início',
    subtitle: 'Indentifique o colaborador'
  },
  {
    icon: 'tabler-user',
    title: 'Passo 1 - Dados do colaborador',
    subtitle: 'Informe os dados do colaborador'
  },
  {
    icon: 'tabler-map',
    title: 'Passo 2 - Endereço do colaborador',
    subtitle: 'Informe o endereço do colaborador'
  },
  {
    icon: 'tabler-send',
    title: 'Passo 3 - Finalizar cadastro',
    subtitle: 'Defina uma senha de acesso e avise o colaborador'
  }
]

const Step = styled(MuiStep)<StepProps>({
  '&.Mui-completed .step-title , &.Mui-completed .step-subtitle': {
    color: 'var(--mui-palette-text-disabled)'
  }
})

let stepAnterior = 0

const getStepContent = (step: number, handleNext: () => void, handlePrev: () => void) => {
  const Tag =
    step === 0
      ? InicioCadatroUsuario
      : step === 1
        ? DadosUsuario
        : step === 2
          ? EnderecoUsuario
          : FinalizarCadastroUsuario

  return <Tag activeStep={step} handleNext={handleNext} handlePrev={handlePrev} steps={steps} />
}

const ColaboradorWizard = () => {
  //hooks
  const { usuarioEquipe } = useEquipeContext()

  // States
  const [activeStep, setActiveStep] = useState(0)

  const handleNext = () => {
    if (activeStep !== steps.length - 1) {
      setActiveStep(activeStep + 1)
    } else {
      //alert('Submitted..!!')
    }
  }

  const handlePrev = () => {
    if (activeStep !== 0) {
      setActiveStep(activeStep - 1)
    }
  }

  const handleStep = (index: number) => {
    switch (index) {
      case 1:
        index = usuarioEquipe?.token ? index : 0
        break
      case 2:
        index = usuarioEquipe?.token ? index : 0
        break
      case 3:
        index = usuarioEquipe?.token && usuarioEquipe.cep ? index : stepAnterior
        break
      default:
        index = 0
    }

    stepAnterior = index

    setActiveStep(index)
  }

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
                <Step key={index} onClick={() => handleStep(index)}>
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

export default ColaboradorWizard
