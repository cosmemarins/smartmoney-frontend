// React Imports
import { Grid } from '@mui/material'

import ComissaoGestorListTable from './ComissaoGestorListTable'

const ComissaoGestorList = () => {
  // States
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <ComissaoGestorListTable />
      </Grid>
    </Grid>
  )
}

export default ComissaoGestorList
