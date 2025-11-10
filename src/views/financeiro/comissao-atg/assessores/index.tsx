// React Imports
import { Grid } from '@mui/material'

import ComissaoAtgAgentesListTable from './ComissaoAtgAgentesListTable'

const ComissaoAtgAgentesList = () => {
  // States
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <ComissaoAtgAgentesListTable />
      </Grid>
    </Grid>
  )
}

export default ComissaoAtgAgentesList
