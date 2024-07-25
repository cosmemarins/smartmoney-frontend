// React Imports
import { Grid } from '@mui/material'

import ComissaoInvestidoresListTable from './ComissaoInvestidoresListTable'

const ComissaoInvestidoresList = () => {
  // States
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <ComissaoInvestidoresListTable />
      </Grid>
    </Grid>
  )
}

export default ComissaoInvestidoresList
