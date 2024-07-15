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

import { ContratoProvider, useContratoContext } from '@/contexts/ContratoContext'
import DadosEmpresa from './DadosEmpresa'
import DadosSocio from './DadosSocio'
import EnderecoEmpresa from './EnderecoEmpresa'
import DadosBancariosEmpresa from './DadosBancariosEmpresa'

// Styled Component Imports
import StepperWrapper from '@core/styles/stepper'
import InicioCadatroParceiro from './InicioCadatroParceiro'

import { useParceiroContext } from '@/contexts/ParceiroContext'
import ConfiguracoesParceiro from './ConfiguracoesParceiro'
import FinalizarCadastroParceiro from './FinalizarCadastroParceiro'

// Vars
const steps = [
  {
    icon: 'tabler-arrow-big-down-lines',
    title: 'Início',
    subtitle: 'Indentifique o parceiro'
  },
  {
    icon: 'tabler-building',
    title: 'Passo 1 - Dados da Empresa',
    subtitle: 'Informe os dados empresariais do parceiro'
  },
  {
    icon: 'tabler-map',
    title: 'Passo 2 - Endereço do Parceiro',
    subtitle: 'Informe o endereço do parceiro'
  },
  {
    icon: 'tabler-credit-card',
    title: 'Passo 3 - Dados bancários do parceiro',
    subtitle: 'Informe os dados bancários do parceiro'
  },
  {
    icon: 'tabler-user',
    title: 'Passo 4 - Dados do Sócio Responsável',
    subtitle: 'Informe os dados do sócio responsável'
  },
  {
    icon: 'tabler-checkbox',
    title: 'Passo 5 - Configurações de taxas e outros',
    subtitle: 'Informe o valor da taxa de trabalho do parceiro'
  },
  {
    icon: 'tabler-send',
    title: 'Passo 6 - Finalizar cadastro',
    subtitle: 'Defina uma senha de acesso e avise o parceiro'
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
      ? InicioCadatroParceiro
      : step === 1
        ? DadosEmpresa
        : step === 2
          ? EnderecoEmpresa
          : step === 3
            ? DadosBancariosEmpresa
            : step === 4
              ? DadosSocio
              : step === 5
                ? ConfiguracoesParceiro
                : FinalizarCadastroParceiro

  return <Tag activeStep={step} handleNext={handleNext} handlePrev={handlePrev} steps={steps} />
}

const UsuarioPage = () => {
  // States
  const [activeStep, setActiveStep] = useState(0)

  //hooks
  const { parceiro } = useParceiroContext()
  const { contrato } = useContratoContext()

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
    console.log('entrada: ', index)

    switch (index) {
      case 1:
        index = parceiro?.token ? index : 0
        break
      case 2:
        index = parceiro?.token ? index : 0
        break
      case 3:
        index = parceiro?.token && parceiro.cep ? index : stepAnterior
        break
      case 4:
        index = parceiro?.token && parceiro.cep ? index : stepAnterior
        break
      case 5:
        index = parceiro?.token && parceiro.cep ? index : stepAnterior
        break
      case 6:
        index = contrato?.token ? index : stepAnterior
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
      <ContratoProvider>
        <CardContent className='flex-1 pbs-6'>{getStepContent(activeStep, handleNext, handlePrev)}</CardContent>
      </ContratoProvider>
    </Card>
  )
}

export default UsuarioPage
