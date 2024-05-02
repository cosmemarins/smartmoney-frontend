'use client'

import Grid from '@mui/material/Grid'

// Component Imports
import ClienteProfileHeader from '../components/ClienteProfileHeader'
import { ClienteInit, type ClienteProfileHeaderType } from '@/types/ClienteType'
import DadosPrincipais from '../components/identificacao/DadosPrincipais'

const NewClienteProfile = () => {
  const clienteProfileHeader = {
    nome: 'Novo Cliente',
    foto: '/images/avatars/nobody.png',
    imagemCapa: '/images/pages/profile-banner.png',
    status: undefined
  } as ClienteProfileHeaderType

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <ClienteProfileHeader data={clienteProfileHeader} />
      </Grid>
      <Grid item xs={12}>
        <DadosPrincipais clienteData={ClienteInit} />
      </Grid>
    </Grid>
  )
}

export default NewClienteProfile
