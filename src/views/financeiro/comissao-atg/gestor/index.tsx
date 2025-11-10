// React Imports
import { Grid } from '@mui/material'

import ComissaoAtgGestorListTable from './ComissaoAtgGestorListTable'

const ComissaoAtgGestorList = () => {
  // States
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <ComissaoAtgGestorListTable />
      </Grid>
    </Grid>
  )
}

export default ComissaoAtgGestorList
