// React Imports
import { Grid } from '@mui/material'

import ExtratoListTable from './ExtratoListTable'

const ExtratoList = () => {
  // States
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <ExtratoListTable />
      </Grid>
    </Grid>
  )
}

export default ExtratoList
