import { Grid } from '@mui/material'

import ClienteListTable from './ClienteListTable'
import { ClienteProvider } from '@/contexts/ClienteContext'

const ClienteList = () => {
  // States
  return (
    <ClienteProvider>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <ClienteListTable />
        </Grid>
      </Grid>
    </ClienteProvider>
  )
}

export default ClienteList
