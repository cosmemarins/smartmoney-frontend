// React Imports
import { Grid } from '@mui/material'

import ComissaoDiretorListTable from './ComissaoDiretorListTable'

const ComissaoDiretorList = () => {
  // States
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <ComissaoDiretorListTable />
      </Grid>
    </Grid>
  )
}

export default ComissaoDiretorList
