'use client'

// React Imports
import { useState } from 'react'
import type { SyntheticEvent } from 'react'

import Grid from '@mui/material/Grid'
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabPanel from '@mui/lab/TabPanel'

// Component Imports

import { useSession } from 'next-auth/react'

import CustomTabList from '@core/components/mui/TabList'
import UsuarioPageHeader from '../components/UsuarioPageHeader'

import DocumentacaoTab from './documentacao'
import DadosBancarios from './dadosBancarios'

import { useEquipeContext } from '@/contexts/EquipeContext'

import DadosUsuario from '@/views/equipe/components/DadosUsuario'
import { getPerfilUsuarioEnumDesc } from '@/utils/enums/PerfilUsuarioEnum'
import EnderecoUsuario from '../components/EnderecoUsuario'
import ConfiguracoesUsuario from '../components/ConfiguracoesUsuario'
import SegurancaTab from './seguranca'
import { isPerfilColaborador } from '@/utils/utils'

const EquipeEdit = () => {
  //hooks
  const { data: session } = useSession()

  // States
  const [activeTab, setActiveTab] = useState('identificacao')

  const { usuarioEquipe } = useEquipeContext()

  const handleChange = (event: SyntheticEvent, value: string) => {
    setActiveTab(value)
  }

  const handleNext = () => {}

  const handlePrev = () => {}

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
                  label={`Dados do ${usuarioEquipe?.perfil ? getPerfilUsuarioEnumDesc(usuarioEquipe?.perfil) : 'Usuário'}`}
                  iconPosition='start'
                />
                {usuarioEquipe?.token && (
                  <Tab icon={<i className='tabler-map' />} value='endereco' label='Endereço' iconPosition='start' />
                )}
                {usuarioEquipe?.token && (
                  <Tab
                    icon={<i className='tabler-building-bank' />}
                    value='dadosBancarios'
                    label='Dados Bancários'
                    iconPosition='start'
                  />
                )}
                {usuarioEquipe?.token && usuarioEquipe?.perfil && !isPerfilColaborador(usuarioEquipe?.perfil) && (
                  <Tab
                    icon={<i className='tabler-id-badge-2' />}
                    value='documentacao'
                    label='Documentação'
                    iconPosition='start'
                  />
                )}
                {usuarioEquipe?.token &&
                  session?.user.token != usuarioEquipe.token &&
                  usuarioEquipe?.perfil &&
                  !isPerfilColaborador(usuarioEquipe?.perfil) && (
                    <Tab
                      icon={<i className='tabler-settings' />}
                      value='configuracoesUsuario'
                      label='Configuracões'
                      iconPosition='start'
                    />
                  )}
                {usuarioEquipe?.token && (
                  <Tab icon={<i className='tabler-lock' />} value='seguranca' label='Segurança' iconPosition='start' />
                )}
              </CustomTabList>
            </Grid>
            <Grid item xs={12}>
              <TabPanel value='identificacao' className='p-0'>
                <DadosUsuario activeStep={0} steps={[]} handleNext={handleNext} handlePrev={handlePrev} />
              </TabPanel>
              {usuarioEquipe?.token && (
                <TabPanel value='endereco' className='p-0'>
                  <EnderecoUsuario activeStep={0} steps={[]} handleNext={handleNext} handlePrev={handlePrev} />
                </TabPanel>
              )}
              {usuarioEquipe?.token && (
                <TabPanel value='dadosBancarios' className='p-0'>
                  <DadosBancarios />
                </TabPanel>
              )}
              {usuarioEquipe?.token && (
                <TabPanel value='documentacao' className='p-0'>
                  <DocumentacaoTab />
                </TabPanel>
              )}
              {usuarioEquipe?.token && session?.user.token != usuarioEquipe.token && (
                <TabPanel value='configuracoesUsuario' className='p-0'>
                  <ConfiguracoesUsuario activeStep={0} steps={[]} handleNext={handleNext} handlePrev={handlePrev} />
                </TabPanel>
              )}
              {usuarioEquipe?.token && (
                <TabPanel value='seguranca' className='p-0'>
                  <SegurancaTab />
                </TabPanel>
              )}
            </Grid>
          </Grid>
        </TabContext>
      </Grid>
    </Grid>
  )
}

export default EquipeEdit
