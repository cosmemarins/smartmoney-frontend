// React Imports
import { Grid } from '@mui/material'

import ComissaoAgentesListTable from './ComissaoAgentesListTable'

const ComissaoAgentesList = () => {
  // States
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <ComissaoAgentesListTable />
      </Grid>
    </Grid>
  )
}

export default ComissaoAgentesList
