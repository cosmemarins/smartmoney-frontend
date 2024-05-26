'use client'

// React Imports
import { useState } from 'react'
import type { SyntheticEvent } from 'react'

import Grid from '@mui/material/Grid'
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabPanel from '@mui/lab/TabPanel'

// Component Imports

import CustomTabList from '@core/components/mui/TabList'
import ClientePageHeader from '../components/ClientePageHeader'

import Identificacao from '@/views/cliente/edit/identificacao'
import DocumentacaoTab from '@/views/cliente/edit/documentacao'
import ContratosTab from '@/views/cliente/edit/contratos'
import DadosBancarios from './dadosBancarios'
import { useClienteContext } from '@/contexts/ClienteContext'
import { ContratoProvider } from '@/contexts/ContratoContext'

const ClienteEdit = () => {
  // States
  const [activeTab, setActiveTab] = useState('identificacao')

  const { cliente } = useClienteContext()

  const handleChange = (event: SyntheticEvent, value: string) => {
    setActiveTab(value)
  }

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
                {cliente?.token && (
                  <Tab
                    icon={<i className='tabler-building-bank' />}
                    value='dadosBancarios'
                    label='Dados bancários'
                    iconPosition='start'
                  />
                )}
                {cliente?.token && (
                  <Tab
                    icon={<i className='tabler-id-badge-2' />}
                    value='documentacao'
                    label='Documentação'
                    iconPosition='start'
                  />
                )}
                {cliente?.token && (
                  <Tab
                    icon={<i className='tabler-briefcase' />}
                    value='contratos'
                    label='Contratos'
                    iconPosition='start'
                  />
                )}
              </CustomTabList>
            </Grid>
            <Grid item xs={12}>
              <TabPanel value='identificacao' className='p-0'>
                <Identificacao />
              </TabPanel>
              {cliente?.token && (
                <TabPanel value='dadosBancarios' className='p-0'>
                  <DadosBancarios />
                </TabPanel>
              )}
              {cliente?.token && (
                <TabPanel value='documentacao' className='p-0'>
                  <DocumentacaoTab />
                </TabPanel>
              )}
              {cliente?.token && (
                <TabPanel value='contratos' className='p-0'>
                  <ContratoProvider>
                    <ContratosTab />
                  </ContratoProvider>
                </TabPanel>
              )}
            </Grid>
          </Grid>
        </TabContext>
      </Grid>
    </Grid>
  )
}

export default ClienteEdit
