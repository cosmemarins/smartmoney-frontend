// React Imports
import { Grid } from '@mui/material'

import ComissionamentoListTable from './ComissionamentoListTable'

const ComissaoList = () => {
  // States
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <ComissionamentoListTable />
      </Grid>
    </Grid>
  )
}

export default ComissaoList
