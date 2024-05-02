'use client'

// React Imports
import { useState } from 'react'
import type { SyntheticEvent, ReactElement } from 'react'

import Grid from '@mui/material/Grid'
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabPanel from '@mui/lab/TabPanel'

// Component Imports
import CustomTabList from '@core/components/mui/TabList'
import ClienteProfileHeader from '../components/ClienteProfileHeader'
import type { ClienteProfileHeaderType } from '@/types/ClienteType'

const ClienteProfile = ({ tabContentList }: { tabContentList: { [key: string]: ReactElement } }) => {
  // States
  const [activeTab, setActiveTab] = useState('identificacao')

  const handleChange = (event: SyntheticEvent, value: string) => {
    setActiveTab(value)
  }

  console.log('tabContentList', tabContentList)

  const clienteProfileHeader = {
    nome: 'Cosme Marins',
    local: 'Nova Iguaçu',
    foto: '/images/avatars/nobody.png',
    imagemCapa: '/images/pages/profile-banner.png',
    clienteDesde: 'abril 2020',
    status: 'Ativo'
  } as ClienteProfileHeaderType

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <ClienteProfileHeader data={clienteProfileHeader} />
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
                  icon={<i className='tabler-id-badge-2' />}
                  value='documentacao'
                  label='Documentação'
                  iconPosition='start'
                />
                <Tab
                  icon={<i className='tabler-building-bank' />}
                  value='dadosBancarios'
                  label='Dados bancários'
                  iconPosition='start'
                />
                <Tab icon={<i className='tabler-lock' />} value='security' label='Security' iconPosition='start' />
                <Tab
                  icon={<i className='tabler-briefcase' />}
                  value='contratos'
                  label='Contratos'
                  iconPosition='start'
                />
              </CustomTabList>
            </Grid>
            <Grid item xs={12}>
              <TabPanel value={activeTab} className='p-0'>
                {tabContentList[activeTab]}
              </TabPanel>
            </Grid>
          </Grid>
        </TabContext>
      </Grid>
    </Grid>
  )
}

export default ClienteProfile
