// React Imports
import { Grid } from '@mui/material'

import ComissaoParceirosListTable from './ComissaoParceirosListTable'

const ComissaoParceirosList = () => {
  // States
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <ComissaoParceirosListTable />
      </Grid>
    </Grid>
  )
}

export default ComissaoParceirosList
