// React Imports
import { useEffect, useState } from 'react'
import type { SyntheticEvent } from 'react'

import Grid from '@mui/material/Grid'
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabPanel from '@mui/lab/TabPanel'

// Component Imports

import { Backdrop, CircularProgress } from '@mui/material'

import CustomTabList from '@core/components/mui/TabList'
import ClientePageHeader from '../components/ClientePageHeader'
import { clienteDocumentacaoInit, clienteInit } from '@/types/ClienteType'
import type { ClienteDocumentacaoType, ClienteType } from '@/types/ClienteType'
import { getCliente } from '@/services/ClienteService'

import Identificacao from '@/views/cliente/components/identificacao/'
import DocumentacaoTab from '@/views/cliente/view/documentacao'
import ContratosTab from '@/views/cliente/view/contratos'
import { useClienteContext } from '@/contexts/ClienteContext'
import DadosBancarios from './dadosBancarios'

interface Props {
  params: { token: string }
}

const ClientePage = ({ params }: Props) => {
  // States
  const [activeTab, setActiveTab] = useState('identificacao')
  const [clienteData, setClienteData] = useState<ClienteType>(clienteInit)
  const [documentacaoData, setDocumentacaoData] = useState<ClienteDocumentacaoType>(clienteDocumentacaoInit)
  const [reload, setReload] = useState(true)

  const { setClienteContext } = useClienteContext()

  const handleChange = (event: SyntheticEvent, value: string) => {
    setActiveTab(value)
  }

  useEffect(() => {
    getCliente(params.token)
      .then(respCliente => {
        setClienteData(respCliente)
        setClienteContext(respCliente)
        console.log('respCliente', respCliente)

        setDocumentacaoData({
          token: respCliente.token ? respCliente.token : '',
          docIdentidade: respCliente.docIdentidade,
          compResidencia: respCliente.compResidencia,
          compFinanceiro: respCliente.compFinanceiro
        })

        setReload(false)
      })
      .catch(err => {
        setReload(false)
        console.log('ERRO RESP', err)
      })
  }, [])

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <ClientePageHeader />
      </Grid>
      <Grid item xs={12} className='flex flex-col gap-6'>
        <TabContext value={activeTab}>
          <Grid container spacing={6}>
            <Grid item xs={12}>
              <CustomTabList onChange={handleChange} variant='scrollable' pill='true'>
                <Tab
                  icon={<i className='tabler-users' />}
                  value='identificacao'
                  label='Dados pessoais'
                  iconPosition='start'
                />
                <Tab
                  icon={<i className='tabler-building-bank' />}
                  value='dadosBancarios'
                  label='Dados bancários'
                  iconPosition='start'
                />
                <Tab
                  icon={<i className='tabler-id-badge-2' />}
                  value='documentacao'
                  label='Documentação'
                  iconPosition='start'
                />
                <Tab
                  icon={<i className='tabler-briefcase' />}
                  value='contratos'
                  label='Contratos'
                  iconPosition='start'
                />
              </CustomTabList>
            </Grid>
            <Grid item xs={12}>
              <TabPanel value='identificacao' className='p-0'>
                <Identificacao />
              </TabPanel>
              <TabPanel value='dadosBancarios' className='p-0'>
                <DadosBancarios />
              </TabPanel>
              <TabPanel value='documentacao' className='p-0'>
                <DocumentacaoTab documentacaoData={documentacaoData} />
              </TabPanel>
              <TabPanel value='contratos' className='p-0'>
                <ContratosTab tokenCliente={clienteData.token} />
              </TabPanel>
            </Grid>
          </Grid>
        </TabContext>
      </Grid>
      <Backdrop open={reload} className='absolute text-white z-[cal(var(--mui-zIndex-mobileStepper)-1)]'>
        <CircularProgress color='inherit' />
      </Backdrop>
    </Grid>
  )
}

export default ClientePage
