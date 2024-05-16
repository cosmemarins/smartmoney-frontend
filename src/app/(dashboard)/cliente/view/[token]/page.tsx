'use client'

// MUI Imports
import Grid from '@mui/material/Grid'

import { ClienteProvider } from '@/contexts/ClienteContext'

// Component Imports
import ClienteProfile from '@views/cliente/view'

interface Props {
  params: { token: string }
}

const ClientePage = ({ params }: Props) => {
  return (
    <ClienteProvider>
      <Grid container spacing={6}>
        <Grid item xs={12} lg={12} md={12}>
          <ClienteProfile params={params} />
        </Grid>
      </Grid>
    </ClienteProvider>
  )
}

export default ClientePage
