// React Imports
import type { ReactElement } from 'react'

// Next Imports
import dynamic from 'next/dynamic'

// MUI Imports
import Grid from '@mui/material/Grid'

// Component Imports
import ClienteProfile from '@views/cliente/view'
import getBancoList from '@/services/BancoService'

const IdentificacaoTab = dynamic(() => import('@/views/cliente/components/identificacao'))
const DadosBancariosTab = dynamic(() => import('@/views/cliente/view/dadosBancarios'))
const DocumentacaoTab = dynamic(() => import('@/views/cliente/view/documentacao'))
const SecurityTab = dynamic(() => import('@views/cliente/view/security'))
const ContratosTab = dynamic(() => import('@/views/cliente/view/contratos'))

// Vars
const tabContentList = (): { [key: string]: ReactElement } => ({
  identificacao: <IdentificacaoTab />,
  dadosBancarios: <DadosBancariosTab />,
  documentacao: <DocumentacaoTab />,
  security: <SecurityTab />,
  contratos: <ContratosTab />
})

const getBancosData = async () => {
  // Vars
  const bancoList = await getBancoList()

  return bancoList
}

const ClienteProfilePage = async () => {
  const bancoList = getBancosData()

  console.log('bancoList: ', bancoList)

  return (
    <Grid container spacing={6}>
      <Grid item xs={12} lg={12} md={12}>
        <ClienteProfile tabContentList={tabContentList()} />
      </Grid>
    </Grid>
  )
}

export default ClienteProfilePage
