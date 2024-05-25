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
import UsuarioPageHeader from '../components/UsuarioPageHeader'

import Identificacao from './identificacao'
import DocumentacaoTab from './documentacao'
import DadosBancarios from './dadosBancarios'
import { useUsuarioContext } from '@/contexts/UsuarioContext'

const UsuarioEdit = () => {
  // States
  const [activeTab, setActiveTab] = useState('identificacao')

  const { usuario } = useUsuarioContext()

  const handleChange = (event: SyntheticEvent, value: string) => {
    setActiveTab(value)
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <UsuarioPageHeader />
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
                {usuario?.token && (
                  <Tab
                    icon={<i className='tabler-building-bank' />}
                    value='dadosBancarios'
                    label='Dados bancários'
                    iconPosition='start'
                  />
                )}
                {usuario?.token && (
                  <Tab
                    icon={<i className='tabler-id-badge-2' />}
                    value='documentacao'
                    label='Documentação'
                    iconPosition='start'
                  />
                )}
              </CustomTabList>
            </Grid>
            <Grid item xs={12}>
              <TabPanel value='identificacao' className='p-0'>
                <Identificacao />
              </TabPanel>
              {usuario?.token && (
                <TabPanel value='dadosBancarios' className='p-0'>
                  <DadosBancarios />
                </TabPanel>
              )}
              {usuario?.token && (
                <TabPanel value='documentacao' className='p-0'>
                  <DocumentacaoTab />
                </TabPanel>
              )}
            </Grid>
          </Grid>
        </TabContext>
      </Grid>
    </Grid>
  )
}

export default UsuarioEdit
