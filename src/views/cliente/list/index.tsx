// React Imports
import { Grid } from '@mui/material'

import ClienteListTable from './ClienteListTable'

const ClienteList = () => {
  // States
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <ClienteListTable />
      </Grid>
    </Grid>
  )
}

export default ClienteList
