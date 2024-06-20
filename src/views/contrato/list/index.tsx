// React Imports
import { Grid } from '@mui/material'

import ContratoListTable from './ContratoListTable'

const ContratoList = () => {
  // States
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <ContratoListTable />
      </Grid>
    </Grid>
  )
}

export default ContratoList
