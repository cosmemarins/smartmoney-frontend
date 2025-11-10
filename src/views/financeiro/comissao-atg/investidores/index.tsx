// React Imports
import { Grid } from '@mui/material'

import ComissaoAtgInvestidoresListTable from './ComissaoAtgInvestidoresListTable'

const ComissaoAtgInvestidoresList = () => {
  // States
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <ComissaoAtgInvestidoresListTable />
      </Grid>
    </Grid>
  )
}

export default ComissaoAtgInvestidoresList
