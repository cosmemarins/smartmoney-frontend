// React Imports
import { Grid } from '@mui/material'

import UsuarioListTable from './UsuarioListTable'

const UsuarioList = () => {
  // States
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <UsuarioListTable />
      </Grid>
    </Grid>
  )
}

export default UsuarioList
