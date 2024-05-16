'use client'

import { useState } from 'react'

import Grid from '@mui/material/Grid'

// Component Imports
import ClienteProfileHeader from '@/views/cliente/components/ClientePageHeader'
import { clienteInit, clientePageHeaderInit, type ClientePageHeaderType } from '@/types/ClienteType'
import Identificacao from '@/views/cliente/components/identificacao'

const NewClienteProfile = () => {
  const [clienteProfileHeader, setClienteProfileHeader] = useState<ClienteProfileHeaderType>({
    ...clienteProfileHeaderInit,
    nome: 'Novo Cliente'
  })

  const updateClienteHeader = (nome: string) => {
    setClienteProfileHeader({
      ...clienteProfileHeader,
      nome
    })
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <ClienteProfileHeader data={clienteProfileHeader} />
      </Grid>
      <Grid item xs={12}>
        <Identificacao updateClienteHeader={updateClienteHeader} clienteData={clienteInit} />
      </Grid>
    </Grid>
  )
}

export default NewClienteProfile
