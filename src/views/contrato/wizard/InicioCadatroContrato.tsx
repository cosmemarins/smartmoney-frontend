// React Imports
import { useEffect, useState, type ChangeEvent } from 'react'

import { useRouter } from 'next/navigation'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import Divider from '@mui/material/Divider'

import moment, { locale } from 'moment'
import 'moment/locale/pt-br'

// Component Imports
import {
  Backdrop,
  Button,
  CardActions,
  CircularProgress,
  FormLabel,
  FormControlLabel,
  Link,
  Typography,
  Radio
} from '@mui/material'
import RadioGroup from '@mui/material/RadioGroup'

import { toast } from 'react-toastify'

import CustomTextField from '@core/components/mui/TextField'
import type { ClienteType } from '@/types/ClienteType'
import { cpfCnpjMask } from '@/utils/string'
import type { erroType } from '@/types/utilTypes'
import { salvarCliente } from '@/services/ClienteService'

import { useClienteContext } from '@/contexts/ClienteContext'
import DirectionalIcon from '@/components/DirectionalIcon'
import ClienteTable from '@/components/ClienteTable'

locale('pt-br')

type Props = {
  activeStep: number
  handleNext: () => void
  handlePrev: () => void
  steps: { title: string; subtitle: string }[]
}

//const initialData: IdentificacaoType = { cep: '' }

// const status = ['Status', 'Active', 'Inactive', 'Suspended']

const InicioCadatroContrato = ({ activeStep, handleNext, handlePrev, steps }: Props) => {
  const { cliente, setClienteContext, loading, setLoadingContext } = useClienteContext()

  const [ehCliente, setEhCliente] = useState('NAO')

  const handleSelect = (itemSelect: ClienteType) => {
    setClienteContext(itemSelect)
    handleNext()
  }

  const handleNovoCliente = () => {
    setClienteContext({})
    handleNext()
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card className='relative'>
          <CardHeader title='Inicio do Cadastro de Contrato' />
          <CardContent className='flex flex-col gap-4'>
            <Typography color='text.primary' className='font-medium'>
              O cliente para este novo contrato já está cadastrado no sistema?
            </Typography>
            <Grid item xs={12}>
              <RadioGroup row name='radio-buttons-group' value={ehCliente} onChange={e => setEhCliente(e.target.value)}>
                <FormControlLabel
                  value='NAO'
                  control={<Radio />}
                  label='Não, eu quero cadastrar um novo cliente agora'
                />
                <FormControlLabel value='SIM' control={<Radio />} label='Sim, é um cliente já cadastrado' />
              </RadioGroup>
            </Grid>
            {ehCliente === 'SIM' ? (
              <Grid container spacing={6}>
                <Grid item xs={12}>
                  <ClienteTable handleSelect={handleSelect} />
                </Grid>
              </Grid>
            ) : (
              <Button
                variant='contained'
                color={activeStep === steps.length - 1 ? 'success' : 'primary'}
                endIcon={<i className='tabler-edit' />}
                onClick={handleNovoCliente}
              >
                Iniciar
              </Button>
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default InicioCadatroContrato
